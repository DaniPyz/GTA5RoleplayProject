import './css.css'

import IMG_BANKCASH from './images/bankcash.png'
import IMG_CASH from './images/cash.png'
import IMG_ERROR from './images/error.png'
import IMG_SUCCESS from './images/success.png'
import IMG_WARNING from './images/warning.png'
import React from 'react'
import Wrapper from './Wrapper';
import ragemp from '../../_modules/ragemp'

export default function Notf() {
    const [notf, setNotf] = React.useState([
    ])

    function addNotf(data) {
        let notfLength = notf.length

        data.timeout = setTimeout(() => {
            data.id = notfLength
            setNotf(old => old.filter(item => item.id !== notfLength))


        }, data.time || 5000)
        data.completed = 100
        setNotf(old => [...old, data])

    }

    React.useMemo(() => {
        ragemp.eventCreate('client::notf', (cmd, data) => {
            if (cmd === 'add') addNotf(data)
        })
    }, [])

    return (
        <div className="notf">
            {/* <button onClick={() => {
                addNotf({
                    time: 100000,
                    text: 'adasdasdasdas',
                    type: 'donate'
                })
            }}>add</button> */}
            {notf.map((item, i) => {
                return (

                    <Wrapper item={item} i={i} />
                )
            })}
        </div>
    )
}
