import 'moment/locale/ru'
import './css.css'

import $ from 'jquery'
import PhoneCallNav from './PhoneCallNav'
import React from 'react'
import {ReactSVG} from 'react-svg'
import moment from 'moment'
import ragemp from '../../_modules/ragemp'

moment.locale('ru')

const appsList = [
    {
        name: "Блокнот",
        img: "notes.png",
        appid: 'notes'
    },
    {
        name: "Новости",
        img: "news.png",
        appid: 'news'
    },
    {
        name: "Мой дом",
        img: "home.png",
        appid: 'homes'
    },
    {
        name: "Мой бизнес",
        img: "business.png",
        appid: 'business'
    },
    {
        name: "Мой транспорт",
        img: "vehicle.png",
        appid: 'vehicles'
    },
    {
        name: "Банк",
        img: "bank.png",
        appid: 'bank'
    }
]
const appsListFast = [
    {
        name: "Телефон",
        img: "call.png",
        appid: 'call'
    },
    {
        name: "Навигатор",
        img: "gps.png",
        appid: 'gps'
    },
    {
        name: "Месенджер",
        img: "sms.png",
        appid: 'sms'
    },
    {
        name: "Настройки",
        img: "settings.png",
        appid: 'settings'
    }
]

export default function Phone()
{
    const [ toggle, setToggle ] = React.useState(false)
    const [ app, setApp ] = React.useState('sms-open')
    const [ time, setTime ] = React.useState(new Date())

    const [ dialog, setDialog ] = React.useState({
        status: false,
        title: '',
        text: '',
        inputs: [],
        btns: []
    })
    function resetDialog()
    {
        setDialog({
            status: false,
            title: '',
            text: '',
            inputs: [],
            btns: []
        })
    }
    function dialogToCallback(btn)
    {
        if(!dialog.callback)return

        const inputs = []
        $('.phone .phone-dialog section input').each((i, item) =>
        {
            inputs.push($(item).val())
        })

        dialog.callback(btn, inputs)
    }

    const [ notf, setNotf ] = React.useState({
        text: '',
        type: 'error',
        timer: null
    })
    function showNotf(text, type)
    {
        if(notf.text.length > 0) clearTimeout(notf.timer)

        setNotf({
            text,
            type,
            timer: setTimeout(() =>
            {
                setNotf({
                    text: '',
                    type: 'success',
                    timer: null
                })
            }, 3000)
        })
    }


    const [ callNumber, setCallNumber ] = React.useState('')
    React.useEffect(() =>
    {
        if(callNumber.length > 9) setCallNumber(old => { return callNumber.substring(0, 9) })
    }, [callNumber])


    const [ recents, setRecents ] = React.useState([
        { number: '91310123', name: "Nezuko Kamado", call: 'Phone', date: new Date(1655754620000), type: 'up' },
        { number: '88005553535', name: "8 800 555 35 35", call: 'Phone', date: new Date(), type: '' },
        { number: '88005553535', name: "8 800 555 35 35", call: 'Phone', date: new Date(), type: 'missed' }
    ])
    const [ recentsType, setRecentsType ] = React.useState(false)

    const [ contacts, setContacts ] = React.useState([
        { name: 'Nezuko Kamado', img: 'https://i.imgur.com/GPUAXdH.jpeg', type: '✸ Phone', id: 192, favorite: true, number: '88005553535', addDate: new Date() }
    ])
    const [ contactOpen, setContactOpen ] = React.useState(-1)

    const [ gps, setGPS ] = React.useState([
        { name: "Основное", img: "main.png", elems: [
            { name: "Мэрия ЛС", distance: '1.8 km' },
            { name: "Мэрия ЛС", distance: '1.8 km' },
            { name: "Мэрия ЛС", distance: '1.8 km' },
            { name: "Мэрия ЛС", distance: '1.8 km' },
            { name: "Мэрия ЛС", distance: '1.8 km' },
            { name: "Мэрия ЛС", distance: '1.8 km' }
        ] }
    ])
    const [ gpsOpen, setGPSOpen ] = React.useState(-1)
    const [ gpsStatus, setGPSStatus ] = React.useState(false)

    const [ messages, setMessages ] = React.useState([
        { title: 'Nezuko Kamado', img: 'https://i.imgur.com/GPUAXdH.jpeg', blocked: false, sms: [
            { name: 'Nezuko Kamado', img: 'https://i.imgur.com/GPUAXdH.jpeg', text: 'Привет, как поживаешь?', date: new Date() },
            { name: 'Nezuko Kun', img: 'https://i.imgur.com/GPUAXdH.jpeg', text: 'Норм, а ты?', date: new Date(), me: true }
        ] }
    ])
    const [ messagesOpen, setMessagesOpen ] = React.useState({ title: 'Nezuko Kamado', img: 'https://i.imgur.com/GPUAXdH.jpeg', blocked: false, sms: [
        { name: 'Nezuko Kamado', img: 'https://i.imgur.com/GPUAXdH.jpeg', text: 'Привет, как поживаешь?', date: new Date() },
        { name: 'Nezuko Kun', img: 'https://i.imgur.com/GPUAXdH.jpeg', text: 'Норм, а ты?', date: new Date(), me: true }
    ] })

    function openApp(id, currentID)
    {
        if(id === 'notes' || id === 'news' || id === 'bank' || id === 'settings')return

        ragemp.send('ui::phone:openApp', {
            id,
            currentID
        })
        setApp(id)
    }
    function appSearch(type, value)
    {
        switch(type)
        {
            case 'contacts':
            {
                contacts.map((item, i) =>
                {
                    if(item.name.indexOf(value) !== -1
                        || item.number.indexOf(value) !== -1) $(`.phone .phone-contacts .phone-favorites-item[data-id=${i}]`).show()
                    else $(`.phone .phone-contacts .phone-favorites-item[data-id=${i}]`).hide()
                })
                break
            }
            case 'gps':
            {
                if(gpsOpen === -1)
                {
                    gps.map((item, i) =>
                    {
                        if(item.name.indexOf(value) !== -1) $(`.phone .phone-gps .phone-gps-item[data-id=${i}]`).show()
                        else $(`.phone .phone-gps .phone-gps-item[data-id=${i}]`).hide()
                    })
                }
                else
                {
                    gps[gpsOpen].elems.map((item, i) =>
                    {
                        if(item.name.indexOf(value) !== -1) $(`.phone .phone-gps .phone-gps-item[data-id=${i}]`).show()
                        else $(`.phone .phone-gps .phone-gps-item[data-id=${i}]`).hide()
                    })
                }
                break
            }
            case 'sms':
            {
                messages.map((item, i) =>
                {
                    if(item.title.indexOf(value) !== -1 || item.sms[item.sms.length - 1].text.indexOf(value) !== -1) $(`.phone .phone-messages .phone-messages-item[data-id=${i}]`).show()
                    else $(`.phone .phone-messages .phone-messages-item[data-id=${i}]`).hide()
                })
                break
            }
            case 'sms-open':
            {
                messagesOpen.sms.map((item, i) =>
                {
                    if(item.name.indexOf(value) !== -1 || item.text.indexOf(value) !== -1) $(`.phone .phone-messages .phone-messages-elems`).scrollTop($(`.phone .phone-messages .phone-messages-elem[data-id=${i}]`).position().top)
                    else $('.phone .phone-messages .phone-messages-elems').scrollTop(99999999)
                })
                break
            }
        }
    }


    function addContact(number = '')
    {
        setDialog({
            status: true,
            title: 'Новый контакт',
            text: '',
            inputs: [ 'Имя контакта', 'Номер телефона' ],
            inputsValue: [ '', number ],
            btns: [ 'Добавить', 'Отмена' ],
            callback: (btn, inputs) =>
            {
                if(btn === 1) resetDialog()
                else
                {
                    if(!inputs[0].length || !inputs[1].length)return showNotf('Заполните все данные', 'error')

                    resetDialog()
                    ragemp.send('ui::phone:contacts:add', {
                        name: inputs[0],
                        number: inputs[1]
                    })
                }
            }
        })
    }
    function deleteContact(id)
    {
        if(id === -1)return

        setDialog({
            status: true,
            title: 'Удаление контакта',
            text: 'Вы действительно хотите удалить контакт?',
            btns: [ 'Да', 'Нет' ],
            callback: btn => {
                resetDialog()
                ragemp.send('ui::phone:contacts:delete', {
                    id: contacts[id].id
                })
            } })
    }
    function clearRecents()
    {
        setDialog({
            status: true,
            title: 'Очистка вызовов',
            text: 'Вы действительно хотите очистить все вызовы?',
            btns: [ 'Да', 'Нет' ],
            callback: btn => {
                resetDialog()
                ragemp.send('ui::phone:recents:clear')
            } })
    }

    function sendMessage(e)
    {
        if(e && e.keyCode !== 13)return

        const text = $('#phone-message-input').val()
        if(!text.length)return

        ragemp.send('ui::phone:messages:send', {
            id: messagesOpen.id,
            text
        })
        $('#phone-message-input').val('')
    }

    function call(number) {
        ragemp.send('ui::phone:keypad:call', {
            phone: number
        })
    }
    React.useMemo(() =>
    {
        setInterval(() =>
        {
            setTime(new Date())
        }, 1000)

        ragemp.eventCreate('client::phone', (cmd, data) =>
        {
            switch(cmd)
            {
                case 'toggle':
                {
                    setToggle(data.status)
                    setApp('none')

                    break
                }
                case 'updateMessages':
                {
                    setMessages(data)
                    break
                }
                case 'updateMessage':
                {
                    setMessagesOpen(data)
                    break
                }
                case 'openApp':
                {
                    setContactOpen(-1)
                    setGPSOpen(-1)
                    setRecentsType(false)

                    switch(data.app)
                    {
                        case 'call-recents':
                        {
                            setRecents(data.data)
                            break
                        }
                        case 'call-favorites':
                        {
                            setContacts(data.data)
                            break
                        }
                        case 'contacts':
                        {
                            setContacts(data.data)
                            break
                        }
                        case 'recents':
                        {
                            setRecents(data.data)
                            break
                        }
                        case 'favorites':
                        {
                            setContacts(data.data)
                            break
                        }
                        case 'gps':
                        {
                            setGPS(data.data)
                            setGPSStatus(data.gpsStatus)
                            break
                        }
                        case 'sms':
                        {
                            setMessages(data.data)
                            break
                        }
                        case 'sms-open':
                        {
                            setMessagesOpen(data.data)
                            break
                        }
                    }
                    setApp(data.app)
                    break
                }
            }
        })
    }, [])

    React.useEffect(() =>
    {
        $('.phone .phone-messages .phone-messages-elems').scrollTop(99999999)
    }, [messagesOpen])

    return (
        <div className={`phone ${app === 'none' && 'phone-white'} ${toggle && 'phone-open'}`}>
            <div className="phone-wallpaper" style={{backgroundImage: "url(https://wallpapershome.ru/images/wallpapers/ayfon-xs-2560x1440-ayfon-xs-20379.jpg)"}}>
                <div className={`phone-notf ${notf.text.length > 0 && 'phone-notf-show'} phone-notf-${notf.type}`}>{notf.text}</div>

                <div className={`phone-dialog ${dialog.status && 'phone-dialog-show'}`}>
                    <div className="phone-dialog-wrap">
                        <h1>{dialog.title}</h1>
                        <h2>{dialog.text}</h2>
                        <section>
                            {dialog.inputs && dialog.inputs.map((item, i) => { return (<input key={i} type="text" placeholder={item} />) })}
                        </section>
                        <div>
                            {dialog.btns.map((item, i) => { return (<button key={i} onClick={() => dialogToCallback(i)} key={i}>{item}</button>) })}
                        </div>
                    </div>
                </div>

                <div className="phone-header">
                    <h5>{new Date(time).toLocaleString("ru-RU", {
                        hour: 'numeric',
                        minute: 'numeric'
                    })}</h5>
                    <section>
                        <h4>MITS</h4>
                        <div className="phone-network-status phone-network-status-5">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div className="phone-battery">
                            <div style={{width: "50%"}}></div>
                        </div>
                    </section>
                </div>
                <div className="phone-apps">
                    {appsList.map((item, i) =>
                    {
                        return (<div onClick={() => openApp(item.appid)} key={i} className="phone-app phone-app-big">
                            <img src={require(`./images/apps/${item.img}`)} />
                            <span>{item.name}</span>
                        </div>)
                    })}
                </div>
                <div className="phone-bottom">
                    {appsListFast.map((item, i) =>
                    {
                        return (<div onClick={() => openApp(item.appid)} key={i} className="phone-app">
                            <img src={require(`./images/apps/${item.img}`)} />
                        </div>)
                    })}
                </div>

                <div className="phone-home" onClick={() => openApp('none')} style={app === 'none' ? {display: 'none'} : {}}>
                </div>
                <div className="phone-body phone-call" style={app !== 'call' ? {display: 'none'} : {}}>
                    <section className="phone-call-text">
                        <img onClick={() => callNumber.length && addContact(callNumber)} src={require('./images/app_call/add.png')} />
                        <h5>{callNumber}</h5>
                        <img onClick={() => setCallNumber(old => { return callNumber.substring(0, callNumber.length - 1) })} src={require('./images/app_call/backspace.png')} />
                    </section>
                    <section className="phone-call-number">
                        <div onClick={() => setCallNumber(old => { return old += '1' })}>1</div>
                        <div onClick={() => setCallNumber(old => { return old += '2' })}>2</div>
                        <div onClick={() => setCallNumber(old => { return old += '3' })}>3</div>
                        <div onClick={() => setCallNumber(old => { return old += '4' })}>4</div>
                        <div onClick={() => setCallNumber(old => { return old += '5' })}>5</div>
                        <div onClick={() => setCallNumber(old => { return old += '6' })}>6</div>
                        <div onClick={() => setCallNumber(old => { return old += '7' })}>7</div>
                        <div onClick={() => setCallNumber(old => { return old += '8' })}>8</div>
                        <div onClick={() => setCallNumber(old => { return old += '9' })}>9</div>
                        <div onClick={() => setCallNumber(old => { return old += '*' })}>*</div>
                        <div onClick={() => setCallNumber(old => { return old += '0' })}>0</div>
                        <div onClick={() => setCallNumber(old => { return old += '#' })}>#</div>
                        <div onClick={() => call(callNumber)}>
                            <img src={require('./images/app_call/call.png')} />
                        </div>
                    </section>
                    <section className="phone-call-nav">
                        <PhoneCallNav data={{openApp, app}} />
                    </section>
                </div>
                <div className="phone-body phone-call phone-recents" style={app !== 'call-recents' ? {display: 'none'} : {}}>
                    <section className="phone-body-title">
                        <header>
                            <h2 onClick={() => clearRecents()}>Очистить</h2>
                            <div>
                                <button onClick={() => setRecentsType(false)} className={!recentsType && "btn-select"}>All</button>
                                <button onClick={() => setRecentsType(true)} className={recentsType && "btn-select"}>Missed</button>
                            </div>
                        </header>
                        <h1>Вызовы</h1>
                    </section>
                    <section className="phone-body-wrap">
                        {recents.map((item, i) =>
                        {
                            if(recentsType && item.type !== 'missed')return
                            return (<div key={i} className={`phone-recents-item ${item.type === 'up' ? 'phone-recents-item-up' : item.type === 'missed' ? 'phone-recents-item-color' : ''}`}>
                                <div onClick={() => ragemp.send('ui::phone:recents:delete', { id: item.id })} className="phone-remove-ico"></div>
                                <div onClick={() => {setCallNumber(item.number); setApp('call')}} className="phone-recents-item-body">
                                    <img src={require('./images/app_call/callto.png')} />
                                    <h1>
                                        {item.name}
                                    </h1>
                                    <h2>{item.call}</h2>
                                </div>
                                <div onClick={() => {setCallNumber(item.number); setApp('call')}} className="phone-recents-item-time">
                                    {new Date(item.date) < +new Date - 86400000 ? moment(new Date(item.date)).fromNow() : moment(new Date(item.date)).format('HH:mm')}
                                </div>
                            </div>)
                        })}
                    </section>
                    <section className="phone-call-nav">
                        <PhoneCallNav data={{openApp, app}} />
                    </section>
                </div>
                <div className="phone-body phone-call phone-favorites" style={app !== 'call-favorites' ? {display: 'none'} : {}}>
                    <section className="phone-body-title phone-body-title-min">
                        <header>
                            <h2 className="phone-body-title-h2-big">+</h2>
                            <h1>Избранное</h1>
                            <h2>Ред.</h2>
                        </header>
                    </section>
                    <section className="phone-body-wrap">
                        {contacts.map((item, i) =>
                        {
                            if(!item.favorite)return
                            return (<div onClick={() => {setCallNumber(item.number); setApp('call')}} key={i} className="phone-favorites-item">
                                <div>
                                    <section>
                                        <img src={item.img} />
                                    </section>
                                    <h1>
                                        {item.name}
                                        <h2>{item.type}</h2>
                                    </h1>
                                </div>
                                <div onClick={() => setContactOpen(i)} className="phone-info-ico"></div>
                            </div>)
                        })}
                    </section>
                    <section className="phone-call-nav">
                        <PhoneCallNav data={{openApp, app}} />
                    </section>
                </div>
                <div className="phone-body phone-body-search phone-contacts phone-call phone-body-desing" style={app !== 'contacts' ? {display: 'none'} : {}}>
                    <section className="phone-body-title phone-body-title-min">
                        <header>
                            <h1 style={{textAlign: 'left'}}>Контакты</h1>
                            <img onClick={() => addContact()} src={require('./images/app_contacts/add.png')} />
                        </header>
                        <div className="phone-search">
                            <input onChange={e => appSearch('contacts', e.target.value)} type="text" placeholder="Поиск..." />
                            <img src={require('./images/search.png')} />
                        </div>
                    </section>
                    <section className="phone-body-wrap">
                        {contacts.map((item, i) =>
                        {
                            return (<div key={i} className="phone-favorites-item" data-id={i}>
                                <div onClick={() => setContactOpen(i)}>
                                    <section>
                                        <img src={item.img} />
                                    </section>
                                    <h1>
                                        <span>{item.name}</span>
                                        <h2>{item.number.toLocaleString('ru-RU', {
                                            style: 'phone'
                                        })}</h2>
                                    </h1>
                                </div>
                                <div>
                                    <section onClick={() => {setCallNumber(item.number); setApp('call')}}>
                                        <img src={require('./images/app_contacts/call.png')} />
                                    </section>
                                    <section>
                                        <img src={require('./images/app_contacts/message.png')} />
                                    </section>
                                </div>
                            </div>)
                        })}
                    </section>
                    <section className="phone-call-nav">
                        <PhoneCallNav data={{openApp, app}} />
                    </section>
                </div>
                <div className="phone-body phone-call phone-contact" style={contactOpen === -1 ? {display: 'none'} : {}}>
                    <section className="phone-body-title phone-body-title-min">
                        <header>
                            <h2 onClick={() => setContactOpen(-1)}>↵ Назад</h2>
                            <h2 onClick={() => setDialog({
                                status: true,
                                title: 'Пока в разработке',
                                text: 'Пока в разработке',
                                btns: [ 'Ок' ],
                                callback: btn => resetDialog() })}>Редактировать</h2>
                        </header>
                    </section>
                    <section className="phone-body-wrap">
                        <div className="phone-contact-body">
                            <div className="phone-contact-img">
                                <img src='https://i.imgur.com/GPUAXdH.jpeg' />
                            </div>
                            <h2>{contactOpen !== -1 && contacts[contactOpen].name}</h2>
                            <div className="phone-contact-action">
                                <section>
                                    <div>
                                        <img src={require('./images/app_contacts/call_white.png')} />
                                    </div>
                                    <span>позвонить</span>
                                </section>
                                <section>
                                    <div>
                                        <img src={require('./images/app_contacts/message_white.png')} />
                                    </div>
                                    <span>сообщение</span>
                                </section>
                            </div>
                            <div className="phone-contact-info">
                                <section>
                                    <h1>номер телефона</h1>
                                    <h2>{contactOpen !== -1 && contacts[contactOpen].number.toLocaleString('ru-RU', {
                                        style: 'phone'
                                    })}</h2>
                                </section>
                                <section>
                                    <h1>дата добавления</h1>
                                    <h2>{contactOpen !== -1 && new Date(contacts[contactOpen].addDate).toLocaleString('ru-RU')}</h2>
                                </section>
                                <section onClick={() => deleteContact(contactOpen)} className="phone-contact-delete">
                                    <h1>Удалить контакт</h1>
                                </section>
                            </div>
                        </div>
                    </section>
                    <section className="phone-call-nav">
                        <PhoneCallNav data={{openApp, app}} />
                    </section>
                </div>

                <div className="phone-body phone-gps phone-favorites phone-body-search phone-body-desing" style={app !== 'gps' ? {display: 'none'} : {}}>
                    <section className="phone-body-title phone-body-title-min">
                        <header>
                            {gpsOpen !== -1 && (<h2 onClick={() => setGPSOpen(-1)}>↵ Навигатор</h2>)}
                            <h1 style={gpsOpen === -1 ? {textAlign: 'left'} : {display: 'none'}}>Навигатор</h1>
                            <img style={!gpsStatus ? {opacity: '0', zIndex: '-1'} : {}} src={require('./images/app_gps/stop.png')} />
                        </header>
                        <div className="phone-search">
                            <input onChange={e => appSearch('gps', e.target.value)} type="text" placeholder="Поиск..." />
                            <img src={require('./images/search.png')} />
                        </div>
                    </section>
                    <section className="phone-body-wrap" style={{display: gpsOpen !== -1 ? '' : 'none', height: "calc(100% - 70px - 5px)"}}>
                        {gpsOpen !== -1 && gps[gpsOpen].elems.map((item, i) =>
                        {
                            return (<div onClick={() => ragemp.send('ui::phone:gps:go', { category: gpsOpen, id: i })} data-id={i} className="phone-favorites-item phone-gps-item">
                                <div>
                                    <section>
                                        <h1>{item.name}</h1>
                                        <h2>{item.distance} от вас</h2>
                                    </section>
                                </div>
                                <div className="phone-gps-item-hover">Отметить</div>
                            </div>)
                        })}
                    </section>
                    <section className="phone-body-wrap" style={{display: gpsOpen === -1 ? '' : 'none', height: "calc(100% - 70px - 5px)"}}>
                        {gps.map((item, i) =>
                        {
                            return (<div data-id={i} onClick={() => setGPSOpen(i)} className="phone-favorites-item phone-gps-item">
                                <div>
                                    <img src={require(`./images/app_gps/gps/${item.img}`)} />
                                    <section>
                                        <h1>{item.name}</h1>
                                        <h2>{item.elems.length} мест</h2>
                                    </section>
                                </div>
                                <div>
                                    <section>
                                        <img src={require('./images/app_gps/item_go.png')} />
                                    </section>
                                </div>
                            </div>)
                        })}
                    </section>
                </div>

                <div className="phone-body phone-messages phone-favorites phone-body-search phone-body-desing" style={app !== 'sms' ? {display: 'none'} : {}}>
                    <section className="phone-body-title phone-body-title-min">
                        <header>
                            <h1 style={{textAlign: 'left'}}>Сообщения</h1>
                        </header>
                        <div className="phone-search">
                            <input onChange={e => appSearch('sms', e.target.value)} type="text" placeholder="Поиск..." />
                            <img src={require('./images/search.png')} />
                        </div>
                    </section>
                    <section className="phone-body-wrap" style={{height: "calc(100% - 70px - 5px)"}}>
                        {messages.map((item, i) =>
                        {
                            return (<div onClick={() => openApp('sms-open', item.id)} data-id={i} className="phone-favorites-item phone-messages-item">
                                <div>
                                    <section>
                                        <img src={item.img} />
                                    </section>
                                    <h1>
                                        <span>{item.title}</span>
                                        <h2>{item.sms[item.sms.length - 1].me && (<span>Вы:</span>)} {item.sms[item.sms.length - 1].text}</h2>
                                    </h1>
                                </div>
                                <div>
                                    <h1><h2>
                                        {new Date(item.sms[item.sms.length - 1].date) < +new Date - 86400000 ? moment(new Date(item.sms[item.sms.length - 1].date)).fromNow() : moment(new Date(item.sms[item.sms.length - 1].date)).format('HH:mm')}
                                    </h2></h1>
                                </div>
                            </div>)
                        })}
                    </section>
                </div>
                <div className="phone-body phone-messages phone-favorites phone-body-search phone-body-desing" style={app !== 'sms-open' ? {display: 'none'} : {}}>
                    <section className="phone-body-title phone-body-title-min">
                        <header>
                            <h2 onClick={() => openApp('sms')}>↵ Сообщения</h2>
                            <h1 style={{textAlign: 'right'}}>Переписка</h1>
                        </header>
                        <div className="phone-search">
                            <input onChange={e => appSearch('sms-open', e.target.value)} type="text" placeholder="Поиск..." />
                            <img src={require('./images/search.png')} />
                        </div>
                    </section>
                    <section className="phone-body-wrap" style={{height: "calc(100% - 70px - 5px)"}}>
                        <div className="phone-messages-elems">
                            {messagesOpen.sms.map((item, i) =>
                            {
                                return (<section data-id={i} className={`phone-messages-elem ${item.me && 'phone-messages-elem-reverse'}`}>
                                    <div className="phone-messages-elem-img">
                                        <img src={item.img} />
                                    </div>
                                    <div className="phone-messages-elem-text">
                                        <h1>{item.name}</h1>
                                        <h2>{item.text}</h2>
                                        <h3>{new Date(item.date) < +new Date - 86400000 ? moment(new Date(item.date)).fromNow() : moment(new Date(item.date)).format('HH:mm')}</h3>
                                    </div>
                                </section>)
                            })}
                        </div>
                        <div className="phone-messages-input">
                            <input id="phone-message-input" onKeyDown={sendMessage} style={messagesOpen.blocked ? {display: 'none'} : {}} className="input" type="text" placeholder="Что отправляем?" />
                            <img onClick={() => sendMessage()} style={messagesOpen.blocked ? {display: 'none'} : {}} src={require('./images/app_sms/send.png')} />
                            <h1 style={!messagesOpen.blocked ? {display: 'none'} : {}}>Вы не можете отправлять сообщения в данный чат</h1>
                        </div>
                    </section>
                </div>

                <div className="phone-body phone-vehicles" style={app !== 'vehicles' ? {display: 'none'} : {}}>
                    <section>
                        <img src={require('./images/warning.png')} />
                        <span>У Вас нет личного транспорта</span>
                    </section>
                </div>
                <div className="phone-body phone-vehicles" style={app !== 'business' ? {display: 'none'} : {}}>
                    <section>
                        <img src={require('./images/warning.png')} />
                        <span>У Вас нет бизнесов</span>
                    </section>
                </div>
                <div className="phone-body phone-vehicles" style={app !== 'homes' ? {display: 'none'} : {}}>
                    <section>
                        <img src={require('./images/warning.png')} />
                        <span>У Вас нет домов</span>
                    </section>
                </div>
            </div>
        </div>
    )
}
