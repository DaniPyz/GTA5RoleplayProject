import './css.scss'

import $ from 'jquery'
import BGLOGO from './images/bgLogo.png'
import LOGO from './images/logo.png'
import React from 'react'
import { ReactSVG } from 'react-svg'
import htmlReactParser from 'html-react-parser'
import ragemp from '../../_modules/ragemp'

export default function Dialog() {
    const [dialog, setDialog] = React.useState({
        status: false,
        type: 'taxi',
        title: 'Аренда машины такси',
        body: 'Вы хотите арендовать машину такси за 500$?',

        input: [],
        btn: ['Арендовать', 'Отказаться']
    })

    function click(id) {
        ragemp.send('ui::dialog', {
            id: id,
            type: dialog.type
        })
    }

    React.useMemo(() => {
        ragemp.eventCreate('client::dialog', (cmd, data) => {
            switch (cmd) {
                case 'dialog':
                    {
                        setDialog(data)
                        break
                    }
            }
        })
    }, [])

    // React.useEffect(() => {
    //     for (var i in dialog.body) {
    //         i = parseInt(i)
    //         if (dialog.body[i] === '{') {
    //             let color = dialog.body.substring(i + 1, i + 8)
    //             dialog.body = dialog.body.substring(0, i) + `<span style="color: ${color};" />` + dialog.body.substring(i + 8)
    //         }
    //         if (dialog.body[i] === '}') dialog.body = dialog.body.replace("}", "")
    //     }
    // })
    return (
        <>
            <div className="dialog" style={!dialog.status ? { display: 'none' } : {}}>
                    <div className="dialog-header">
                        <img className='logo' src={LOGO} alt="logo" />
                        <h1>NewY<span>o</span>rk</h1>
                        <h2>jobS</h2>
                    </div>
                    <h1 className="dialog-title">{dialog.title}</h1>
                    <section className="dialog-body">
                        {htmlReactParser(dialog.body)}
                        {dialog.input && dialog.input.map((item, i) => {
                            return (<input onClick={e => item.value = e.target.value} key={i} className="input" type={item.type} placeholder={item.placeholder} value={item.value || ''} />)
                        })}
                    </section>
                    <section className="dialog-btn">
                        {dialog.btn.map((item, i) => {
                            return (<button onClick={() => click(i)} key={i} className={`btn`}>{item}</button>)
                        })}

                    </section>
                    <div className="blip" />
                    <img className='bgLogo' src={BGLOGO} alt="bglogo" />
                </div>
    

        </>
    )
}
