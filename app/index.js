import React from 'react';
import ReactDOM from 'react-dom';
import ExtendedSlider from '../dist';

ReactDOM.render(
    <div>
        <ExtendedSlider
            style={{margin:'100px'}}
            step={100}
            max={1000}
            min={100}
            tipFormatter={(val)=>val+'zzz'}
            onChange={(val)=>{document.getElementById('input').value=val}}
        />
        <input type="text" id="input" style={{textAlign:'center'}} />
    </div>,
    document.getElementById('content')
);