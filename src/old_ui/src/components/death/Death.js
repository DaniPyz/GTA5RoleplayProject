import React from 'react'
import {ReactSVG} from 'react-svg'
import $ from 'jquery'

import './css.css'
import ragemp from '../../_modules/ragemp'

export default function Death()
{
    const [ death, setDeath ] = React.useState({
        status: false,
        timer: 0
    })

    React.useMemo(() =>
    {
        setInterval(() =>
        {
            if($('.death').attr('data-status') === 'true')
            {
                let timer = parseInt($('.death').attr('data-timer'))

                if(timer > 0) setDeath({ status: Boolean($('.death').attr('data-status')), timer: timer -= 1000})
                else ragemp.send('ui::death')
            }
        }, 1000)

        ragemp.eventCreate("client::death", (cmd, data) =>
        {
            if(cmd === 'death') setDeath({
                status: true,
                timer: data.timer
            })
            else if(cmd === 'closedeath') setDeath({
                status: false,
                timer: 0
            })
        })
    }, [])

    function click(status)
    {
        ragemp.send('ui::death:click', {
            status,
            timer: death.timer
        })
    }

    return (
        <div className="death" data-status={death.status} data-timer={death.timer} style={!death.status ? {display: 'none'} : {}}>
            <div className="death-wrap">
                <h1>Вы почти</h1>
                <h2>
                    Мертвы
                    <br />
                    {new Date(death.timer).toLocaleString('ru-RU', {
                        minute: 'numeric',
                        second: 'numeric'
                    })}
                </h2>

                <div className="death-img">
                    <img src={require('./images/death_1.png')} />
                    <img src={require('./images/death_2.png')} />
                    <img src={require('./images/death_3.png')} />
                </div>

                <div className="death-btn">
                    <button onClick={() => click(true)} className="btn">Вызвать медиков</button>
                    <button onClick={() => click(false)} className="btn">Я хочу на тот свет</button>
                </div>
            </div>
        </div>
    )
}
