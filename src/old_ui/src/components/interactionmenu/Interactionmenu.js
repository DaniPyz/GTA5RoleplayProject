/* eslint-disable jsx-a11y/anchor-is-valid */
import './css.scss'

import BORDER_SVG from './border.svg'
import React from 'react'
import SVG from './sprite.svg'
import ragemp from '../../_modules/ragemp'

const wheellData = [
  { id: 0, name: 'Основное', buttons: ["Дать денег", "Поздароваться", "Фракционное", "Имущество", "Не придумал"] },
  { id: 1, name: 'Дать денег', buttons: null },
  { id: 2, name: 'Поздароваться', buttons: null },
  { id: 3, name: 'Фракционное', buttons: ["Пригласить", "Дать доступ", "Реанимировать", "Арестовать", "Связать"] },
  { id: 4, name: 'Имущество', buttons: ["Продать", "Передать", "Закрыть", "Открыть", "Гараж"] },
  { id: 5, name: 'Не придумал', buttons: null },
]
export default function Interactionmenu() {
  const [toggle, setToggle] = React.useState(false)
  const [activeMenu, setActiveMenu] = React.useState(0);



  const makeActiveMenu = (index) => {
    setActiveMenu(index)
  }

  function openMenu(id) {
    ragemp.send('ui::interactionmenu:openMenu', {
      id
    })
  }
  React.useMemo(() => {
    ragemp.eventCreate('client::interactionmenu', (cmd, data) => {
      // eslint-disable-next-line default-case
      switch (cmd) {
        case 'toggle':
          {
            setToggle(data.status)
            break
          }



        // case 'openMenu':
        //   {



        //     switch (data.menu) {
        //       case 'staff':
        //         {
        //           setFractionData(data.data)
        //           setFractionId(0)
        //           break
        //         }


        //     }

        //     setMenu(data.menu)
        //     break
        //   }
      }
    })

  }, [])
  return (
    <>
      <div className="Interactionmenu" style={!toggle ? { display: 'none' } : {}}>
        <div className="Interactionmenu-wrapper">
          <div className="blimp" />
          <div className="wrapper">


            <div className="header-deg">
              <h1>
                Меню
                <span>Взаимодействия</span>
              </h1>
            </div>
            <div className="menuWheel">
              <div className="border_absolute">
                <img src={BORDER_SVG} alt="" />

              </div>

              <ul className='menuWheel-ul'>
                {

                  wheellData[activeMenu].buttons.map((item, index) => (
                    <li className={`menuWheel-${index}`} onClick={(ev) => wheellData[index + 1].buttons === null ? {} : makeActiveMenu(index + 1)}>
                      <a>
                        <section>
                          <img src={SVG} alt='persone' />
                          <h1>{item}</h1>
                        </section>

                      </a>
                    </li>
                  )
                  )
                }

              </ul>


              <div className="menuWheel-absolute">

                {
                  activeMenu === 0 ? (
                    <button>
                      <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.66016 2L8.66016 9M15.6602 16L8.66016 9M8.66016 9L15.6602 2L1.66016 16" stroke="#9F2D2D" stroke-width="3" />
                      </svg>

                    </button>
                  ) : (
                    <button onClick={() => { setActiveMenu(0) }}>
                      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 1H19V14.8182H2M2 14.8182L7.36842 9.63636M2 14.8182L7.36842 20" stroke="#9F2D2D" stroke-width="2" />
                      </svg>


                    </button>
                  )
                }

              </div>


            </div>
          </div>
        </div>
      </div>
    </>
  )
}
function setBalance(newData) {
  throw new Error('Function not implemented.')
}

