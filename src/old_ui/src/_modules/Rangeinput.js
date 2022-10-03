import React from 'react'
import $ from 'jquery'

import './rangeinput.css'

export default function Rangeinput(data)
{
    const [ offset, setOffset ] = React.useState(0)
    const [ settings, setSettings ] = React.useState({
        min: 0,
        max: 100
    })

    React.useMemo(() =>
    {
        setSettings({
            min: data.data.min || 0,
            max: data.data.max || 100
        })
        setOffset(data.data.value || 0)
    }, [])

    // console.log($('.rangeinput')[0].clientWidth)

//     var off = myRange.offsetWidth / (parseInt(myRange.max) - parseInt(myRange.min));
// var px =  ((myRange.valueAsNumber - parseInt(myRange.min)) * off) - (myValue.offsetParent.offsetWidth / 2);
//
//   myValue.parentElement.style.left = px + 'px';
//   myValue.parentElement.style.top = myRange.offsetHeight + 'px';
//   myValue.innerHTML = myRange.value + ' ' + myUnits;
//
//   myRange.oninput =function(){
//     let px = ((myRange.valueAsNumber - parseInt(myRange.min)) * off) - (myValue.offsetWidth / 2);
//     myValue.innerHTML = myRange.value + ' ' + myUnits;
//     myValue.parentElement.style.left = px + 'px';
//   };

    return (
        <div className="rangeinput" id={data.data.id}>
            <span>{settings.min}</span>
            <span style={{left: '50%', transform: "translateX(-50%)"}}>{offset}</span>
            <div style={{width: ((offset / settings.max)) * 315 + "px", display: "none"}}></div>
            <input value={offset} onChange={e => setOffset(e.target.value)} type="range" className="input-range" min={settings.min} max={settings.max} />
            <span>{settings.max}</span>
        </div>
    )
}
