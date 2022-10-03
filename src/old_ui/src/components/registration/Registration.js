/* eslint-disable default-case */

import './css.css'

import $ from 'jquery'
import React from 'react'
import ragemp from '../../_modules/ragemp'

export default function Registration()
{
    const [ toggle, setToggle ] = React.useState(false)

    const [ type, setType ] = React.useState(1) // 0 - reg, 1 - auth, 2 - recovery
    const [ saveme, setSaveme ] = React.useState(0) // 0 - no, 1 - yes

    const [ error, setError ] = React.useState({
        state: false,
        text: ''
    })

    React.useMemo(() =>
    {
        ragemp.eventCreate('client::reg', (cmd, data) =>
        {
            switch(cmd)
            {
                case 'toggle':
                {
                    setToggle(data.status)
                    break
                }
                case 'error':
                {
                    setError(data)
                    break
                }
                case 'setSaveme':
                {
                    setSaveme(data.status)
                    break
                }
                case 'setLogin':
                {
                    $('.reg #reg-registration-login').val(data.value)
                    $('.reg #reg-auth-login').val(data.value)

                    break
                }
                case 'setPassword':
                {
                    $('.reg #reg-auth-pass').val(data.value)
                    break
                }
            }
        })
    }, [])


    function regGO()
    {
        const saveme = $('.reg #reg-saveme').is(':checked')
        setError({ state: false, text: "" })

        if(type === 0)
        {
            let
                login = $('.reg #reg-registration-login').val(),
                pass = $('.reg #reg-registration-pass').val(),
                passRe = $('.reg #reg-registration-pass-re').val(),
                email = $('.reg #reg-registration-mail').val(),
                promo = $('.reg #reg-registration-promo').val()

            if(!login.length || !pass.length || !passRe.length || !email.length)return setError({ state: true, text: "Укажите обязательные данные" })
            if(pass !== passRe)return setError({ state: true, text: "Пароли не совпадают" })

            ragemp.send('ui::reg', {
                type: 'registration',
                saveme,
                login,
                pass,
                passRe,
                email,
                promo
            })
        }
        else if(type === 1)
        {
            let
                login = $('.reg #reg-auth-login').val(),
                pass = $('.reg #reg-auth-pass').val()

            if(!login.length || !pass.length)return setError({ state: true, text: "Укажите обязательные данные" })

            ragemp.send('ui::reg', {
                type: 'auth',
                saveme,
                login,
                pass
            })
        }
        else if(type === 2)
        {
            let
                login = $('.reg #reg-recovery-mail').val(),
                code = $('.reg #reg-recovery-code').val()

            if(!login.length || !code.length)return setError({ state: true, text: "Укажите обязательные данные" })

            ragemp.send('ui::reg', {
                type: 'recovery',
                login,
                code
            })
        }
    }

    return (
        <div className="reg" style={!toggle ? {display: 'none'} : {}}>
            <div className="reg-bg-color">
                <div></div>
                <section></section>
                <section></section>
                <section></section>
                <section></section>
            </div>

            <section className="reg-header">
                <button style={{"clip-path": "polygon(0% 0%, 87% 0%, 100% 100%, 12% 100%)", transform: "translateX(15px)"}} className={`btn-ui ${type === 1 ? "btn-ui-select" : ""}`} onClick={() => setType(1)}>Авторизация</button>
                <button style={{"clip-path": "polygon(0% 0%, 83% 0%, 100% 100%, 15% 100%)"}} className={`btn-ui ${type === 0 ? "btn-ui-select" : ""}`} onClick={() => setType(0)}>Регистация</button>
                <button style={{"clip-path": "polygon(0% 0%, 88% 0%, 100% 100%, 10% 100%)", transform: "translateX(-15px)"}} className={`btn-ui ${type === 2 ? "btn-ui-select" : ""}`} onClick={() => setType(2)}>Восстановление аккаунта</button>
            </section>

            <section className="reg-body">
                <div className="reg-body-title">
                    <h1>{type === 0 ? "Регистрация" : type === 1 ? "Авторизация" : "Восстановление"}</h1>
                    <span>{type === 0 ? "Нового аккаунта" : "Вашего аккаунта"}</span>
                </div>
                <div className="reg-body-inputs" style={type === 0 ? {} : {display: 'none'}}>
                    <section className="reg-body-input">
                        <label>Логин</label>
                        <input id="reg-registration-login" className="input" type="text" placeholder=" " maxvalue="42" />
                    </section>
                    <section className="reg-body-input">
                        <label>Пароль</label>
                        <input id="reg-registration-pass" className="input" type="password" placeholder=" " maxvalue="42" />
                    </section>
                    <section className="reg-body-input">
                        <label>Повторите пароль</label>
                        <input id="reg-registration-pass-re" className="input" type="password" placeholder=" " maxvalue="42" />
                    </section>
                    <section className="reg-body-input">
                        <label>Почта</label>
                        <input id="reg-registration-mail" className="input" type="text" placeholder=" " maxvalue="42" />
                    </section>
                    <section className="reg-body-input">
                        <label>Промокод</label>
                        <input id="reg-registration-promo" className="input" type="text" placeholder="Не имеется" maxvalue="42" />
                    </section>
                </div>
                <div className="reg-body-inputs" style={type === 1 ? {} : {display: 'none'}}>
                    <section className="reg-body-input">
                        <label>Логин</label>
                        <input id="reg-auth-login" className="input" type="text" placeholder=" " maxvalue="42" />
                    </section>
                    <section className="reg-body-input">
                        <label>Пароль</label>
                        <input id="reg-auth-pass" className="input" type="password" placeholder=" " maxvalue="42" />
                    </section>
                </div>
                <div className="reg-body-inputs" style={type === 2 ? {} : {display: 'none'}}>
                    <section className="reg-body-input">
                        <label>Почта</label>
                        <input id="reg-recovery-mail" className="input" type="text" placeholder=" " maxvalue="42" />
                    </section>
                    <section className="reg-body-input">
                        <label>Код из письма</label>
                        <input id="reg-recovery-code" className="input" type="password" placeholder=" " maxvalue="42" />
                    </section>
                </div>
                <section className="reg-body-saveme" style={type === 2 ? {display: 'none'} : {}}>
                    <input checked={saveme} onChange={() => setSaveme(!saveme)} id="reg-saveme" className="input-checkbox" type="checkbox" />
                    <div>
                        <h2>Запомнить</h2>
                        <span>Мой аккаунт в системе</span>
                    </div>
                </section>
                <section className="reg-body-btn">
                    <button onClick={regGO} className="btn btn-select">{type === 0 ? "Зарегистрироваться" : type === 1 ? "Авторизоваться" : "Восстановить"}</button>
                </section>
            </section>

            <section className="reg-error" style={error.state === false ? {display: "none"} : {}}>
                <h1>Ошибка!</h1>
                <span>{error.text}</span>
                <button onClick={() => setError({ state: false, text: '' })} className="btn">Понял-понял</button>
            </section>
        </div>
    )
}
