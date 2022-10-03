import './css.scss'

import React, { useState } from 'react'

import $ from 'jquery'

const navItems = [
  {
    name: 'ОРУЖИЕ',
    id: 0
  },
  {
    name: 'ПАТРОНЫ',
    id: 1
  },
  {
    name: 'ОДЕЖДА',
    id: 2
  },
  {
    name: 'ОСТАЛЬНОЕ',
    id: 3
  },
  {
    name: 'ОСТАЛЬНОЕ',
    id: 4
  }
]


function Orgstockmenu() {
  const [toggle, setToggle] = useState(false)
  const [navSelect, setNavSelect] = React.useState(0)
  

  return (
    <div className="orgStockMenu" style={!toggle ? { display: 'none' } : {}}>
      <div className="orgStockMenuWrapper">
        <header className='header-deg'>
          <h1>
            Склад
            <span>Организации</span>
          </h1>

        </header>
        <section className="orgStockMenu-nav">
          {
            navItems.map((item, index) => (
              <div className={`orgStockMenu-nav-item ${navSelect === item.id ? "orgStockMenu-nav-item-active" : null}`} onClick={() => setNavSelect(item.id)}>
                {item.name}
              </div>
            ))
          }

        </section>
        <section className="orgStockMenu-info">
          <div className="info-top">
            <div className="info-fraction-name">
              <h1>Los Santos Police Department</h1>
              <p>Заполненность склада</p>
            </div>
            <div className="info-fraction-weight">
              <span><p>8<br /> </p>  / 25 кг</span>
              <svg width="27" height="31" viewBox="0 0 27 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.15" d="M19.9455 10.2425L21.4294 7.50636C22.2908 5.91821 22.2319 4.00935 21.2742 2.47389C20.3164 0.938356 18.5996 0 16.7477 0H9.48144C7.62956 0 5.91256 0.938356 4.95487 2.47382C3.99719 4.00929 3.93831 5.91815 4.79962 7.5063L6.28356 10.2425C2.51787 12.4774 0 16.5009 0 21.0836C0 24.1874 1.16831 27.1759 3.28975 29.4984C4.16138 30.4526 5.41606 30.9999 6.73212 30.9999H19.4971C20.8132 30.9999 22.0678 30.4527 22.9394 29.4984C25.0609 27.1758 26.2292 24.1873 26.2292 21.0836C26.2291 16.501 23.7112 12.4775 19.9455 10.2425ZM17.2346 5.95648L15.7778 8.64252C14.9176 8.4699 14.0268 8.3789 13.1145 8.3789C12.2023 8.3789 11.3114 8.46984 10.4512 8.64252L8.99444 5.95648C8.8065 5.60991 8.81931 5.19329 9.02831 4.85816C9.23731 4.52309 9.612 4.31826 10.0162 4.31826H16.2129C16.6171 4.31826 16.9918 4.52303 17.2008 4.85816C17.4098 5.19329 17.4226 5.60985 17.2346 5.95648Z" fill="white" />
              </svg>
            </div>
          </div>
          <div className="info-progressBar">

            <span id="greenBar" style={{ width: `${25 / 25 * 100}%` }}></span>
          </div>
        </section>
        <section className="orgMenuInventory">
          <div className="list-slots">
            <div className="slots">
             

            </div>
          </div>
        </section>
      </div>
      <div className="orgStockMenuItemPreview">

        
      </div>
    </div>
  )
}

export default Orgstockmenu