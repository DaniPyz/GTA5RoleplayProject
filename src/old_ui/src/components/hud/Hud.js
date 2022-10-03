import './css.scss'

import $ from 'jquery'
import IMG_BANK from './images/bank.svg'
import IMG_GPS from './images/gps.svg'
import IMG_GREENZONE from './images/greenzone.svg'
import IMG_HINT_CHAT from './images/hintChat.png'
import IMG_ID from './images/id.png'
import IMG_LOGO from './images/logo.svg'
import IMG_MICRO_OFF from './images/micOff.svg'
import IMG_MICRO_ON from './images/micOn.svg'
import IMG_ONLINE from './images/online.svg'
import IMG_SATIETY from './images/satiety.png'
import IMG_THIRST from './images/thirst.png'
import IMG_TIME from './images/time.png'
import IMG_WALLET from './images/wallet.svg'
import IMG_WEAPON from './images/weapons/ak47.png'
import IMG_WEATHER from './images/weather.png'
import React from 'react'
import { ReactSVG } from 'react-svg'
import SVG_WANTED from './images/wanted.svg'
import SVG_WANTED_YES from './images/wanted_yes.svg'
import htmlReactParser from 'html-react-parser'
import ragemp from '../../_modules/ragemp'

let chatHistoryMove = -1
export default function Hud() {
    function convertToMoscowDate(date) {
        var offsetMs = date.getTimezoneOffset() * 60 * 1000;
        var moscowOffsetMs = 3 * 60 * 60 * 1000;
        return new Date(date.getTime() + offsetMs + moscowOffsetMs);
    }
    let date = convertToMoscowDate(new Date());
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getUTCFullYear();

    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;

    const [toggle, setToggle] = React.useState(false)

    const [gz, setGZ] = React.useState(false)
    const [wanted, setWanted] = React.useState(0)

    const [cash, setCash] = React.useState([25000156, 25000156])
    const [weapon, setWeapon] = React.useState([0, '', 0, 0])

    const [quests, setQuests] = React.useState({
        status: false,
        name: 'Название квеста тут',
        tasks: [{
            name: 'Убить Эдуарда Советова за проёб срока,этот чёрт заебал конкретно, согласны?',
            status: true,
            count: [0, 10],
        }, {
            name: 'Убить Эдуарда Советова за проёб срока,этот чёрт заебал конкретно, согласны?',
            status: false,
            count: [5, 5],
        }]
    })

    const [keys, setKeys] = React.useState([{
        key: 'M',
        name: 'Меню сервера'
    }, {
        key: 'G',
        name: 'Меню сервера'
    }, {
        key: 'F',
        name: 'Меню'
    }, {
        key: 'L',
        name: 'Меню '
    }])
    const [keysToggle, setKeysToggle] = React.useState(false)
    const [keysToggleKey, setKeysToggleKey] = React.useState('F9')

    const [stats, setStats] = React.useState({
        online: [1080, 1100],
        id: 24,
        name: 'Eduard Sovetov',
        micro: false,
        weather: ['Облачно', 18],
        gps: ['VineWood', 'Palo-Alto Hills']
    })
    const [time, setTime] = React.useState(date)

    const [satiety, setSatiety] = React.useState([0, 0])
    const [satietyToggle, setSatietyToggle] = React.useState(false)
    // {
    //     text: 'Dapy Rogers[0]: Всем привет у меня дела лично хорошо а у вас как проходит ваш день.',
    //         color: '#FF8AF3',
    //             type: 'me'

    // }, {
    //     text: `<div className='news-wrapper'><p>Куплю автомобиль <span>Ford</span>, бюджет: <span>$ 5 000 000</span>. Звоните.</p><section><h1>Автор: <span>Dapy Rogers</span></h1> <h1>Сотрудник: <span>Dapy Rogers</span></h1></section></div>`,
    //         color: 'white',
    //             type: 'news',
    //                 tel: '777'

    // }, {
    //     text: 'Dapy Rogers[0]: Всем привет у меня дела лично хорошо а у вас как проходит ваш день.',
    //         color: '#FF3535',
    //             type: 'adm'

    // }, {
    //     text: 'Dapy Rogers[0]: Всем привет у меня дела лично хорошо а у вас как проходит ваш день.',
    //         color: '#318FFF',
    //             type: 'gov'


    // }, {
    //     text: 'Dapy Rogers[0]: Всем привет у меня дела лично хорошо а у вас как проходит ваш день.',
    //         color: 'white'


    // }
    const [chatToggle, setChatToggle] = React.useState(false)
    const [chat, setChat] = React.useState([ ])
    const [chatSettings, setChatSettings] = React.useState({
        timestamp: false
    })
    const [chatHistory, setChatHistory] = React.useState([])

    const [chatID, setChatID] = React.useState('IC')
    const [chatIDS, setChatIDS] = React.useState(['IC', 'Семеный'])
    const [chatIDSToggle, setChatIDSToggle] = React.useState(false)

    const [keynotf, setKeyNotf] = React.useState({
        toggle: false,
        message: 'Используйте клавишу',
        key: 'E'
    })

    const [speedometr, setSpeedometr] = React.useState(false)
    const [speedometrSpeed, setSpeedometrSpeed] = React.useState(0)
    const [speedometrData, setSpeedometrData] = React.useState({
        fuel: 25,

        belt: false,
        engine: false,
        lights: true,
        doors: true
    })
    const [speedometrKeys, setSpeedometrKeys] = React.useState({
        belt: 'K',
        engine: 'N',
        lights: 'M',
        doors: 'L'
    })

    React.useMemo(() => {
        setInterval(() => setTime(convertToMoscowDate(new Date())), 1000)

        ragemp.eventCreate('client::hud', (cmd, data) => {
            switch (cmd) {
                case 'speedometrToggle':
                    {
                        setSpeedometr(data.status)
                        break
                    }
                case 'speedometr':
                    {
                        if (data.speedometrData) setSpeedometrData(data.speedometrData)
                        if (data.speedometrKeys) setSpeedometrKeys(data.speedometrKeys)
                        if (data.speedometrSpeed) setSpeedometrSpeed(data.speedometrSpeed)

                        break
                    }
                case 'toggle':
                    {
                        setToggle(data.status)
                        break
                    }
                case 'update':
                    {
                        if (data.greenzone !== undefined) setGZ(data.greenzone)
                        if (data.wanted !== undefined) setWanted(data.wanted)

                        if (data.cash) setCash(data.cash)
                        if (data.weapon) setWeapon(data.weapon)

                        if (data.quests) setQuests(data.quests)

                        if (data.keys) setKeys(data.keys)
                        if (data.keysToggle !== undefined) setKeysToggle(data.keysToggle)

                        if (data.stats) setStats(data.stats)
                        if (data.satiety) setSatiety(data.satiety)
                        if (data.satietyToggle) setSatietyToggle(data.satietyToggle)

                        if (data.chatSettings) setChatSettings(data.chatSettings)
                        if (data.chatIDS) setChatIDS(data.chatIDS)
                        if (data.chatIDSToggle) setChatIDSToggle(data.chatIDSToggle)

                        if (data.chat) setChat(data.chat)

                        break
                    }
                case 'addChatMessage':
                    {
                        chatAddMessage(data)
                        break
                    }
                case 'toggleChat':
                    {
                        setChatToggle(data.status)

                        if (data.status === true) {
                            setChatID(data.chatID || chatIDS[0])
                            setTimeout(() => $('.hud .hud-chat input').focus(), 200)
                        }
                        break
                    }
                case 'keynotf':
                    {
                        setKeyNotf(data)

                        break
                    }
                case 'keysToggleKey':
                    {
                        setKeysToggleKey(data.key)
                        break
                    }
            }
        })
    }, [])
    React.useEffect(() => {
        chatHistoryMove = -1
    }, [chatToggle])

    function chatEnter(event) {
        if (chatToggle === false) return
        if (event.key === 'Enter') {
            setChatToggle(false)
            ragemp.send('ui::hud:chatClosed')

            if (!event.target.value.length) return

            ragemp.send('ui::hud:sendChatMessage', {
                text: event.target.value,
                chatID: chatID
            })
            addChatHistory(event.target.value)

            event.target.value = ''
        }
        else if (event.key === 'Tab' && chatIDSToggle === true) {
            chatIDS.map((item, i) => {
                if (item === chatID) {
                    if (i + 1 < chatIDS.length) setChatID(chatIDS[i + 1])
                    else setChatID(chatIDS[0])
                }
            })

            setTimeout(() => $(event.target).focus(), 200)
        }
        else if (event.key === 'Escape') {
            event.preventDefault()

            setChatToggle(false)
            ragemp.send('ui::hud:chatClosed')
        }
        else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            if (event.key === 'ArrowUp') chatHistoryMove++
            else chatHistoryMove--

            if (chatHistoryMove < -1) chatHistoryMove = -1
            if (chatHistoryMove >= chatHistory.length) chatHistoryMove = chatHistory.length - 1

            if (chatHistory[chatHistoryMove])
                event.target.value = chatHistory[chatHistoryMove]

            if (event.key === 'ArrowDown' && !chatHistory[chatHistoryMove])
                event.target.value = ""
        }
    }
    function chatAddMessage(data) {
        data.timestamp = convertToMoscowDate(new Date())
        setChat(old => [...old, data])
    }
    function addChatHistory(message) {
        setChatHistory(old => [message, ...old])
    }

    React.useEffect(() => {
        $('.hud .hud-chat .hud-chat-body').scrollTop($('.hud .hud-chat .hud-chat-body').height() + 99999999)
    }, [chat])

    //time










    return (
        <div className="hud" style={toggle === false ? { display: 'none' } : {}}>
            <section className="hud-keynotf" style={!keynotf.toggle ? { display: 'none' } : {}}>
                {keynotf.message} <h1 className="key">{keynotf.key}</h1>
            </section>
            <section className="hud-logo-top-gz" style={gz === false ? { display: 'none' } : {}}>
                <img src={IMG_GREENZONE} />
                <h1>GREEN ZONE</h1>
                <div className="gz-blip"></div>
            </section>
            <section className="hud-logo">
                <div className="hud-logo-top">

                    <section className="hud-logo-top-">
                        <div className="hud-logo-top-wrapper">
                            <div className="hud-logo-top-side">


                                <p>{time.toLocaleString('ru-RU', {
                                    year: '2-digit',
                                    month: 'numeric',
                                    day: 'numeric'
                                })}</p>
                                <h1>{time.toLocaleString('ru-RU', {
                                    hour: 'numeric',
                                    minute: 'numeric'
                                })}</h1>
                            </div>

                            <img className='logo' src={IMG_LOGO} />
                        </div>

                        {/* <div className="hud-logo-top-wanted">
                            {[0, 0, 0, 0, 0].map((item, i) => {
                                return (<ReactSVG src={i < wanted ? SVG_WANTED_YES : SVG_WANTED} />)
                            })}
                        </div> */}

                        <div className="hud-logo-top-bottom">
                            <img src={IMG_ONLINE} />
                            <p>{stats.online[0]}</p>
                            <h1>ID<span>{stats.id}</span></h1>
                            <h2>{stats.name}</h2>
                        </div>
                    </section>
                </div>
                <div className="hud-logo-cash">
                    <h1>$ {cash[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} <img src={IMG_WALLET} /></h1>
                    <h2>$ {cash[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} <img src={IMG_BANK} /></h2>
                </div>
                <div className="hud-logo-weapon" style={weapon[0] === 0 ? { display: 'none' } : {}}>
                    <img src={IMG_WEAPON} />
                    <h1>{weapon[1]}</h1>
                    <h2>{weapon[2]} / <span>{weapon[3]}</span></h2>
                </div>
                <div className="hud-logo-quests" style={quests.status === false ? { display: 'none' } : {}}>
                    <h1>{quests.name}</h1>
                    <div>
                        {quests.tasks.map((item, i) => {
                            return (<span key={i} className={item.status === true && "hud-logo-quests-success"}>{item.name}</span>)
                        })}
                    </div>
                </div>
            </section>

            <section className="hud-hint" style={keysToggle === false ? { display: 'none' } : {}}>
                <div className="hud-hint-title">
                    <h1>Подсказки</h1>
                    <h1>{keysToggleKey}</h1>
                </div>
                <div className="hud-hint-body">
                    {keys.map((item, i) => {
                        return (<section key={i}>
                            <h1 className="key-hint">{item.key}</h1>
                            <h2>{item.name}</h2>
                        </section>)
                    })}
                </div>
            </section>

            <section className="hud-stats">

                <div className={stats.micro === true ? "hud-stats-micro-on" : stats.micro === 'mute' ? 'hud-stats-micro-mute' : 'hud-stats-micro-mute'} style={stats.micro === true ? { background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)' } : {}}>
                    {
                        stats.micro === true ? <img alt='on' src={IMG_MICRO_ON} /> : <img alt='off' src={IMG_MICRO_OFF} />
                    }
                    {/*  style={{ width: "18px", left: "17px" }} */}

                </div>

                <div className='food'>
                    <div className="food-item-1">
                        <img src={IMG_THIRST} />
                    </div>
                    <div className="food-item-2">
                        <img src={IMG_SATIETY} />
                    </div>

                </div>
                <div className='gps'>
                    <img src={IMG_GPS} />
                    <h1>
                        {stats.gps[0]}
                        <h2>{stats.gps[1]}</h2>
                    </h1>
                </div>

            </section>

            <section className="hud-speed">

                <div className="hud-speedometr" style={!speedometr ? { display: "none" } : {}}>
                    <div className="hud-speedometr-def">
                        <div className="hud-speedometr-def-bg">
                            <div className="hud-speedometr-def-count">
                                <h2>km/h</h2>
                                {Array.from(speedometrSpeed.toString().padStart(3, '-')).map((item, i) => {
                                    if (item === '-' || speedometrSpeed === 0) return (<span>0</span>)
                                    return (<h1>{item}</h1>)
                                })}
                            </div>

                            <h5 style={{ bottom: "0", left: "28px", transform: "rotate(0deg)" }}>0</h5>
                            <h5 style={{ bottom: "33px", left: "14px", transform: "rotate(0deg)" }}>20</h5>
                            <h5 style={{ bottom: "69px", left: "8px", transform: "rotate(0deg)" }}>40</h5>
                            <h5 style={{ top: "75px", left: "12px", transform: "rotate(0deg)" }}>60</h5>
                            <h5 style={{ top: "44px", left: "29px", transform: "rotate(0deg)" }}>80</h5>
                            <h5 style={{ top: "21px", left: "56px", transform: "rotate(0deg)" }}>100</h5>
                            <h5 style={{ top: "5px", left: "86px", transform: "rotate(0deg)" }}>120</h5>
                            <h5 style={{ top: "0", left: "120px", transform: "rotate(0deg)" }}>140</h5>
                            <h5 style={{ top: "5px", right: "86px", transform: "rotate(0deg)" }}>160</h5>
                            <h5 style={{ top: "21px", right: "56px", transform: "rotate(0deg)" }}>180</h5>
                            <h5 style={{ top: "44px", right: "29px", transform: "rotate(0deg)" }}>200</h5>
                            <h5 style={{ top: "75px", right: "12px", transform: "rotate(0deg)" }}>220</h5>
                            <h5 style={{ bottom: "69px", right: "8px", transform: "rotate(0deg)" }}>240</h5>
                            <h5 style={{ bottom: "33px", right: "14px", transform: "rotate(0deg)" }}>260</h5>
                            <h5 style={{ bottom: "0", right: "28px", transform: "rotate(0deg)" }}>300</h5>

                            <img className="hud-speedometr-def-piece" src={require('./images/speedometr_piece.png')} />
                            <img style={{ transform: `translate(-50%, -50%) rotate(${speedometrSpeed <= 300 ? -130 + (speedometrSpeed * 0.85) : 130}deg)` }} className="hud-speedometr-def-stick" src={require('./images/speedometr_stick.png')} />

                            <div style={{ bottom: "39px", left: "0", transform: "rotate(-28deg)" }} className="hud-speedometr-def-piece-big"></div>
                            <div style={{ bottom: "78px", left: "-5px", transform: "rotate(0deg)" }} className="hud-speedometr-def-piece-big"></div>
                            <div style={{ bottom: "117px", left: "1px", transform: "rotate(21deg)" }} className="hud-speedometr-def-piece-big"></div>
                            <div style={{ top: "44px", left: "19px", transform: "rotate(43deg)" }} className="hud-speedometr-def-piece-big"></div>
                            <div style={{ top: "17px", left: "49px", transform: "rotate(57deg)" }} className="hud-speedometr-def-piece-big"></div>
                            <div style={{ top: "-1px", left: "85px", transform: "rotate(73deg)" }} className="hud-speedometr-def-piece-big"></div>
                            <div style={{ top: "-6px", left: "125px", transform: "rotate(90deg)" }} className="hud-speedometr-def-piece-big"></div>
                            <div style={{ top: "-1px", right: "83px", transform: "rotate(111deg)" }} className="hud-speedometr-def-piece-big"></div>
                            <div style={{ top: "15px", right: "46px", transform: "rotate(-55deg)" }} className="hud-speedometr-def-piece-big"></div>
                            <div style={{ top: "43px", right: "17px", transform: "rotate(-43deg)" }} className="hud-speedometr-def-piece-big"></div>
                            <div style={{ top: "80px", right: "-3px", transform: "rotate(-22deg)" }} className="hud-speedometr-def-piece-big"></div>
                            <div style={{ top: "121px", right: "-10px", transform: "rotate(0deg)" }} className="hud-speedometr-def-piece-big"></div>
                            <div style={{ bottom: "37px", right: "-5px", transform: "rotate(14deg)" }} className="hud-speedometr-def-piece-big"></div>

                            <img style={{ bottom: "120px", right: "-2px", transform: "rotate(-1deg)" }} className="hud-speedometr-def-piece-bigged" src={require('./images/speedometr_piece_bigged.png')} />
                            <img style={{ bottom: "81px", right: "-15px", transform: "rotate(18deg)" }} className="hud-speedometr-def-piece-bigged" src={require('./images/speedometr_piece_bigged.png')} />
                            <img style={{ bottom: "40px", right: "-16px", transform: "rotate(34deg)" }} className="hud-speedometr-def-piece-bigged" src={require('./images/speedometr_piece_bigged.png')} />
                            <img style={{ bottom: "-1px", right: "-3px", transform: "rotate(54deg)" }} className="hud-speedometr-def-piece-bigged" src={require('./images/speedometr_piece_bigged.png')} />

                            <svg className="hud-speedometr-speed" viewBox="0 0 50 50">
                                <circle cx="25" cy="25" r="20" fill="none" stroke-width="2">
                                </circle>
                            </svg>
                        </div>
                    </div>
                    <div className="hud-speedometr-data">
                        <div style={{ top: "-168px", right: "-76px" }} className={`hud-speedometr-data-elem ${speedometrData.belt && "hud-speedometr-data-elem-on"}`}>
                            <img src={require('./images/speedometr_belt.png')} />
                            <h1>{speedometrKeys.belt}</h1>

                        </div>
                        <div style={{ top: "-134px", right: "-56px" }} className={`hud-speedometr-data-elem ${speedometrData.engine && "hud-speedometr-data-elem-on"}`}>
                            <img src={require('./images/speedometr_engine.png')} />
                            <h1>{speedometrKeys.engine}</h1>

                        </div>
                        <div style={{ top: "-96px", right: "-44px" }} className={`hud-speedometr-data-elem ${speedometrData.lights && "hud-speedometr-data-elem-on"}`}>
                            <img src={require('./images/speedometr_lights.png')} />
                            <h1>{speedometrKeys.lights}</h1>

                        </div>
                        <div style={{ top: "-60px", right: "-34px" }} className={`hud-speedometr-data-elem ${speedometrData.doors && "hud-speedometr-data-elem-on"}`}>
                            <img src={require('./images/speedometr_doors.png')} />
                            <h1>{speedometrKeys.doors}</h1>

                        </div>
                        <div className="hud-speedometr-data-fuel">
                            <img src={require('./images/speedometr_fuel.png')} />
                            <h1>{speedometrData.fuel}L</h1>
                        </div>
                    </div>
                </div>
            </section>

            <section className="hud-chat">
                <div className={`hud-chat-body ${chatToggle === false && 'hud-chat-body-not-scroll'}`}>
                    {chat.map((item, i) => {
                        for (let i in item.text) {
                            i = parseInt(i)
                            if (item.text[i] === '{') {
                                let color = item.text.substring(i + 1, i + 8)
                                item.text = item.text.substring(0, i) + `<span style="color: ${color};" />` + item.text.substring(i + 8)
                            }
                            if (item.text[i] === '}') item.text = item.text.replace("}", "")
                        }
                        return (<section key={i} style={{ color: item.color }}> {item.type === 'news' ? <div className='news'><span>Call</span><span>Sms</span></div> : !item.type  ? '' : <span className={item.type}>{item.type}</span>}<h1>{htmlReactParser(`${chatSettings.timestamp == true ? `[${item.timestamp.toLocaleString('ru-RU', { hour: 'numeric', minute: 'numeric', second: 'numeric' })}]` `` : ''} ${item.text }`)}</h1>
                        </section>)
                    })}

                </div>
                <div className={`hud-chat-input ${chatToggle === true && 'hud-chat-input-open'}`}>
                    <input onKeyDown={chatEnter} type="text" placeholder="Введите сообщение..." maxlength="255" />
                    <section style={!chatIDSToggle ? { display: 'none' } : {}}>
                        {chatIDS.map((item, i) => {
                            return (<button onClick={() => setChatID(item)} className={item === chatID && 'hud-chat-input-btn'}>{item}</button>)
                        })}
                    </section>
                    <div className="hud-chat-hint"><img src={IMG_HINT_CHAT} alt="sds" /> Нажмите TAB, чтобы переключиться на другой чат</div>
                </div>
            </section>
        </div>
    )
}
