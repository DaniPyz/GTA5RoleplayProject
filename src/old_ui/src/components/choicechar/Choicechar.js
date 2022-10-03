import './css.css'

import $ from 'jquery'
import React from 'react'
import ragemp from '../../_modules/ragemp'

export default function Choicechar()
{
    const [ toggle, setToggle ] = React.useState(false)

    const [ chars, setChars ] = React.useState([{
        id: 1,
        name: 'Nezuko Kamado',
        birthDay: new Date(),
        level: 59,
        cash: 2312312312,
        bankCash: 535334,
        frac: 'Нет'
    }, {
        buy: true
    }])

    function selectChar(id)
    {
        ragemp.send('ui::selectchar', { char: id, charData: chars[id] })
    }

    React.useMemo(() =>
    {
        ragemp.eventCreate('client::selectchar', (cmd, data) =>
        {
            switch(cmd)
            {
                case 'toggle':
                {
                    setToggle(data.status)
                    break
                }
                case 'chars':
                {
                    setChars(data.chars)
                    break
                }
            }
        })
    })

    return (
        <div className="choicechar" style={!toggle ? {display: "none"} : {}}>
            <section className="choicechar-title">
                <h1>Выбор персонажа</h1>
                <span>А еще можно создать нового или купить, четко же.</span>
            </section>
            <section className="choicechar-body">
                {chars.map((item, i) =>
                {
                    if(item.id)
                    {
                        return (<div key={i} className="choicechar-body-elem">
                            <section className="choicechar-body-elem-title">
                                <h1>{item.name}</h1>
                                <span>#{i + 1}</span>
                            </section>
                            <section className="choicechar-body-elem-desc">
                                <div>
                                    <span>Дата рождения</span>
                                    <span>{new Date(item.birthDay).toLocaleString()}</span>
                                </div>
                                <div>
                                    <span>Уровень</span>
                                    <span>{item.level}</span>
                                </div>
                                <div>
                                    <span>Наличные</span>
                                    <span>{item.cash.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                                </div>
                                <div>
                                    <span>Деньги на карте</span>
                                    <span>{item.bankCash.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                                </div>
                                <div>
                                    <span>Текущая фракция</span>
                                    <span>{item.frac}</span>
                                </div>
                            </section>
                            <section className="choicechar-body-elem-btn">
                                <button className="btn" onClick={() => selectChar(i)}>Выбрать</button>
                            </section>
                        </div>)
                    }
                    else if(item.buy)
                    {
                        return (<div key={i} className="choicechar-body-elem choicechar-body-elem-buy">
                            <section className="choicechar-body-elem-title">
                                <h1>Платный слот</h1>
                                <span></span>
                            </section>
                            <section className="choicechar-body-elem-desc">
                                Данный слот можно разблокировать за 650 York Coins
                            </section>
                            <section className="choicechar-body-elem-btn">
                                <button className="btn btn-select" onClick={() => selectChar(i)}>Разблокировать</button>
                            </section>
                        </div>)
                    }
                    else
                    {
                        return (<div key={i} className="choicechar-body-elem choicechar-body-elem-buy choicechar-body-elem-free">
                            <section className="choicechar-body-elem-title">
                                <h1>Свободный слот</h1>
                            </section>
                            <section className="choicechar-body-elem-desc">
                                Вы можете создать своего персонажа в данном слоту
                            </section>
                            <section className="choicechar-body-elem-btn">
                                <button className="btn btn-select" onClick={() => selectChar(i)}>Создать персонажа</button>
                            </section>
                        </div>)
                    }
                })}
            </section>
        </div>
    )
}
