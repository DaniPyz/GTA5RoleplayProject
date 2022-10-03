import './css.scss'

import $ from 'jquery'
import BGLOGO from './images/bgLogo.png'
import GRAPH from './images/graph.svg'
import INFO from './images/info.svg'
import LOGO from './images/logo.png'
import React from 'react'
import { ReactSVG } from 'react-svg'
import htmlReactParser from 'html-react-parser'
import ragemp from '../../_modules/ragemp'

export default function House() {
    const [toggle, setToggle] = React.useState(false)
    const [houseInfo, setHouseInfo] = React.useState({
        type: 'sell',
        propertyType: 'Квартира',
        propertyId: 5,
        propertyClass: 'Люкс',
        propertyParkingLots: 4,
        ownerName: 'Dapy Rogers',
        propertyPrice: 1000,
        propertyFee: 50,
        propertyBalance: 1000,

        btn: ['Открыть', 'Мебель', 'Открыть шкаф', 'Продать']
    })
    function numberWithSpaces(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    function click(id) {
        ragemp.send('ui::dialog', {
            id: id,
            type: houseInfo.type
        })
    }

    React.useMemo(() => {
        ragemp.eventCreate('client::house', (cmd, data) => {
            switch (cmd) {
                case 'dialog':
                    {
                        setHouseInfo(data)
                        break
                    }
                case 'toggle':
                    {
                        setToggle(data.status)
                        break
                    }
            }
        })
    }, [])


    return (
        <>
            {
                houseInfo.type === 'buy' ?
                    <div className="house-dialog" style={!toggle ? { display: 'none' } : {}}>
                        <div className="dialog-header">
                            <img className='logo' src={LOGO} alt="logo" />
                            <h1>NewY<span>o</span>rk</h1>
                            <h2>STATE</h2>
                        </div>
                        <h1 className="dialog-title">{ }</h1>
                        <section className="dialog-body">
                            <h1>{houseInfo.propertyType} <span>#{houseInfo.propertyId}</span></h1>
                            <div >
                                <p>Тип: <span>{houseInfo.propertyClass}</span></p>
                                <p>Парковочных мест: <span>{houseInfo.propertyParkingLots}</span></p>
                            </div>
                            <div >
                                <p>Цена: <span>{houseInfo.propertyPrice}$</span></p>
                                <p>Налог: <span>{houseInfo.propertyFee}$</span></p>
                            </div>
                            <p>Владелец: <span>{houseInfo.ownerName}</span></p>
                        </section>
                        <section className="dialog-btn">
                            {houseInfo.btn.map((item, i) => {
                                return (<button onClick={() => click(i)} key={i} className={`btn`}>{item}</button>)
                            })}

                        </section>
                        <div className="blip" />
                        <img className='bgLogo' src={BGLOGO} alt="bglogo" />
                    </div>
                    :
                    <div className="house-dialog-info" style={!toggle ? { display: 'none' } : {}}>
                        <div className="dialog-header">
                            <div className="header_left">
                                <img className='logo' src={LOGO} alt="logo" />
                                <span>
                                    <h1>NewY<span>o</span>rk</h1>
                                    <h2>STATE</h2>
                                </span>
                            </div>
                            <div className="header_right">
                                <p>{houseInfo.propertyType} <span>#{houseInfo.propertyId}</span></p>
                            </div>

                        </div>
                        <h1 className="dialog-title"></h1>
                        <section className="dialog-body">
                            {/* <h1>{houseInfo.propertyType} <span>#{houseInfo.propertyId}</span></h1> */}
                            <div className="dialog-body-text">
                                <p>Тип: <span>{houseInfo.propertyClass}</span></p>
                                <p>Деньги на счету: <span>{numberWithSpaces(houseInfo.propertyBalance)}$</span></p>
                                <p>Стоймость: <span>{numberWithSpaces(houseInfo.propertyPrice)}$</span></p>
                                <p>Налог в час: <span>{numberWithSpaces(houseInfo.propertyFee)}$</span></p>
                                <p>Налог в день: <span>{numberWithSpaces(houseInfo.propertyFee * 24)}$</span></p>
                            </div>
                            <div className="dialog-body-btn">
                                <img src={INFO} alt="info" />
                                <img src={GRAPH} alt="graph" />
                            </div>
                        </section>
                        <section className="dialog-btn">
                            {houseInfo.btn.map((item, i) => {
                                return (<button onClick={() => click(i)} key={i} className={`btn`}>{item}</button>)
                            })}

                        </section>
                        <div className="blip" />
                        <img className='bgLogo' src={BGLOGO} alt="bglogo" />
                    </div>
            }


        </>
    )
}
