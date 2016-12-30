/**
 * Created by Paul on 2016/12/29.
 */
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import style from './style.less';
import classnames from 'classnames';

// 调试用，记得删
import { merge,map,cloneDeep } from 'lodash';

import { Tooltip,Icon } from 'antd';

const HORIZONTAL_PROPS = {
    offset: 'offsetWidth',
    client: 'clientX',
    position: 'left'
};
const VERTICAL_PROPS = {
    offset: 'offsetHeight',
    client: 'clientY',
    position: 'bottom'
};
var rangeFix = (num, max, min)=>num > max ? max : num > min ? num : min;
// 在移动的时候需要计算多次这个值，所以curry一下
function getPosition(other, e) {
    return (this.props.direction == 'vertical' ? (other - e[VERTICAL_PROPS.client]) : (e[HORIZONTAL_PROPS.client] - other)) - this.state.halfSliderLength;
}

var ExtendedSlider = React.createClass({
    mixins: [PureRenderMixin],
    getInitialState() {
        let num = parseInt(this.props.value) || 0,
            {max,min}=this.props;
        num=rangeFix(num, max, min);
        return {
            num: num,
            prevNum: num,
            position: num,
            length: 0,
            halfSliderLength: 0,
            type: this.props.direction == 'vertical' ? VERTICAL_PROPS : HORIZONTAL_PROPS,
            canMove: false
        }
    },
    getDefaultProps(){
        return {
            direction: 'horizontal',
            hasBtns: true,
            max: 100,
            min: 0,
            step: 1,
            //marks:{},
            disabled: false,
            //dots:false,
            onChange(){
            }
        }
    },
    setNum(e){
        var position = getPosition(e),
            {max,min}=this.props,
            {length}=this.state;
        position = rangeFix(position, length, 0);
        this.setState({prevNum: this.state.num});
        var num = position * (max - min) / length + min;
        this.setState({position: position, num: num})
    },
    resize(){
        var {num,type}=this.state;
        var {min,max,direction}=this.props;
        let ele = this.refs.bar,
            sliderEle = this.refs.slider,
            sliderLength = sliderEle[type.offset],
            length = ele[type.offset];
        getPosition = getPosition.bind(this, direction == 'vertical' ? (length + ele.getBoundingClientRect().top) : ele.getBoundingClientRect().left);
        // 定位是以slider中心来算的,所以length: length - sliderLength
        this.setState({
            length: length - sliderLength,
            position: (num - min) * length / (max - min),
            halfSliderLength: sliderLength / 2
        });
    },
    mouseMove(e){
        if (!this.state.canMove)return;
        this.setNum(e)
    },
    changeByStep(isPlus){
        var {step,max,min}=this.props;
        this.setState((state)=>{
            state.num=rangeFix(state.num+step*isPlus,max,min);
            state.position=(state.num - min) * state.length / (max - min);
        })
    },
    componentDidUpdate(){
        if (!this.state.canMove) {
            let {prevNum,num,length,position}=this.state;
            let {step,min,max,onChange}=this.props;
            if (step !== undefined) {
                this.setState({prevNum: num});
                let steps = (num - min) / step,
                    stepsFix = ~~steps;
                if (steps != stepsFix) {
                    if ((steps - stepsFix) > 0.5) {
                        num = (stepsFix + 1) * step + min
                    } else if ((steps - stepsFix) <= 0.5) {
                        num = (stepsFix) * step + min
                    }
                    position = (num - min) * length / (max - min);
                    this.setState({position: position, num: num})
                }
            }
            prevNum != num && onChange(num);
        }
    },
    componentDidMount(){
        // 等待style载入
        setTimeout(this.resize,300);
    },
    render(){
        var {direction,style,hasBtns,disabled,max,min,tipFormatter}=this.props;
        var {num,position,type}=this.state;
        var slider = <div style={{[type.position]:position+'px'}}
                          className={classnames('extended_slider-slider' ,{'disabled':disabled})}
                          ref="slider"
                          onMouseDown={(e)=>{e.stopPropagation();this.setState({canMove:true})}}></div>;
        return (
            <div style={style}
                 className={classnames('extended_slider',{'extended_slider_vertical':direction=='vertical','extended_slider_horizontal':direction!='vertical'})}
                 ref="extendedSlider">
                {
                    hasBtns &&
                    <div>
                        <div className={classnames('extended_slider-btn' ,{'disabled':num==max||disabled})}
                             onClick={this.changeByStep.bind(this,1)}>
                            <Icon type="plus"/></div>
                        <div className={classnames('extended_slider-btn' ,{'disabled':num==min||disabled})}
                             onClick={this.changeByStep.bind(this,-1)}><Icon
                            type="minus"/></div>
                    </div>
                }
                <div className="extended_slider-bar clearfix"
                     style={!hasBtns?{top:0,bottom:0,left:0,right:0}:{}}
                     onMouseMove={(e)=>{this.mouseMove(e)}}
                     onMouseLeave={()=>{this.state.canMove&&this.setState({canMove:false})}}
                     onMouseUp={()=>{this.setState({canMove:false})}}>
                    <div className="extended_slider-bg" ref="bar"
                         onClick={(e)=>{this.setNum(e)}}></div>
                    {/*
                     <ul className="extended_slider-marks-wrap">
                     <li className="extended_slider-mark"><span>测试</span></li>
                     </ul>
                     */}
                    {
                        tipFormatter ?
                            <Tooltip title={tipFormatter(num).toString()}
                                     placement={direction=='vertical'?'left':'top'}
                                     getTooltipContainer={()=>ReactDOM.findDOMNode(this.refs.slider)}>
                                {slider}
                            </Tooltip> : slider

                    }
                </div>
            </div>
        )
    }
});

ExtendedSlider.propTypes = {
    style: PropTypes.object,
    hasBtns: PropTypes.bool, // 是否存在加减按钮
    direction: PropTypes.string, // vertical or horizontal
    max: PropTypes.number,//最小值
    min: PropTypes.number,//最大值
    value: PropTypes.number,//设置当前取值。当 range 为 false 时，使用 Number，否则用 [Number, Number]
    step: PropTypes.number,  // 步长，取值必须大于 0，并且可被 (max - min) 整除,当 marks 不为空对象时，可以设置 step 为 null
    //marks: PropTypes.object,  // 刻度标记，key 的类型必须为 Number 且取值在闭区间 [min, max] 内
    //marksShow:PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),// marks是否显示，可为true(常显)，false(隐藏)，hover(仅当鼠标移至ExtendedSlider內时触发)
    disabled: PropTypes.bool,  // 禁用
    //dots: PropTypes.bool,  //是否只能拖拽到刻度上，不在刻度上的话会在鼠标离开之后移到最近的Mark
    onChange: PropTypes.func,  // 当 Slider 的值发生改变时触发，Function(value)
    tipFormatter: PropTypes.func,  // hover在当前选定值是的tooltip，可以不设置就不会出现tooltip
};

export default ExtendedSlider;