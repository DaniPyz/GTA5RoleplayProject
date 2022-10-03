import React from 'react'
import $ from 'jquery'

import ragemp from '../../_modules/ragemp'
import Choiceinput from '../../_modules/Choiceinput'

import func from '../../_modules/func'

import './css.css'

import IMG_PARENTS from './images/parents.png'
import IMG_HAIRS_TYPE from './images/hairs_type.png'
import IMG_BEARD from './images/beard.png'
import IMG_HAIR from './images/hair.png'
import IMG_LIPSTICK from './images/lipstick.png'
import IMG_EYES from './images/eye.png'
import IMG_EYEBROWS from './images/eyebrows.png'
import IMG_CLOTHES from './images/clothes.png'
import IMG_FACE from './images/face.png'
import IMG_MAIN from './images/main.png'

import IMG_PARENTS_F_0 from './images/parents/father_0.png'
import IMG_PARENTS_F_1 from './images/parents/father_1.png'
import IMG_PARENTS_F_2 from './images/parents/father_2.png'
import IMG_PARENTS_F_3 from './images/parents/father_3.png'
import IMG_PARENTS_F_4 from './images/parents/father_4.png'
import IMG_PARENTS_F_5 from './images/parents/father_5.png'
import IMG_PARENTS_F_6 from './images/parents/father_6.png'
import IMG_PARENTS_F_7 from './images/parents/father_7.png'
import IMG_PARENTS_F_8 from './images/parents/father_8.png'
import IMG_PARENTS_F_9 from './images/parents/father_9.png'
import IMG_PARENTS_F_10 from './images/parents/father_10.png'
import IMG_PARENTS_F_11 from './images/parents/father_11.png'
import IMG_PARENTS_F_12 from './images/parents/father_12.png'
import IMG_PARENTS_F_13 from './images/parents/father_13.png'
import IMG_PARENTS_F_14 from './images/parents/father_14.png'
import IMG_PARENTS_F_15 from './images/parents/father_15.png'
import IMG_PARENTS_F_16 from './images/parents/father_16.png'
import IMG_PARENTS_F_17 from './images/parents/father_17.png'
import IMG_PARENTS_F_18 from './images/parents/father_18.png'
import IMG_PARENTS_F_19 from './images/parents/father_19.png'
import IMG_PARENTS_F_20 from './images/parents/father_20.png'
import IMG_PARENTS_F_21 from './images/parents/father_21.png'
import IMG_PARENTS_F_22 from './images/parents/father_22.png'

import IMG_PARENTS_M_0 from './images/parents/mother_0.png'
import IMG_PARENTS_M_1 from './images/parents/mother_1.png'
import IMG_PARENTS_M_2 from './images/parents/mother_2.png'
import IMG_PARENTS_M_3 from './images/parents/mother_3.png'
import IMG_PARENTS_M_4 from './images/parents/mother_4.png'
import IMG_PARENTS_M_5 from './images/parents/mother_5.png'
import IMG_PARENTS_M_6 from './images/parents/mother_6.png'
import IMG_PARENTS_M_7 from './images/parents/mother_7.png'
import IMG_PARENTS_M_8 from './images/parents/mother_8.png'
import IMG_PARENTS_M_9 from './images/parents/mother_9.png'
import IMG_PARENTS_M_10 from './images/parents/mother_10.png'
import IMG_PARENTS_M_11 from './images/parents/mother_11.png'
import IMG_PARENTS_M_12 from './images/parents/mother_12.png'
import IMG_PARENTS_M_13 from './images/parents/mother_13.png'
import IMG_PARENTS_M_14 from './images/parents/mother_14.png'
import IMG_PARENTS_M_15 from './images/parents/mother_15.png'
import IMG_PARENTS_M_16 from './images/parents/mother_16.png'
import IMG_PARENTS_M_17 from './images/parents/mother_17.png'
import IMG_PARENTS_M_18 from './images/parents/mother_18.png'
import IMG_PARENTS_M_19 from './images/parents/mother_19.png'
import IMG_PARENTS_M_20 from './images/parents/mother_20.png'

import IMG_HAIRS_F_0 from './images/hairs/Clothing_F_2_0.jpg'
import IMG_HAIRS_F_1 from './images/hairs/Clothing_F_2_1.webp'
import IMG_HAIRS_F_2 from './images/hairs/Clothing_F_2_2.jpg'
import IMG_HAIRS_F_3 from './images/hairs/Clothing_F_2_3.jpg'
import IMG_HAIRS_F_5 from './images/hairs/Clothing_F_2_5.jpg'
import IMG_HAIRS_F_6 from './images/hairs/Clothing_F_2_6.jpg'
import IMG_HAIRS_F_7 from './images/hairs/Clothing_F_2_7.webp'
import IMG_HAIRS_F_8 from './images/hairs/Clothing_F_2_8.jpg'
import IMG_HAIRS_F_11 from './images/hairs/Clothing_F_2_11.jpg'
import IMG_HAIRS_F_14 from './images/hairs/Clothing_F_2_14.jpg'

import IMG_HAIRS_M_0 from './images/hairs/Clothing_M_2_0.jpg'
import IMG_HAIRS_M_1 from './images/hairs/Clothing_M_2_1.webp'
import IMG_HAIRS_M_2 from './images/hairs/Clothing_M_2_2.webp'
import IMG_HAIRS_M_5 from './images/hairs/Clothing_M_2_5.jpg'
import IMG_HAIRS_M_6 from './images/hairs/Clothing_M_2_6.webp'
import IMG_HAIRS_M_8 from './images/hairs/Clothing_M_2_8.jpg'
import IMG_HAIRS_M_16 from './images/hairs/Clothing_M_2_16.jpg'
import IMG_HAIRS_M_12 from './images/hairs/Clothing_M_2_12.webp'
import IMG_HAIRS_M_13 from './images/hairs/Clothing_M_2_13.jpg'
import IMG_HAIRS_M_11 from './images/hairs/Clothing_M_2_11.jpg'

import IMG_RANDOM_BTN from './images/random_btn.png'

export default function Createchar()
{
    const [ toggle, setToggle ] = React.useState(false)

    const [ list, setList ] = React.useState(0)
    const listNames = [
        { img: IMG_MAIN, name: "Основное" },
        { img: IMG_PARENTS, name: "Родословная" },
        { img: IMG_HAIRS_TYPE, name: "Волосы" },
        { img: IMG_HAIR, name: "Цвет волос" },
        { img: IMG_EYES, name: "Внешность" },
        { img: IMG_FACE, name: "Форма лица" },
        { img: IMG_CLOTHES, name: "Одежда" }
    ]

    const [ name, setName ] = React.useState(['', ''])
    const [ age, setAge ] = React.useState()
    const [ gender, setGender ] = React.useState(0)

    const [ genetic, setGenetic ] = React.useState({
        mother: 21,
        father: 0,

        similarity: 0.5,
        skinTone: 0.5
    })

    const [ hair, setHair ] = React.useState({
        head: 0,
        beard: 0,
        eyebrow: 0,
        breast: 0,

        head_color: 0,
        beard_color: 0,
        eyebrow_color: 0,
        breast_color: 0
    })
    const [ appearance, setAppearance ] = React.useState([0, 0, 0, 0, 0, 0, 0, 0, 0])

    const [ face, setFace ] = React.useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const faceList = [ 'Ширина носа', 'Высота носа', 'Длина носа', 'Переносица', 'Кончик носа', 'Сдвиг переносицы', 'Высота бровей', 'Ширина бровей', 'Высота скул', 'Ширина скул', 'Ширина щек', 'Глаза', 'Губы', 'Ширина челюсти', 'Высота челюсти', 'Длина подбородка', 'Сдвиг подбородка', 'Ширина подбородка', 'Форма подбородка', 'Шея' ]

    const [ parents, setParents ] = React.useState(0)
    const parentsList = [
        [ // mother
            { id: 21, img: IMG_PARENTS_M_0 },
            { id: 22, img: IMG_PARENTS_M_1 },
            { id: 23, img: IMG_PARENTS_M_2 },
            { id: 24, img: IMG_PARENTS_M_3 },
            { id: 25, img: IMG_PARENTS_M_4 },
            { id: 26, img: IMG_PARENTS_M_5 },
            { id: 27, img: IMG_PARENTS_M_6 },
            { id: 28, img: IMG_PARENTS_M_7 },
            { id: 29, img: IMG_PARENTS_M_8 },
            { id: 30, img: IMG_PARENTS_M_9 },
            { id: 31, img: IMG_PARENTS_M_10 },
            { id: 32, img: IMG_PARENTS_M_11 },
            { id: 33, img: IMG_PARENTS_M_12 },
            { id: 34, img: IMG_PARENTS_M_13 },
            { id: 35, img: IMG_PARENTS_M_14 },
            { id: 36, img: IMG_PARENTS_M_15 },
            { id: 37, img: IMG_PARENTS_M_16 },
            { id: 38, img: IMG_PARENTS_M_17 },
            { id: 39, img: IMG_PARENTS_M_18 },
            { id: 40, img: IMG_PARENTS_M_19 },
            { id: 41, img: IMG_PARENTS_M_20 }
        ],
        [ // father
            { id: 0, img: IMG_PARENTS_F_0 },
            { id: 1, img: IMG_PARENTS_F_1 },
            { id: 2, img: IMG_PARENTS_F_2 },
            { id: 3, img: IMG_PARENTS_F_3 },
            { id: 4, img: IMG_PARENTS_F_4 },
            { id: 5, img: IMG_PARENTS_F_5 },
            { id: 6, img: IMG_PARENTS_F_6 },
            { id: 7, img: IMG_PARENTS_F_7 },
            { id: 8, img: IMG_PARENTS_F_8 },
            { id: 9, img: IMG_PARENTS_F_9 },
            { id: 10, img: IMG_PARENTS_F_10 },
            { id: 11, img: IMG_PARENTS_F_11 },
            { id: 12, img: IMG_PARENTS_F_12 },
            { id: 13, img: IMG_PARENTS_F_13 },
            { id: 14, img: IMG_PARENTS_F_14 },
            { id: 15, img: IMG_PARENTS_F_15 },
            { id: 16, img: IMG_PARENTS_F_16 },
            { id: 17, img: IMG_PARENTS_F_17 },
            { id: 18, img: IMG_PARENTS_F_18 },
            { id: 19, img: IMG_PARENTS_F_19 },
            { id: 20, img: IMG_PARENTS_F_20 },
            { id: 42, img: IMG_PARENTS_F_21 },
            { id: 43, img: IMG_PARENTS_F_22 }
        ]
    ]
    // const colorList = ['#ffffff', '#FF3434', '#FFBA34', '#8DFF34', '#34FFB6', '#3485FF', '#6934FF', '#E334FF', '#FF34AE', '#FF3459', '#723843', '#3A7238', '#725B38', '#403872']
    const hairColorList = [
        { id: 0, color: '#1c1f21' },
        { id: 2, color: '#312e2c' },
        { id: 4, color: '#4b321f' },
        { id: 6, color: '#6d4c35' },
        { id: 11, color: '#a79369' },
        { id: 14, color: '#d6b97b' },
        { id: 17, color: '#845039' },
        { id: 22, color: '#a02e19' },
        { id: 24, color: '#a2502f' },
        { id: 28, color: '#aaaaaa' },
        { id: 31, color: '#5a3f6b' },
        { id: 33, color: '#ed74e3' },
        { id: 36, color: '#04959e' },
        { id: 40, color: '#217c61' },
        { id: 42, color: '#b6c034' },
        { id: 44, color: '#439d13' },
        { id: 46, color: '#e5b103' },
        { id: 47, color: '#e69102' },
        { id: 49, color: '#fb8057' },
        { id: 51, color: '#d1593c' },
        { id: 53, color: '#ad0903' }
    ]

    const [ clothes, setClothes ] = React.useState([0, 0, 0])
    const clothesList = [
        [ 'Без верха', 'Футболка', 'Майка', 'Кофта' ],
        [ 'Без низа', 'Джинсы', 'Шорты', 'Спортивные' ],
        [ 'Без обуви', 'Кеды', 'Кросовки', 'Шлепки' ]
    ]

    const hairsList = [
        [ // male
            { id: 0, img: IMG_HAIRS_M_0 },
            { id: 2, img: IMG_HAIRS_M_2 },
            { id: 5, img: IMG_HAIRS_M_5 },
            { id: 6, img: IMG_HAIRS_M_6 },
            { id: 8, img: IMG_HAIRS_M_8 },
            { id: 16, img: IMG_HAIRS_M_16 },
            { id: 12, img: IMG_HAIRS_M_12 },
            { id: 13, img: IMG_HAIRS_M_13 },
            { id: 11, img: IMG_HAIRS_M_11 }
        ],
        [ // female
            { id: 0, img: IMG_HAIRS_F_0 },
            { id: 2, img: IMG_HAIRS_F_2 },
            { id: 3, img: IMG_HAIRS_F_3 },
            { id: 5, img: IMG_HAIRS_F_5 },
            { id: 6, img: IMG_HAIRS_F_6 },
            { id: 7, img: IMG_HAIRS_F_7 },
            { id: 8, img: IMG_HAIRS_F_8 },
            { id: 11, img: IMG_HAIRS_F_11 },
            { id: 14, img: IMG_HAIRS_F_14 }
        ]
    ]

    React.useEffect(() =>
    {
        setHair({...hair, head: 0})
    }, [gender])
    React.useEffect(() =>
    {
        ragemp.send('ui::createchar', {
            gender,
            genetic,
            hair,
            appearance,
            face,
            clothes
        })
    }, [genetic, hair, appearance, face, gender, clothes])

    function randomCharacter()
    {
        setGenetic({
            mother: parentsList[0][func.random(0, parentsList[0].length - 1)].id,
            father: parentsList[1][func.random(0, parentsList[1].length - 1)].id,

            similarity: func.randomFloat(0.1, 1.0),
            skinTone: func.randomFloat(0.1, 1.0)
        })
        setHair({
            head: hairsList[gender][func.random(0, hairsList[gender].length - 1)].id,
            beard: func.random(0, 28),
            eyebrow: func.random(0, 33),
            breast: func.random(0, 16),

            head_color: func.random(0, 63),
            beard_color: func.random(0, 63),
            eyebrow_color: func.random(0, 63),
            breast_color: func.random(0, 63)
        })

        setAppearance([
            func.random(0, 31),
            func.random(0, 23),
            func.random(0, 14),
            func.random(0, 11),
            func.random(0, 10),
            func.random(0, 9),
            func.random(0, 63),
            func.random(0, 17),
            func.random(0, 11)
        ])

        let faceTemp = [...face]
        faceTemp.map((item, i) => faceTemp[i] = func.randomFloat(0.1, 1.0))
        setFace(faceTemp)

        setClothes([
            func.random(0, 3),
            func.random(0, 3),
            func.random(0, 3)
        ])
    }
    function createCharacter()
    {
        if(!name[0].length || !name[1].length || age < 18 || age > 60)return

        ragemp.send('ui::user:createChar', {
            name,
            age,
            gender,
            genetic,
            hair,
            appearance,
            face,
            clothes
        })
    }

    function changeClothesCam(id)
    {
        ragemp.send('ui::createchar:changeCam', {
            cam: id
        })
    }

    React.useMemo(() =>
    {
        ragemp.eventCreate('client::createchar', (cmd, data) =>
        {
            switch(cmd)
            {
                case 'toggle':
                {
                    setToggle(data.status)
                    break
                }
                case 'update':
                {
                    setGenetic(data.genetic)
                    setHair(data.hair)
                    setAppearance(data.appearance)
                    setFace(data.face)

                    break
                }
            }
        })
    }, [])

    return (
        <div className="createchar" style={toggle === false ? {display: 'none'} : {}}>
            <div className="createchar-wrap">
                <section className="createchar-title">
                    <h1>Создание</h1>
                    <span>Нового персонажа</span>
                </section>
                <section className="createchar-body">
                    <section className="createchar-body-list">
                        {listNames.map((item, i) =>
                        {
                            return (<div key={i} onClick={() => { setList(i); changeClothesCam(0) }} className={list === i ? "createchar-body-list-select" : ""}>
                                <img src={item.img} />
                                <span>{item.name}</span>
                            </div>)
                        })}
                    </section>
                    <section className="createchar-body-top">
                        <section className="createchar-body-top-wrap" style={list !== 0 ? {display: 'none'} : {}}>
                            <div className="createchar-body-input">
                                <span>Ваше имя</span>
                                <input type="text" placeholder="Введите данные" maxlength="17" value={name[0]} onInput={e => { let nameTemp = [...name]; nameTemp[0] = e.target.value.trim().replace(' ', ''); setName(nameTemp) }} />
                            </div>
                            <div className="createchar-body-input">
                                <span>Ваша фамилия</span>
                                <input type="text" placeholder="Введите данные" maxlength="17" value={name[1]} onInput={e => { let nameTemp = [...name]; nameTemp[1] = e.target.value.trim().replace(' ', ''); setName(nameTemp) }} />
                            </div>
                            <div className="createchar-body-input">
                                <span>Возраст</span>
                                <input type="number" min="18" max="60" maxlength="3" placeholder="Введите данные" value={age} onInput={e => setAge(parseInt(e.target.value))} />
                            </div>
                            <div className="createchar-body-input createchar-body-input-choice">
                                <span>Пол персонажа</span>
                                <section>
                                    <div>
                                        <input className="input-radio" type="radio" id="createchar-radio-gender-male" name="createchar-radio-gender" checked={gender === 0 ? true : false} onClick={() => setGender(0)} />
                                        <label for="createchar-radio-gender-male">Мужской</label>
                                    </div>
                                    <div>
                                        <input className="input-radio" type="radio" id="createchar-radio-gender-female" name="createchar-radio-gender" checked={gender === 1 ? true : false} onClick={e => setGender(1)} />
                                        <label for="createchar-radio-gender-female">Женский</label>
                                    </div>
                                </section>
                            </div>
                        </section>
                        <section className="createchar-body-top-wrap" style={list !== 1 ? {display: 'none'} : {}}>
                            <div className="createchar-body-input createchar-body-input-choice">
                                <span>Настройка родителей</span>
                                <section>
                                    <div>
                                        <input className="input-radio" type="radio" id="createchar-radio-parents-mother" name="createchar-radio-parents" checked={parents === 0 ? true : false} onClick={() => setParents(0)} />
                                        <label for="createchar-radio-parents-mother">Мать</label>
                                    </div>
                                    <div>
                                        <input className="input-radio" type="radio" id="createchar-radio-parents-father" name="createchar-radio-parents" checked={parents === 1 ? true : false} onClick={() => setParents(1)} />
                                        <label for="createchar-radio-parents-father">Отец</label>
                                    </div>
                                </section>
                            </div>
                            <div className="createchar-body-list-choice" style={parents === 1 ? {display: 'none'} : {}}>
                                {parentsList[0].map((item, i) =>
                                {
                                    return <img onClick={() => setGenetic({...genetic, mother: item.id})} key={i} className={genetic.mother === item.id ? "createchar-body-list-choice-select" : ""} src={item.img} />
                                })}
                            </div>
                            <div className="createchar-body-list-choice" style={parents === 0 ? {display: 'none'} : {}}>
                                {parentsList[1].map((item, i) =>
                                {
                                    return <img onClick={() => setGenetic({...genetic, father: item.id})} key={i} className={genetic.father === item.id ? "createchar-body-list-choice-select" : ""} src={item.img} />
                                })}
                            </div>
                            <div className="createchar-body-input createchar-body-input-flex">
                                <span>
                                    Схожесть с родителями
                                    <h1>Мать / Отец</h1>
                                </span>
                                <input type="range" className="input-range" max="1" min="0.1" step="0.1" value={genetic.similarity} onChange={e => setGenetic({...genetic, similarity: parseFloat(e.target.value)})} />
                            </div>
                            <div className="createchar-body-input createchar-body-input-flex">
                                <span>
                                    Цвет кожи
                                    <h1>Светлее / Темнее</h1>
                                </span>
                                <input type="range" className="input-range" max="1" min="0.1" step="0.1" value={genetic.skinTone} onChange={e => setGenetic({...genetic, skinTone: parseFloat(e.target.value)})} />
                            </div>
                        </section>

                        <div className="createchar-body-btn">
                            <button className="btn">Создать персонажа</button>
                            <button>
                                <img src={IMG_RANDOM_BTN} />
                            </button>
                        </div>
                        <section className="createchar-body-top-wrap" style={list !== 2 ? {display: 'none'} : {}}>
                            <div className="createchar-body-input createchar-body-input-choice">
                                <span>На голове</span>
                            </div>
                            <div className="createchar-body-list-choice">
                                {hairsList[gender].map((item, i) =>
                                {
                                    return <img onClick={() => setHair({...hair, head: item.id})} key={i} className={hair.head === item.id ? "createchar-body-list-choice-select" : ""} src={item.img} />
                                })}
                            </div>
                            <div className="createchar-body-input createchar-body-input-flex">
                                <span>
                                    Борода
                                    <h1>Волосы</h1>
                                </span>
                                <input type="range" className="input-range" max="28" min="0" step="1" value={hair.beard} onChange={e => setHair({...hair, beard: parseInt(e.target.value)})} />
                            </div>
                            <div className="createchar-body-input createchar-body-input-flex">
                                <span>
                                    Брови
                                    <h1>Волосы</h1>
                                </span>
                                <input type="range" className="input-range" max="33" min="0" step="1" value={hair.eyebrow} onChange={e => setHair({...hair, eyebrow: parseInt(e.target.value)})} />
                            </div>
                            <div className="createchar-body-input createchar-body-input-flex">
                                <span>
                                    На теле
                                    <h1>Волосы</h1>
                                </span>
                                <input type="range" className="input-range" max="16" min="0" step="1" value={hair.breast} onChange={e => setHair({...hair, breast: parseInt(e.target.value)})} />
                            </div>
                        </section>
                        <section className="createchar-body-top-wrap" style={list !== 3 ? {display: 'none'} : {}}>
                            <div className="createchar-body-input createchar-body-input-choice createchar-body-input-color">
                                <span>На голове</span>
                                <section>
                                    {hairColorList.map((item, i) =>
                                    {
                                        return (<div onClick={() => setHair({...hair, head_color: item.id})} className={hair.head_color === item.id && "createchar-body-input-color-sel"} style={{"background-color": item.color}}></div>)
                                    })}
                                </section>
                            </div>
                            <div className="createchar-body-input createchar-body-input-choice createchar-body-input-color">
                                <span>Борода</span>
                                <section>
                                    {hairColorList.map((item, i) =>
                                    {
                                        return (<div onClick={() => setHair({...hair, beard_color: item.id})} className={hair.beard_color === item.id && "createchar-body-input-color-sel"} style={{"background-color": item.color}}></div>)
                                    })}
                                </section>
                            </div>
                            <div className="createchar-body-input createchar-body-input-choice createchar-body-input-color">
                                <span>Брови</span>
                                <section>
                                    {hairColorList.map((item, i) =>
                                    {
                                        return (<div onClick={() => setHair({...hair, eyebrow_color: item.id})} className={hair.eyebrow_color === item.id && "createchar-body-input-color-sel"} style={{"background-color": item.color}}></div>)
                                    })}
                                </section>
                            </div>
                            <div className="createchar-body-input createchar-body-input-choice createchar-body-input-color">
                                <span>На теле</span>
                                <section>
                                    {hairColorList.map((item, i) =>
                                    {
                                        return (<div onClick={() => setHair({...hair, breast_color: item.id})} className={hair.breast_color === item.id && "createchar-body-input-color-sel"} style={{"background-color": item.color}}></div>)
                                    })}
                                </section>
                            </div>
                        </section>
                        <section className="createchar-body-top-wrap" style={list !== 4 ? {display: 'none'} : {}}>
                            <div className="createchar-body-input createchar-body-input-flex">
                                <span>
                                    Цвет глаз
                                    <h1>Внешность</h1>
                                </span>
                                <input type="range" className="input-range" max="31" min="0" step="1" value={appearance[0]} onChange={e => { let appearanceTemp = [...appearance]; appearanceTemp[0] = parseInt(e.target.value); setAppearance(appearanceTemp) }} />
                            </div>
                            <div className="createchar-body-input createchar-body-input-flex">
                                <span>
                                    Пятна на теле
                                    <h1>Внешность</h1>
                                </span>
                                <input type="range" className="input-range" max="23" min="0" step="1" value={appearance[1]} onChange={e => { let appearanceTemp = [...appearance]; appearanceTemp[1] = parseInt(e.target.value); setAppearance(appearanceTemp) }} />
                            </div>
                            <div className="createchar-body-input createchar-body-input-flex">
                                <span>
                                    Старение
                                    <h1>Внешность</h1>
                                </span>
                                <input type="range" className="input-range" max="14" min="0" step="1" value={appearance[2]} onChange={e => { let appearanceTemp = [...appearance]; appearanceTemp[2] = parseInt(e.target.value); setAppearance(appearanceTemp) }} />
                            </div>
                            <div className="createchar-body-input createchar-body-input-flex">
                                <span>
                                    Цвет лица
                                    <h1>Внешность</h1>
                                </span>
                                <input type="range" className="input-range" max="11" min="0" step="1" value={appearance[3]} onChange={e => { let appearanceTemp = [...appearance]; appearanceTemp[3] = parseInt(e.target.value); setAppearance(appearanceTemp) }} />
                            </div>
                            <div className="createchar-body-input createchar-body-input-flex">
                                <span>
                                    Повреждения кожи
                                    <h1>Внешность</h1>
                                </span>
                                <input type="range" className="input-range" max="10" min="0" step="1" value={appearance[4]} onChange={e => { let appearanceTemp = [...appearance]; appearanceTemp[4] = parseInt(e.target.value); setAppearance(appearanceTemp) }} />
                            </div>
                            <div className="createchar-body-input createchar-body-input-flex">
                                <span>
                                    Губная помада
                                    <h1>Внешность</h1>
                                </span>
                                <input type="range" className="input-range" max="9" min="0" step="1" value={appearance[5]} onChange={e => { let appearanceTemp = [...appearance]; appearanceTemp[5] = parseInt(e.target.value); setAppearance(appearanceTemp) }} />
                            </div>
                            <div className="createchar-body-input createchar-body-input-flex">
                                <span>
                                    Цвет помады
                                    <h1>Внешность</h1>
                                </span>
                                <input type="range" className="input-range" max="31" min="0" step="1" value={appearance[6]} onChange={e => { let appearanceTemp = [...appearance]; appearanceTemp[6] = parseInt(e.target.value); setAppearance(appearanceTemp) }} />
                            </div>
                            <div className="createchar-body-input createchar-body-input-flex">
                                <span>
                                    Родинки
                                    <h1>Внешность</h1>
                                </span>
                                <input type="range" className="input-range" max="17" min="0" step="1" value={appearance[7]} onChange={e => { let appearanceTemp = [...appearance]; appearanceTemp[7] = parseInt(e.target.value); setAppearance(appearanceTemp) }} />
                            </div>
                            <div className="createchar-body-input createchar-body-input-flex">
                                <span>
                                    Пятна на теле
                                    <h1>Внешность</h1>
                                </span>
                                <input type="range" className="input-range" max="11" min="0" step="1" value={appearance[8]} onChange={e => { let appearanceTemp = [...appearance]; appearanceTemp[8] = parseInt(e.target.value); setAppearance(appearanceTemp) }} />
                            </div>
                        </section>
                        <section className="createchar-body-top-wrap" style={list !== 5 ? {display: 'none'} : {}}>
                            {face.map((item, i) =>
                            {
                                return (<div key={i} className="createchar-body-input">
                                    <span>{faceList[i]}</span>
                                    <input type="range" className="input-range" max="1.0" min="0.1" step="0.1" value={face[i]} onChange={e => { let faceTemp = [...face]; faceTemp[i] = parseFloat(e.target.value); setFace(faceTemp) }} />
                                </div>)
                            })}
                        </section>
                        <section className="createchar-body-top-wrap" style={list !== 6 ? {display: 'none'} : {}}>
                            {clothes.map((item, i) =>
                            {
                                return (<div key={i} className="createchar-body-input createchar-body-input-choice">
                                    <span>{i === 0 ? "Верх" : i === 1 ? "Низ" : "Обувь"}</span>
                                    <section>
                                        <Choiceinput data={{select: clothes[i], params: clothesList[i], onChange: value => { let clothesTemp = [...clothes]; clothesTemp[i] = value; setClothes(clothesTemp); changeClothesCam(i); } }} />
                                    </section>
                                </div>)
                            })}
                        </section>

                        <div className="createchar-body-btn">
                            <button className="btn" onClick={createCharacter}>Создать персонажа</button>
                            <button onClick={randomCharacter}>
                                <img src={IMG_RANDOM_BTN} />
                            </button>
                        </div>
                    </section>
                </section>
            </div>
        </div>
    )
}
