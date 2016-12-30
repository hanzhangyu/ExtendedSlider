# ExtendedSlider(地图放缩滑块)

> 考虑到这个需求很平常，而且可扩展到多个应用场景，就放出来

### 为什么造轮子

为什么antd的silder不支持垂直？

### 使用

> 环境：ES6，React,Antd和classnames

下载dist目录文件引入即可

#### 1.参数

```
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
```

**来一个简单的实例**

```
    <ExtendedSlider
        direction="vertical"
        style={{margin:'100px'}}
        step={100}
        max={1000}
        min={100}
        tipFormatter={(val)=>val+'zzz'}
        onChange={(val)=>{document.getElementById('input').value=val}}
    />
    <input type="text" id="input" style={{textAlign:'center'}} />
```

效果是这样的

![antd_select](https://github.com/hanzhangyu/ExtendedSlider/blob/master/app/img/ExtendedSlider.gif)

**当然你也可以这样玩**

```
     <ExtendedSlider
        style={{margin:'100px'}}
        step={100}
        max={1000}
        min={100}
        tipFormatter={(val)=>val+'zzz'}
        onChange={(val)=>{document.getElementById('input').value=val}}
    />
    <input type="text" id="input" style={{textAlign:'center'}} />
```

![antd_cascader](https://github.com/hanzhangyu/ExtendedSlider/blob/master/app/img/ExtendedSlider_noBtn.gif)

#### 2.样式

```
    @MainSize: 174px;//主轴长度
    @CrossSize: 30px;//纵轴长度
    @Space: 2px;//bar与button的间距
    @BarMainSize: 4px;//bar的宽度
    @SliderMainSize: 10px;//slider主轴长度
    @SliderCrossSize: @CrossSize - 2px;//slider纵轴长度
    @HorizontalBoxShadow: 1px 0px 4px rgba(0, 0, 0, 0.3);
    @VerticalBoxShadow: 0px 1px 4px rgba(0, 0, 0, 0.3);
    @HoverColor: #0097e0;//悬浮时的颜射
    @BtnHoverBoxShadow: 1px 1px 2px #888888;//悬浮时的阴影
    @BackgroundColor: #fff;
    @SliderBackgroundColor: #6b6b6b;
    @MarkBorderColor: #eee;
```

### 测试

首先安装modules`npm install`

然后直接运行`npm start`

打开`localhost:3000`

### 最后

mark功能项目不需要，暂时不写了，过了元旦回来在补充，HAPPY NEW YEAR




