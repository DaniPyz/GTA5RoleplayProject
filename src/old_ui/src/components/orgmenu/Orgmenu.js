/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable default-case */
import './css.scss'

import React, { useState } from 'react'

import $ from 'jquery'
// Images
import IMG_ANTENA from './images/antena.png'
import IMG_ANTENA_UNCUT from './images/antanaUncut.png'
import IMG_ARROW_BACK from './images/arrow_back.png'
import IMG_BAGS from './images/bags.png'
import IMG_BOXES from './images/boxes.png'
import IMG_BOXES_BG from './images/boxesBg.png'
import IMG_MATTE from './images/matte.png'
import IMG_ONE_BAG from './images/oneBag.png'
import IMG_SEARCH from './images/search.png'
import IMG_SORT_ARROW from './images/sort_arrow.png'
import ragemp from '../../_modules/ragemp'

const fractionLevelsNames = [
  ['Рядовой', 'Интерн', 'Кадет', 'Помощник', 'SWAT', 'Авиация', 'Криминалист', 'Детектив', 'Зам Отдела', 'Глава Отдела', 'Зам Глав Шерифа', 'Главный Шерифа'],
  ['Студент', 'Интерн', 'Помощник', 'Врач', 'Врач отоларинголог', 'Врач педиатор', 'Фельдшер', 'Лаборант', 'Зам Отдела Помощи', 'Глава Отдела Помощи', 'Зам Глав Врача', 'Главный Врач'],
]

export default function Orgmenu() {

  const [toggle, setToggle] = useState(false)
  const [menu, setMenu] = React.useState('main')
  const [fractionId, setFractionId] = React.useState(0)
  const [Balance, setBalance] = useState('999 . 999')
  const [stock, setStock] = useState('323 , 999')
  const [walkieTalkieTime, setWalkieTalkieTime] = React.useState({
    hour: '08',
    minute: '34'

  })
  const [walkieTalkieError, setWalkieTalkieError] = React.useState({
    hour: '08',
    minute: '34'
  })

  const [fractionData, setFractionData] = React.useState([

    {
      id: 1, name: 'Ems', leader: 'Francia Andreas', leaderId: 12, maxRank: 12, users: [
        { id: 10, name: 'Romario Richardson', rank: 4, status: 1 },
        { id: 13, name: 'Dapy Rogers', rank: 12, status: 0 },

      ]

    }
  ])
  const [dialog, setDialog] = React.useState({
    status: false,
    type: 'normal',
    title: 'Снятие администратора',
    text: 'Вы действительно хотите снять Хелпера [1 лвл] Nezuko Kamado ?',
    btn: ['Да', 'Нет'],
    server: false
  })


  function openMenu(id) {
    ragemp.send('ui::fraction:openMenu', {
      id
    })
  }

  // Кнопки увольнения, повышения, и понижения
  function employeePromotion(id) {
    ragemp.send('ui::fraction:employeePromotion', {
      id
    })
  }
  function employeeDemontion(id) {
    ragemp.send('ui::fraction:employeeDemontion', {
      id
    })
  }
  function employeeDismissal(id) {
    ragemp.send('ui::fraction:employeeDismissal', {
      id
    })
  }
  function walkieTalkieChangetime(id, time) {
    ragemp.send('ui::fraction:walkieTalkieChangetime', {
      id, time
    })
  }
  function walkieTalkieSubmit(message, time) {
    ragemp.send('ui::fraction:walkieTalkieSubmit', {
      message, time
    })
  }


  React.useMemo(() => {
    ragemp.eventCreate('client::fraction', (cmd, data) => {
      switch (cmd) {
        case 'toggle':
          {
            setToggle(data.status)
            break
          }
        case 'setFractionData':
          {
            setFractionData(data)
            break
          }
        case 'setBalance':
          {
            setBalance(data)
            break
          }
        case 'setStock':
          {
            setStock(data)
            break
          }
        case 'walkieTalkieError':
          {
            setWalkieTalkieError(data.error)
            break
          }
        case 'dialog':
          {
            setDialog(data)
            break
          }

        case 'openMenu':
          {
            // setAdminsSelect(-1)


            switch (data.menu) {
              case 'staff':
                {
                  setFractionData(data.data)
                  setFractionId(0)
                  break
                }
              case 'balance':
                {
                  let newData = data.data.toLocaleString('en-US')
                  newData = newData.replace(/,/g, " . ");
                  setBalance(newData)

                  break
                }
              case 'stock':
                {
                  let newData = data.data.toLocaleString('en-US')
                  newData = newData.replace(/,/g, " , ");
                  setStock(newData)

                  break
                }
              case 'walkie-tolkie':
                {

                  setWalkieTalkieTime(data.data)
                  break
                }

            }

            setMenu(data.menu)
            break
          }
      }
    })

  }, [])




  //   onClick = {() => openMenu('cmd')
  // } className = { menu === 'cmd' && 'admin-menu-items-select'}

  function adminSearch(type, text) {
    switch (type) {
      case 'staff':
        {
          fractionData[fractionId].users.map((item, i) => {
            if (item.name.indexOf(text) !== -1) $(`#orgmenu-staffSection_item-${i}`).show()
            else $(`#orgmenu-staffSection_item-${i}`).hide()
          })
          break
        }
    }
  }
  // const increaseTime = (id) => {

  //   let newTime = walkieTalkieTime
  //   console.log(newTime)
  //   newTime.hoursTen = ++newTime.hoursTen 


  //   setWalkieTalkieTime(newTime)

  // }
  // const decreaseTime = (id) => {
  //   let newTime =  walkieTalkieTime
  // console.log(newTime)

  //   newTime[id] = newTime[id] - 1
  //   setWalkieTalkieTime(newTime)



  // }

  return (
    <div className="orgmenu" style={!toggle ? { display: 'none' } : {}}>
      <div className="orgmenu_wrapper">
        {/* Dialog & notification */}
        {/* <div className="orgmenu-dialog" style={!dialog.status ? { display: 'none' } : {}}>
          <div className="orgmenu-dialog-wrap">
            <h1>{dialog.title}</h1>
            <h2>{dialog.text}</h2>
            <input onKeyDown={e => dialogEnter(0, e)} className="input" style={dialog.type !== 'input' ? { display: 'none' } : {}} type="text" />
            <div className="orgmenu-dialog-btn">
              {dialog.btn.map((item, i) => {
                return (<button onClick={() => dialogEnter(i)} className={`btn ${i === dialog.btn.length - 1 && 'orgmenu-dialog-btn-cancel'}`} key={i}>{item}</button>)
              })}
            </div>
          </div>
        </div> */}
        {/*         
        <div className="orgmenu-notf">
          {notf.map((item, i) => {
            return (<section key={i} className={`orgmenu-notf-type-${item.type}`}>{item.text}</section>)
          })}
        </div> */}






        <div className="orgmenu-lefSide header-deg">
          <h1>
            Меню
            <span>Организации</span>
          </h1>
        </div>
        <div className="orgmenu_mainsection">
          <div className="orgmenu-rightSide" style={menu !== 'main' ? { display: 'none' } : {}}>
            <div className="rightSide-item" >
              <h1>
                Состав
                Фракции
              </h1>
              <p>В этом меню вы
                можете просмотреть
                участников организации,
                а так же управлять ими.</p>
              <span onClick={() => openMenu('staff')}>Открыть</span>
              <img src={IMG_MATTE} alt="matte" style={{ position: 'absolute', right: '0', bottom: '0', width: '249px', height: '249px' }} />
              <div className="gradient" style={{ background: "#FFCE50 " }} />
            </div>
            <div className="rightSide-item" >
              <h1>
                Банк
                Фракции
              </h1>
              <p>В этом меню вы
                можете просмотреть
                участников организации,
                а так же управлять ими.</p>
              <span onClick={() => openMenu('balance')}>Открыть</span>
              <img src={IMG_BAGS} alt="matte" style={{ position: 'absolute', right: '0', bottom: '0', width: '280px', height: '320.27px' }} />
              <div className="gradient" style={{ background: "#9250FF " }} />
            </div>
            <div className="rightSide-item">
              <h1>
                Государственная
                Волна
              </h1>
              <p>В этом меню вы
                можете просмотреть
                участников организации,
                а так же управлять ими.</p>
              <span onClick={() => openMenu('walkie-tolkie')}>Открыть</span>
              <img src={IMG_ANTENA} alt="matte" style={{ position: 'absolute', right: '0', bottom: '10px', width: '225px', height: '300px' }} />
              <div className="gradient" style={{ background: "#5096FF " }} />
            </div>
            <div className="rightSide-item">
              <h1>
                Склад
                Фракции
              </h1>
              <p>В этом меню вы
                можете просмотреть
                участников организации,
                а так же управлять ими.</p>
              <span onClick={() => openMenu('stock') } >Открыть</span>
              <img src={IMG_BOXES} alt="matte" style={{ position: 'absolute', right: '0', bottom: '0', width: '219px', height: '249px' }} />
              <div className="gradient" style={{ background: "#FF50ED " }} />
            </div>

          </div>
          <section className="orgmenu-staffSection" style={menu !== 'staff' ? { display: 'none' } : {}}>
            <section className='orgmenu-staffSection_search'>

              <div className="orgmenu-staffSection_search-input-block"  >

                <div className="input-item">
                  <input onChange={e => adminSearch('staff', e.target.value)} type="text" placeholder="Поиск по нику" />
                  <img alt='search' src={IMG_SEARCH} />
                </div>
                <div className="back_to_menu-btn" onClick={() => openMenu('main')}>
                  Назад в меню
                </div>
                <div className="arrow_back-btn" onClick={() => openMenu('main')}>
                  <img alt='arrow_back' src={IMG_ARROW_BACK} />

                </div>
              </div>
              <div className="orgmenu-staffSection_search-sort-block">
                <div className="name-item">
                  Имя
                  <img alt='arrow_back' src={IMG_SORT_ARROW} />
                </div>
                <div className="rank-item">
                  Должность
                  <img alt='arrow_back' src={IMG_SORT_ARROW} />

                </div>
                <div className="status-item">
                  Статус
                  <img alt='arrow_back' src={IMG_SORT_ARROW} />
                </div>
                <div className="interactivity-menu">
                  Взаимодействие с игроком
                  <img alt='arrow_back' src={IMG_SORT_ARROW} />
                </div>
              </div>

            </section>

            {
              fractionData[fractionId].users.map((user, index) => {
                return (
                  <div key={index} className="orgmenu-staffSection_item" id={`orgmenu-staffSection_item-${index}`}>
                    <h1 className='orgmenu-staffSection_item-name'>{user.name}</h1>
                    <h1 className='orgmenu-staffSection_item-rank'>{fractionLevelsNames[fractionData[fractionId].id - 1][--user.rank]}</h1>
                    <h1 className={`orgmenu-staffSection_item-status ${user.status === 0 ? 'orgmenu-staffSection_item-status-offline' : 'orgmenu-staffSection_item-status-online'}`} style={{ color: user.status === 0 ? '#CC051B' : "#B2EF30" }}>{user.status ? "В штате" : "Не в штате"}</h1>
                    <div className="orgmenu-staffSection_item-btns">
                      <button onClick={() => {
                      
                        employeePromotion(user.id)
                      }}>Повысить</button>
                      <button onClick={() => employeeDemontion(user.id)}>Понизить</button>
                      <button onClick={() => employeeDismissal(user.id)}>Уволить</button>
                    </div>
                  </div>
                )
              })
            }



          </section>
          <section className="orgmenu-balanceSection " style={menu !== 'balance' ? { display: 'none' } : {}}>


            <div className="orgmenu-staffSection_search-input-block orgmenu-balanceSection-btn"  >


              <div className="back_to_menu-btn" onClick={() => openMenu('main')}>
                Назад в меню
              </div>
              <div className="arrow_back-btn" onClick={() => openMenu('main')}>
                <img alt='arrow_back' src={IMG_ARROW_BACK} />

              </div>
            </div>

            <section className="orgmenu-balanceSection-main">
              <div className="orgmenu-balanceSection-info">
                <h1 className='title'>Текущий баланс</h1>
                <span className="balance">
                  <p className='balanceText'>$ {Balance}</p>
                  <p className="shadow">$ {Balance}</p>
                </span>
                <span className='infoBlock'>
                  <h2>Что это такое?</h2>
                  <p>Это - те деньги, которым я не придумал
                    ещё описание, пускай придумает умный человек,
                    а то у меня проблемы с восприятием реальности,
                    гы.</p>
                </span>
              </div>

              <div className="gradient" style={{ background: "#B230EF " }} />
              <img className='main-absoluteBag' src={IMG_ONE_BAG} alt="bag" />
              <img className='main-blured-absoluteBag' src={IMG_ONE_BAG} alt="bag" />

            </section>



            <img className='absoluteBag' src={IMG_ONE_BAG} alt="bag" />
          </section>
          <section className="orgmenu-walkie-tolkie" style={menu !== 'walkie-tolkie' ? { display: 'none' } : {}}>
            <div className="orgmenu-staffSection_search-input-block orgmenu-walkie-tolkie-btn"  >


              <div className="back_to_menu-btn" onClick={() => openMenu('main')}>
                Назад в меню
              </div>
              <div className="arrow_back-btn" onClick={() => openMenu('main')}>
                <img alt='arrow_back' src={IMG_ARROW_BACK} />

              </div>
            </div>
            <section className="orgmenu-walkie-tolkie-main">
              <div className="orgmenu-walkie-tolkie-main-wraper">
                <h1 className="orgmenu-walkie-tolkie-main-title">Государственная волна</h1>
                <textarea placeholder="Укажите текст государственной волны" cols="30" rows="10" className="orgmenu-walkie-tolkie-main-textarea" id="orgmenu-walkie-tolkie-main-textarea" />
                <div className="orgmenu-walkie-tolkie-main-timer-block">
                  <div className="block-text">
                    <h2>Время отправки новости</h2>
                    <p>Описание этой штуки, зачем нужно
                      время и тому подобное, используй
                      с умом и никогда не изменяй
                      своим принципам.</p>
                  </div>
                  <div className="block-timer">
                    <div className="timer-item">
                      <span>{walkieTalkieTime.hour.charAt(0)}</span>
                      <button style={{ background: 'rgba(178, 239, 48, 0.07)', border: ' 1px solid rgb(178, 239, 48, 0.5)' }} onClick={() => walkieTalkieChangetime(0, walkieTalkieTime)}>+</button>
                    </div>
                    <div className="timer-item" style={{ marginRight: '0px' }}>
                      <span >{walkieTalkieTime.hour.charAt(1)}</span>
                      <button style={{ background: 'rgba(239, 48, 48, 0.15)', border: '1px solid rgb(239, 48, 48, 0.5)' }} onClick={() => walkieTalkieChangetime(1, walkieTalkieTime)}>-</button>
                    </div>
                    <span className="timer-spiter">:</span>
                    <div className="timer-item">
                      <span>{walkieTalkieTime.minute.charAt(0)}</span>
                      <button style={{ background: 'rgba(178, 239, 48, 0.07)', border: ' 1px solid rgb(178, 239, 48, 0.5)' }} onClick={() => walkieTalkieChangetime(2, walkieTalkieTime)}>+</button>
                    </div>
                    <div className="timer-item">
                      <span>{walkieTalkieTime.minute.charAt(1)}</span>
                      <button style={{ background: 'rgba(239, 48, 48, 0.15)', border: '1px solid rgb(239, 48, 48, 0.5)' }} onClick={() => walkieTalkieChangetime(3, walkieTalkieTime)}>-</button>
                    </div>
                  </div>
                </div>
                <div className="orgmenu-walkie-tolkie-main-error">
                  <p>Внимание, вы не можете отправить новость
                    в этот промежуток времени, ближайшее доступное, <br />
                    <span>{walkieTalkieError.hour}:{walkieTalkieError.minute}</span>.</p>
                </div>
                <span className="orgmenu-walkie-tolkie-main-btn" onClick={() => {

                  walkieTalkieSubmit($(`#orgmenu-walkie-tolkie-main-textarea`).val(), walkieTalkieTime)
                }}>
                  Отправить
                </span>
              </div>



              <div className="gradient" style={{ background: "#B230EF " }} />

              <img className='absoluteAntena' src={IMG_ANTENA_UNCUT} alt="antena" />
              <img className='absoluteAntenaBig' src={IMG_ANTENA_UNCUT} alt="antena" />
            </section>


          </section>
          <section className="orgmenu-stockSection orgmenu-balanceSection" style={menu !== 'stock' ? { display: 'none' } : {}}>


            <div className="orgmenu-staffSection_search-input-block orgmenu-balanceSection-btn"  >


              <div className="back_to_menu-btn" onClick={() => openMenu('main')}>
                Назад в меню
              </div>
              <div className="arrow_back-btn" onClick={() => openMenu('main')}>
                <img alt='arrow_back' src={IMG_ARROW_BACK} />

              </div>
            </div>

            <section className="orgmenu-balanceSection-main">
              <div className="orgmenu-balanceSection-info">
                <h1 className='title'>Текущее кол-во материалов</h1>
                <span className="balance">
                  <p className='balanceText'>{stock}</p>
                  <p className="shadow">{stock}</p>
                </span>
                <span className='infoBlock'>
                  <h2>Что это такое?</h2>
                  <p>Это - те деньги, которым я не придумал
                    ещё описание, пускай придумает умный человек,
                    а то у меня проблемы с восприятием реальности,
                    гы.</p>
                </span>
              </div>

              <div className="gradient" style={{ background: "#B230EF " }} />
              <img className='stockSection-absoluteBag' src={IMG_BOXES_BG} alt="bag1" />
              <img className='stockSection-blured-absoluteBag' src={IMG_BOXES_BG} alt="bag2" />

            </section>



          </section>
        </div>


      </div>
    </div>
  )
}

