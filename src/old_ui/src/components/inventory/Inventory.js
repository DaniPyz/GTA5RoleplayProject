/* eslint-disable jsx-a11y/alt-text */
// @ts-nocheck
/* eslint-disable default-case */

import './css.scss'

import $ from 'jquery'
import IMG_ITEM_USER from './images/user.svg'
import IMG_ITEM_USER_ACCESSORY from './images/user_accessory.png'
import IMG_ITEM_USER_ARMOUR from './images/user_armour.png'
import IMG_ITEM_USER_BACKPACK from './images/user_backpack.png'
import IMG_ITEM_USER_BODY from './images/user_body.png'
import IMG_ITEM_USER_BOTTOM from './images/user_bottom.png'
import IMG_ITEM_USER_CAM from './images/user_camera.png'
import IMG_ITEM_USER_HEADER from './images/user_header.png'
import IMG_ITEM_USER_PANTS from './images/user_pants.png'
import IMG_ITEM_USER_SECOND_ACCESSORY from './images/user_accessory_second.png'
import IMG_ITEM_USER_SHIRT from './images/user_shirt.png'
import IMG_ITEM_USER_WEAPON from './images/user_weapon.png'
import React from 'react'
import { ReactSVG } from 'react-svg'
import ragemp from '../../_modules/ragemp'

export default function Inventory() {
    const [toggle, setToggle] = React.useState(false)

    const [data, setData] = React.useState({
        inventory: [
            {
                id: 1, name: 'Телефон', desc: 'Для звонков', weight: 0.3, img: 'phone.png', status: 4, count: 1, info: [
                    { name: 'Сим карта', value: '8 800 555 35 35' }
                ]
            },
            {
                id: 2, name: 'Семена', desc: 'Для звонков', weight: 0.6, img: 'phone.png', status: 4, count: 10, info: [
                    { name: 'Сим карта', value: '8 800 555 35 35' }
                ]
            }
        ],
        player: 'Dapy Rogers',
        backpack: [
            { id: 1, name: 'Телефон', desc: 'Для звонков', weight: 0.3, img: 'phone.png', status: 4, count: 1, info: [] },
            { id: 2, name: 'Кепка', desc: 'Для головы', weight: 0.1, img: 'cap.png', status: 2, count: 2, info: [] }
        ],
        weapons: [{
            id: 1, name: 'Assault Riffle', desc: 'Для звонков', weight: 0.3, ammo: 30, img: 'rifle.png', status: 4, info: [
                { name: 'Сим карта', value: '8 800 555 35 35' }
            ]
        }],
        // { id: 2, name: 'Кепка', desc: 'Для головы', weight: 0.1, img: 'cap.png' }
        user: {
            cap: 0,
            body: 0,
            armour: 0,
            accessory: 0,
            accessory2: 0,
            accessory3: 0,
            shirt: 0,
            pants: 0,
            bottom: 0,
            camera: 0,
            backpack: 0
        },
        keys: [
            {
                id: 1, name: 'Телефон', desc: 'Для звонков', weight: 0.3, img: 'phone.png', status: 4, info: [
                    { name: 'Сим карта', value: '8 800 555 35 35' }
                ]
            }
        ],

        invData: {
            lvl: 1,
            weight: 1,
            maxWeight: 5
        },
        backpackData: {
            lvl: 1,
            weight: 3,
            maxWeight: 5
        },
        armourData: null
    })



    const [elemSelected, setElemSelected] = React.useState({
        status: false,
        id: 0,
        type: 'backpack',
        indexInSection: 10,
        menuX: 0,
        menuY: 0,

        item: { id: -1, name: '', desc: '', weight: 0, img: '', status: 0, info: [] }
    })
    function handleClick(type, id, _elem) {
        
       
        if (_elem.type === 'contextmenu') {
            setElemSelected({
                status: true,
                id,
                type,
                indexInSection: _elem.nativeEvent.path[1].id.split('-')[3],
                menuX: getElemSelectedPos(_elem.currentTarget).x,
                menuY: getElemSelectedPos(_elem.currentTarget).y,

                item: data[type][id]
            })
            use(type, id, _elem.nativeEvent.path[1].id.split('-')[3] )
        }
    }
   
    function elemClick(type, id, _elem) {
        
        console.log(type)
        if (!elemSelected.status
            && (type === 'user' || type === 'keys' || type === 'weapons' )) {
            ragemp.send('ui::inventory:takeoff', {
                type,
                id
            })
        }
        else {
            
            if (!elemSelected.status) {
             
                setElemSelected({
                    status: true,
                    id,
                    type,
                    indexInSection: _elem.nativeEvent.path[1].id.split('-')[3],
                    menuX: getElemSelectedPos(_elem.currentTarget).x,
                    menuY: getElemSelectedPos(_elem.currentTarget).y,

                    item: data[type][id]
                })
            }
            else {
                if (type !== elemSelected.type
                    || id !== elemSelected.id) {
                    if (!data[type][id]) {
                        ragemp.send('ui::inventory:set', {
                            insertType: type,
                            insertID: id,

                            type: elemSelected.type,
                            id: elemSelected.id
                        })
                    }
                    else {
                        ragemp.send('ui::inventory:trade', {
                            tradeType: type,
                            tradeID: id,

                            insertType: elemSelected.type,
                            insertID: elemSelected.id
                        })
                    }
                }
                elemClear()
            }
            
        }
    }
    function elemClear() {
        setElemSelected({
            status: false,
            id: 0,
            type: 'backpack',
            menuX: 0,
            menuY: 0,

            item: { id: -1, name: '', desc: '', weight: 0, img: '', status: 0, info: [] }
        })
    }
    function getElemSelectedPos(_elem) {
        const data = {
            x: $(_elem).position().left + 945,
            y: $(_elem).position().top + $('.inv-inventory-menu').height() / 2 + 105
        }

        if (data.x - ($('.inv-inventory-menu').width() / 2 - 30) > 0) data.y = data.y - ($('.inv-inventory-menu').width() / 2 + 30)
        return data
    }

    function use(type, id, indexInSection) {
        ragemp.send('ui::inventory:useItem', {
            type,
            id,
            indexInSection
        })
        elemClear()
    }
    function drop(type, id, indexInSection) {
        ragemp.send('ui::inventory:dropItem', {
            type,
            id,
            indexInSection
        })
        elemClear()
    }
    function split(type, id, indexInSection) {
        ragemp.send('ui::inventory:splitItem', {
            type,
            id,
            indexInSection
        })
        elemClear()
    }


    const [trade_toggle, trade_setToggle] = React.useState(false)
    const [trade_data, trade_setData] = React.useState({
        me: {
            items: [null, null,
                {
                    id: 1, name: 'Телефон', desc: 'Для звонков', weight: 0.3, img: 'phone.png', status: 4, info: [
                        { name: 'Сим карта', value: '8 800 555 35 35' }
                    ], _slot: 0, _type: "inventory"
                }
            ],
            cash: 0,
            yes: false
        },
        user: {
            items: [
                {
                    id: 1, name: 'Телефон', desc: 'Для звонков', weight: 0.3, img: 'phone.png', status: 4, info: [
                        { name: 'Сим карта', value: '8 800 555 35 35' }
                    ]
                }
            ],
            cash: 0,
            yes: false,

            username: 'Nezuko Kamado ( 567 )'
        },
        items: [
            {
                id: 1, name: 'Телефон', desc: 'Для звонков', weight: 0.3, img: 'phone.png', status: 4, info: [
                    { name: 'Сим карта', value: '8 800 555 35 35' }
                ], _type: "inventory", _slot: 0
            }
        ]
    })
    const [trade_addItem, trade_setAddItem] = React.useState(false)
    const [trade_timer, trade_setTimer] = React.useState(0)

    function tradeAddItem(id, type) {
        ragemp.send('ui::inventory:trade:addItem', {
            id: id,
            type: type
        })
    }
    function tradeDeleteItem(id) {
        ragemp.send('ui::inventory:trade:deleteItem', {
            id: id
        })
    }
    function tradeSelectItemData(id, _elem, type = 'me') {
        if (!elemSelected.status) {
            setElemSelected({
                status: true,
                id,
                type: `trade-${type}`,
                indexInSection: _elem.nativeEvent.path[1].id.split('-')[3],
                menuX: getElemSelectedPos(_elem.currentTarget).x,
                menuY: getElemSelectedPos(_elem.currentTarget).y,

                item: trade_data[type].items[id]
            })
        }
        else elemClear()
    }
    function tradeFindMeItems(item) {
        let status = true
        trade_data.me.items.map((item, i) => {
            if (item
                && item._type === item._type
                && item._slot === item._slot) status = true
        })
        return status
    }

    React.useMemo(() => {
        ragemp.eventCreate('client::inventory', (cmd, data) => {
            switch (cmd) {
                case 'toggle':
                    {
                        setToggle(data.status)
                        break
                    }
                case 'update':
                    {
                        setData(data)
                        break
                    }

                case 'tradeToggle':
                    {
                        trade_setToggle(data.status)
                        break
                    }
                case 'tradeUpdate':
                    {
                        trade_setData(data)
                        break
                    }
                case 'tradeUpdateTimer':
                    {
                        trade_setTimer(data.timer)
                        break
                    }
            }
        })
    }, [])

    return (
        <>
            <div className="trade" style={!trade_toggle ? { display: 'none' } : {}}>
                <div className="trade-section" style={trade_addItem ? { display: 'none' } : {}}>
                    <header className="header-deg">
                        <h1>
                            Обмен
                            <span>Предметами</span>
                        </h1>
                    </header>
                    <div className="trade-elem">
                        <h2>Вы отдаете</h2>
                        <section>
                            {Array.from(Array(8).keys()).map((item, i) => {
                                if (trade_data.me.items[i]) return (<div onClick={e => tradeSelectItemData(i, e)} key={i} className={`inv-elem inv-elem-select ${elemSelected.status && elemSelected.type === 'trade-me' && elemSelected.id === i ? 'inv-elem-selected' : ''}`}>
                                    <img src={require(`./images/items/${trade_data.me.items[i].img}`)} />
                                    <span>{trade_data.me.items[i].name}</span>
                                </div>)
                                return (<div onClick={() => trade_setAddItem(true)} key={i} className="inv-elem"></div>)
                            })}
                        </section>
                        <div className="trade-cash">
                            <div>
                                <h2>Сумма денег к обмену</h2>
                                <span>$ <input type="number" onChange={e => ragemp.send('ui::inventory:trade:cash', { cash: e.target.value })} /></span>
                            </div>
                            <div>
                                <h2>Готовность к обмену</h2>
                                <input checked={trade_data.me.yes} className="input-checkbox" type="checkbox" onChange={e => ragemp.send('ui::inventory:trade:go', { status: e.target.value === 'on' ? true : false })} />
                            </div>
                        </div>
                    </div>
                    <div className={`trade-user trade-elem ${!trade_data.user.yes && 'trade-elem-no'}`}>
                        <h2>Вы получаете от {trade_data.user.username}</h2>
                        <section>
                            {Array.from(Array(8).keys()).map((item, i) => {
                                if (trade_data.user.items[i]) return (<div onClick={e => tradeSelectItemData(i, e, 'user')} key={i} className={`inv-elem inv-elem-select ${elemSelected.status && elemSelected.type === 'trade-user' && elemSelected.id === i ? 'inv-elem-selected' : ''}`}>
                                    <img src={require(`./images/items/${trade_data.user.items[i].img}`)} />
                                    <span>{trade_data.user.items[i].name}</span>
                                </div>)
                                return (<div key={i} className="inv-elem"></div>)
                            })}
                        </section>
                        <div className="trade-cash">
                            <div>
                                <h2>Сумма денег к обмену</h2>
                                <h3>${trade_data.user.cash.toLocaleString()}</h3>
                            </div>
                            <div>
                                <h2>Готовность к обмену</h2>
                                <input className="input-checkbox" type="checkbox" disabled checked />
                            </div>
                        </div>
                    </div>
                    <div className="trade-elem">
                        <button style={trade_timer === 0 ? { display: 'none' } : {}} className="btn btn-select">Обмен произойдет через {trade_timer} секунд</button>
                        <button onClick={() => ragemp.send('ui::inventory:trade:cancel')} className="btn">Отменить обмен</button>
                    </div>
                </div>
                <div className="trade-section trade-section-myitems" style={!trade_addItem ? { display: 'none' } : {}}>
                    <header className="header-deg">
                        <h1>
                            Обмен
                            <span>Предметами</span>
                        </h1>
                    </header>
                    <div className="trade-elem">
                        <h2>Ваши предметы</h2>
                        <section>
                            {Array.from(Array(104).keys()).map((item, i) => {
                                if (trade_data.items[i]) return (<div onClick={() => tradeAddItem(i, trade_data.items[i]._type)} key={i} className={`inv-elem inv-elem-select ${tradeFindMeItems(trade_data.items[i]) && 'inv-elem-selected'}`}>
                                    <img src={require(`./images/items/${trade_data.items[i].img}`)} />
                                    <span>{trade_data.items[i].name}</span>
                                </div>)
                                return (<div key={i} className="inv-elem"></div>)
                            })}
                        </section>
                    </div>
                    <div className="trade-elem">
                        <button onClick={() => trade_setAddItem(false)} className="btn btn-select">Вернуться назад</button>
                    </div>
                </div>
            </div>


            <div className="inv" style={!toggle ? { display: 'none' } : {}}>

                <div className="inv-header-hints">
                    <div className="inv-header-hints-wrapper">
                        <div >
                            <span>I</span>
                            <p>Инвентарь</p>
                        </div>
                        <div >
                            <span>Esc</span>
                            <p>Выйти</p>
                        </div>
                    </div>
                    <div className='slider'><div></div></div>
                </div>

                <div className="inv-wrap">
                    <div className="inv-body">
                        <div className="inv-header">
                            <section>
                                <h1>
                                    Быстрый
                                    <h2>Слот</h2>
                                </h1>
                            </section>
                        </div>

                        <div className="inv-body inv-keys inv-fast">
                            {Array.from(Array(5).keys()).map((item, i) => {
                                if (!data.keys[i]) return (<div className="inv-keys-item">
                                    <section onClick={e => elemClick('keys', i, e)} id={`inv-inventory-elem-${i}`} key={i} className='inv-elem'></section>
                                    <h5>{i + 1}</h5>
                                </div>)
                                return (
                                    <div className="inv-keys-item">
                                        <section onClick={e => elemClick('keys', i, e)} id={`inv-inventory-elem-${i}`} key={i} className={`inv-elem inv-elem-size ${elemSelected.status && elemSelected.type === 'keys' && elemSelected.id === i ? 'inv-elem-selected' : ''}`}>
                                            <img src={require(`./images/items/${data.keys[i].img}`)} />
                                            <span>{data.keys[i].name}</span>
                                        </section>
                                        <h5>{i + 1}</h5>
                                    </div>)
                            })}
                        </div>
                    </div>
                    <div className="inv-body">
                        <div className="inv-header">
                            <section>
                                <h1>
                                    Оружие
                                    <h2>Экипировано</h2>
                                </h1>
                            </section>
                        </div>

                        <div className="inv-body inv-keys inv-fast">
                            {Array.from(Array(5).keys()).map((item, i) => {
                                if (!data.weapons[i]) return (<div className="inv-keys-item">
                                    <section onClick={e => elemClick('weapons', i, e)} id={`inv-inventory-elem-${i}`} key={i} className='inv-elem-weapon'>
                                        <img className='demo' src={IMG_ITEM_USER_WEAPON} />
                                    </section>

                                </div>)
                                return (
                                    <div className="inv-keys-item">
                                        <section onClick={e => elemClick('weapons', i, e)} id={`inv-inventory-elem-${i}`} key={i} className={`inv-elem-weapon inv-elem-weapon-size ${elemSelected.status && elemSelected.type === 'weapons' && elemSelected.id === i ? 'inv-elem-selected' : ''}`}>
                                            <img src={require(`./images/${data.weapons[i].img}`)} />
                                            <div className="wrapper">
                                                <span>{data.weapons[i].name}</span>
                                                <span>{data.weapons[i].ammo}</span>

                                            </div>
                                        </section>

                                    </div>)
                            })}
                        </div>
                        <div className="inv-footer-hints">
                            <div className="inv-footer-hints-wrapper">
                                <div >

                                    <h1>
                                        ПКМ
                                        <h2>Использовать</h2>
                                    </h1>

                                </div>
                                <div >
                                    <h1>
                                        CTRL
                                        <h2>Разделить</h2>
                                    </h1>
                                </div>
                                <div >
                                    <h1>
                                        ESC
                                        <h2>Закрыть</h2>
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="inv-body">


                        <div className={`inv-header ${data.backpackData || data.armourData ? 'inv-header-min' : ''} inv-header-space`}>
                            <section>
                                <h1>
                                    Инвентарь
                                    <h2>{data.player}</h2>
                                </h1>
                                <h5>
                                    {data.invData.weight}
                                    <span>/{data.invData.maxWeight}</span>
                                </h5>
                            </section>
                        </div>
                       
                        <div className={`inv-body-wrap inv-items ${data.backpackData || data.armourData ? 'inv-items-min' : ''}`}>

                            {Array.from(Array(16).keys()).map((item, i) => {
                                if (!data.inventory[i]) return (<section onClick={e => elemClick('inventory', i, e)} id={`inv-inventory-elem-${i}`} key={i} className='inv-elem'></section>)
                                return (
                                    <section onClick={e => elemClick('inventory', i, e)} onContextMenu={even => handleClick('inventory', i, even)} id={`inv-inventory-elem-${i}`} key={i} className={`inv-elem inv-elem-size ${elemSelected.status && elemSelected.type === 'inventory' && elemSelected.id === i ? 'inv-elem-selected' : ''}`}>
                                        <img src={require(`./images/items/${data.inventory[i].img}`)} />
                                        <span>{data.inventory[i].name} {data.inventory[i].count !== 1 ? `x${data.inventory[i].count}` : ''}</span>
                                    </section>)
                            })}
                          
                        </div>

                        <div className="inv-header inv-header-space" style={!data.backpackData ? { display: 'none' } : {}}>
                            <section>

                                <h1>
                                    Рюкзак
                                    <h2>Улучшенный</h2>
                                </h1>
                                <h5>
                                    {data.backpackData ? data.backpackData.weight : 0}
                                    <span>/{data.backpackData ? data.backpackData.maxWeight : 0}</span>
                                </h5>
                            </section>
                        </div>
                        <div className="inv-body-wrap inv-items" style={{ display: !data.backpackData ? 'none' : '', height: "30%", marginTop: '0px' }}>
                            {Array.from(Array(8).keys()).map((item, i) => {
                                if (!data.backpack[i]) return (<section onClick={e => elemClick('backpack', i, e)}  id={`inv-inventory-elem-${i}`} key={i} className='inv-elem'></section>)
                                return (
                                    <section onClick={e => elemClick('backpack', i, e)} onContextMenu={even => handleClick('backpack', i, even)} id={`inv-inventory-elem-${i}`} key={i} className={`inv-elem inv-elem-size ${elemSelected.status && elemSelected.type === 'backpack' && elemSelected.id === i ? 'inv-elem-selected' : ''}`}>
                                        <img src={require(`./images/items/${data.backpack[i].img}`)} />
                                        <span>{data.backpack[i].name} {data.backpack[i].count !== 1 ? `x${data.backpack[i].count}` : ''}</span>
                                    </section>)
                            })}

                        </div>

                    </div>
                    <div className="inv-body">
                        <div className="inv-header">
                            <section>

                                <h1>
                                    Одежда
                                    <h2>и аксессуары</h2>
                                </h1>
                            </section>
                        </div>
                        <div className="inv-body-wrap inv-user">
                            <img className="inv-user-img" src={IMG_ITEM_USER} />
                            <section onClick={e => elemClick('user', 'cap', e)} className={`inv-elem ${data.user.cap && 'inv-elem-select'}`} id="inv-user-header">
                                <img src={!data.user.cap ? IMG_ITEM_USER_HEADER : require(`./images/items/${data.user.cap.img}`)} />
                                <span>{data.user.cap ? data.user.cap.name : 'Головной убор'}</span>
                            </section>
                            <section onClick={e => elemClick('user', 'body', e)} className={`inv-elem ${data.user.body && 'inv-elem-select'}`} id="inv-user-body">
                                <img src={!data.user.body ? IMG_ITEM_USER_BODY : require(`./images/items/${data.user.body.img}`)} />
                                <span >{data.user.body ? data.user.body.name : 'Верхняя одежда'}</span>
                            </section>
                            <section onClick={e => elemClick('user', 'armour', e)} className={`inv-elem ${data.user.armour && 'inv-elem-select'}`} id="inv-user-armour">
                                <img src={!data.user.armour ? IMG_ITEM_USER_ARMOUR : require(`./images/items/${data.user.armour.img}`)} />
                                <span >{data.user.armour ? data.user.armour.name : 'Бронежилет'}</span>
                            </section>
                            <section onClick={e => elemClick('user', 'accessory', e)} className={`inv-elem ${data.user.accessory && 'inv-elem-select'}`} id="inv-user-deagle">
                                <img src={!data.user.deagle ? IMG_ITEM_USER_ACCESSORY : require(`./images/items/${data.user.accessory.img}`)} />
                                <span >{data.user.accessory ? data.user.accessory.name : 'Очки'}</span>
                            </section>
                            <section onClick={e => elemClick('user', 'camera', e)} className={`inv-elem ${data.user.camera && 'inv-elem-select'}`} id="inv-user-hands">
                                <img src={!data.user.camera ? IMG_ITEM_USER_CAM : require(`./images/items/${data.user.camera.img}`)} />
                                <span >{data.user.camera ? data.user.camera.name : 'Бодикамера'}</span>
                            </section>
                            <section onClick={e => elemClick('user', 'backpack', e)} className={`inv-elem ${data.user.backpack && 'inv-elem-select'}`} id="inv-user-backpack">
                                <img src={!data.user.backpack ? IMG_ITEM_USER_BACKPACK : require(`./images/items/${data.user.backpack.img}`)} />
                                <span >{data.user.backpack ? data.user.backpack.name : 'Рюкзак'}</span>
                            </section>
                            <section onClick={e => elemClick('user', 'shirt', e)} className={`inv-elem ${data.user.shirt && 'inv-elem-select'}`} id="inv-user-weapon1">
                                <img src={!data.user.shirt ? IMG_ITEM_USER_SHIRT : require(`./images/items/${data.user.shirt.img}`)} />
                                <span >{data.user.shirt ? data.user.shirt.name : 'Футболка'}</span>
                            </section>
                            <section onClick={e => elemClick('user', 'accessory2', e)} className={`inv-elem ${data.user.accessory2 && 'inv-elem-select'}`} id="inv-user-weapon2">
                                <img src={!data.user.accessory2 ? IMG_ITEM_USER_SECOND_ACCESSORY : require(`./images/items/${data.user.accessory2.img}`)} />
                                <span >{data.user.accessory2 ? data.user.accessory2.name : 'Аксессуар'}</span>
                            </section>
                            <section onClick={e => elemClick('user', 'accessory3', e)} className={`inv-elem ${data.user.accessory3 && 'inv-elem-select'}`} id="inv-user-weapon3">
                                <img src={!data.user.accessory3 ? IMG_ITEM_USER_SECOND_ACCESSORY : require(`./images/items/${data.user.accessory3.img}`)} />
                                <span >{data.user.accessory3 ? data.user.accessory3.name : 'Аксессуар'}</span>
                            </section>
                            <section onClick={e => elemClick('user', 'pants', e)} className={`inv-elem ${data.user.pants && 'inv-elem-select'}`} id="inv-user-pants">
                                <img src={!data.user.pants ? IMG_ITEM_USER_PANTS : require(`./images/items/${data.user.pants.img}`)} />
                                <span >{data.user.pants ? data.user.pants.name : 'Штаны'}</span>
                            </section>
                            <section onClick={e => elemClick('user', 'bottom', e)} className={`inv-elem ${data.user.bottom && 'inv-elem-select'}`} id="inv-user-bottom">
                                <img src={!data.user.bottom ? IMG_ITEM_USER_BOTTOM : require(`./images/items/${data.user.bottom.img}`)} />
                                <span >{data.user.bottom ? data.user.bottom.name : 'Обувь'}</span>
                            </section>
                        </div>
                    </div>
                </div>

                <div />
            </div>
            {
                elemSelected.item && <div className="inv-inventory-menu " style={{ display: elemSelected.status && toggle ? '' : 'none', top: elemSelected.menuY + 'px', left: elemSelected.menuX + 'px' }}>
                    <h1>Информация</h1>
                    <header>
                        <section className='inv-elem inv-elem-size inv-elem-select inv-elem-selected'>
                            <img src={elemSelected.item && elemSelected.item.img.length && require(`./images/items/${elemSelected.item.img}`)} />
                        </section>
                        <h1>
                            {elemSelected.item && elemSelected.item.name}
                            <h2>
                                Вес
                                <span>{elemSelected.item && elemSelected.item.weight} кг</span>
                            </h2>
                        </h1>
                    </header>

                    <div className="inv-inventory-menu-info inv-inventory-menu-btn" style={elemSelected.type === 'trade-user' ? { display: 'none' } : {}}>
                        <h1>Взаимодействие</h1>
                        <button style={elemSelected.type !== 'inventory' && elemSelected.type !== 'backpack' ? { display: 'none' } : {}} onClick={() => use(elemSelected.type, elemSelected.id, elemSelected.indexInSection)} className="btn">Использовать</button>
                        <button style={elemSelected.type !== 'give' && elemSelected.type !== 'backpack' ? { display: '' } : {}} onClick={() => use(elemSelected.type, elemSelected.id, elemSelected.indexInSection)} className="btn">Передать</button>
                        <button style={elemSelected.type !== 'split' && elemSelected.type !== 'backpack' ? { display: '' } : {}} onClick={() => split(elemSelected.type, elemSelected.id, elemSelected.indexInSection)} className="btn">Разделить</button>
                        <button style={elemSelected.type !== 'inventory' && elemSelected.type !== 'backpack' ? { display: 'none' } : {}} onClick={() => drop(elemSelected.type, elemSelected.id, elemSelected.indexInSection)} className="remove-inv ">Выбросить</button>
                        <button style={elemSelected.type !== 'trade-me' ? { display: 'none' } : {}} onClick={() => tradeDeleteItem(elemSelected.id)} className="btn">Убрать из обмена</button>
                    </div>
                </div>
            }

        </>
    )
}
