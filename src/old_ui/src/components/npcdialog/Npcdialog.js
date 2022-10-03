import React from 'react'
import {ReactSVG} from 'react-svg'
import $ from 'jquery'

import './css.css'
import ragemp from '../../_modules/ragemp'

export default function Npcdialog()
{
    const [ data, setData ] = React.useState({
        toggle: false,
        id: '',
        title: '',
        desc: '',
        text: '',
        btns: []
    })

    function success(btn)
    {
        ragemp.send('ui::npcdialog', {
            id: data.id,
            btn
        })
    }

    React.useMemo(() =>
    {
        ragemp.eventCreate('client::npcdialog', (cmd, data) =>
        {
            switch(cmd)
            {
                case 'show':
                {
                    setData({
                        toggle: true,
                        ...data
                    })
                    break
                }
                case 'hide':
                {
                    setData({
                        toggle: false,
                        id: '',
                        title: '',
                        desc: '',
                        text: '',
                        btns: []
                    })
                    break
                }
            }
        })
    }, [])

    return (
        <div className="npcdialog" style={!data.toggle ? {display: 'none'} : {}}>
            <h1>{data.title}</h1>
            <h2>{data.desc}</h2>
            <div className="npcdialog-text">
                {data.text}
            </div>
            <div className="npcdialog-btn">
                {data.btns.map((item, i) =>
                {
                    return <button onClick={() => success(i)} key={i} className="btn btn-ui">{item}</button>
                })}
            </div>
        </div>
    )
}
