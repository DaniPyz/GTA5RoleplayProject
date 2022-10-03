import './css.css'

import $ from 'jquery'
import React from 'react'
import ragemp from '../../_modules/ragemp'

export default function Shop()
{
    const [ toggle, setToggle ] = React.useState(false)

    const [ nav, setNav ] = React.useState([
        {
            name: 'Продукты',
            id: 0
        },
        {
            name: 'Медикаменты',
            id: 1
        },
        {
            name: 'Музыка',
            id: 2
        },
        {
            name: 'Рем комлекты',
            id: 3
        },
        {
            name: 'Телефоны',
            id: 4
        }
    ])
    const [ navSelect, setNavSelect ] = React.useState(0)

    const [ items, setItems ] = React.useState([
        { name: 'Банан 1', type: 'Фрукт', img: '1.png', price: 250 },
        { name: 'Банан 2', type: 'Фрукт', img: '1.png', price: 250 },
        { name: 'Банан 3', type: 'Фрукт', img: '1.png', price: 250 },
        { name: 'Банан 4', type: 'Фрукт', img: '1.png', price: 250 },
        { name: 'Банан 5', type: 'Фрукт', img: '1.png', price: 250 },
        { name: 'Банан 4', type: 'Фрукт', img: '1.png', price: 250 },
        { name: 'Банан 4', type: 'Фрукт', img: '1.png', price: 250 },
        { name: 'Банан 4', type: 'Фрукт', img: '1.png', price: 250 },
        { name: 'Банан 4', type: 'Фрукт', img: '1.png', price: 250 },
        { name: 'Банан 4', type: 'Фрукт', img: '1.png', price: 250 },
        { name: 'Банан 4', type: 'Фрукт', img: '1.png', price: 250 },
        { name: 'Банан 4', type: 'Фрукт', img: '1.png', price: 250 }
    ])
    const [ basket, setBasket ] = React.useState([])

    function buyItem(id)
    {

    }

    function getBasketAllPrice()
    {
        let price = 0
        basket.forEach(item =>
        {
            price += item.price
        })
        return price
    }

    React.useMemo(() =>
    {
        $(document).on('keydown', event =>
        {
            if(event.keyCode === 69 || event.keyCode === 81)
            {
                let selected = parseInt($('.shop .shop-header .shop-header-nav section').attr('data-selected'))
                const navs = JSON.parse($('.shop .shop-header .shop-header-nav section').attr('data-nav'))

                if(event.keyCode === 69)
                {
                    if(selected + 1 >= navs.length) selected = 0
                    else selected = selected + 1
                }
                else
                {
                    if(selected - 1 < 0) selected = navs.length - 1
                    else selected = selected - 1
                }

                setNavSelect(selected)
            }
        })
    }, [])
    React.useEffect(() =>
    {
        $('.shop .shop-header .shop-header-nav section').scrollLeft($(`.shop .shop-header .shop-header-nav section button[data-id=${navSelect}]`).offset().left
        - $(`.shop .shop-header .shop-header-nav section button[data-id=${navSelect}]`).width() - 250)
    }, [navSelect])

    return (
        <div className="shop" style={!toggle ? {display: 'none'} : {}}>
            <div className="shop-header">
                <header className="header-deg">
                    <h1>
                        Магазин
                        <span>Товаров 24/7</span>
                    </h1>
                </header>
                <div className="shop-header-nav">
                    <button className="btn btn-select btn-ui">Q</button>
                    <section data-selected={navSelect} data-nav={JSON.stringify(nav)}>
                        {nav.map((item, i) =>
                        {
                            return (<button data-id={i} onClick={() => setNavSelect(i)} key={i} className={`btn btn-ui ${navSelect === i && 'btn-ui-select'}`}>{item.name}</button>)
                        })}
                    </section>
                    <button className="btn btn-select btn-ui">E</button>
                </div>
                <header className="header-deg">
                    <h1>
                        Корзина
                        <span>Товаров</span>
                    </h1>
                </header>
            </div>
            <div className="shop-wrap">
                <div className="shop-items left-auto-scroll">
                    {items.map((item, i) =>
                    {
                        return (<section key={i} className="shop-items-elem">
                            <div onClick={() => setBasket(old => { return [...old, item ] })} className="shop-items-elem-info">
                                <h1>{item.name}</h1>
                                <h2>{item.type}</h2>
                                <div>
                                    <img src={require(`./images/items/${item.img}`)} />
                                </div>
                                <h3>
                                    ${item.price.toLocaleString()}
                                    <span>$</span>
                                </h3>
                            </div>
                            <button onClick={() => buyItem(i)} className="btn">Приобрести товар</button>
                        </section>)
                    })}
                </div>
                <div className="shop-basket">
                    <section className="shop-basket-items">
                        {basket.map((item, i) =>
                        {
                            return (<section onClick={() => setBasket(old => { return [ ...old.slice(0, i), ...old.slice(i + 1) ] })} key={i}>
                                <img src={require(`./images/items/${item.img}`)} />
                                <h1>
                                    {item.name}
                                    <h2>{item.type} <span>${item.price.toLocaleString()}</span></h2>
                                </h1>
                                <img src={require('./images/delete.png')} />
                            </section>)
                        })}
                    </section>
                    <section className="shop-basket-buy">
                        <h1>Итого</h1>
                        <h2>${getBasketAllPrice().toLocaleString()}</h2>
                        <div>
                            <button className="btn">Оплатить наличными</button>
                            <button className="btn">Оплатить картой</button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
