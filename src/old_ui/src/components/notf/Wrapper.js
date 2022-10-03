import './css.css'

import React, { useEffect, useState } from 'react'

import $ from 'jquery'
import IMG_BANKCASH from './images/bankcash.png'
import IMG_CASH from './images/cash.png'
import IMG_ERROR from './images/error.png'
import IMG_SUCCESS from './images/success.png'
import IMG_WARNING from './images/warning.png'

export default function Wrapper({ item, i }) {

  
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    setValue(100);
  }, []);



 
  return (
    <section
      key={i}
      className={`notf-${item.type}`}
      style={{ background: item.type === 'success' ? "linear-gradient(1.28deg, rgba(178, 239, 48, 0.75) -48.27%, rgba(38, 56, 0, 0.35) 79.69%)" : item.type === 'error' ? "linear-gradient(1.29deg, #ED4343 -49.61%, rgba(95, 0, 0, 0.25) 77.07%)" : item.type === 'donate' || item.type === "cash" ? "linear-gradient(1.28deg, rgba(253, 155, 8, 0.75) -48.27%, rgba(87, 52, 0, 0.35) 79.69%)" : "linear-gradient(1.29deg, #FF6B00 -49.61%, rgba(90, 38, 0, 0.25) 77.07%)" }}
    >
      <img alt='s' src={require(`./images/${item.type}.svg`)} style={item.type === 'donate' || item.type === "cash" ? { boxShadow: '0 0 0 7px rgba(253, 155, 8, 0.3), 0 0 0 14px rgba(253, 155, 8, 0.2)', backgroundColor: '#FD9B08', } : item.type === 'success' ? { boxShadow: '0 0 0 7px rgba(162, 230, 46, 0.3), 0 0 0 14px rgba(162, 230, 46, 0.3)', backgroundColor: 'rgba(162, 230, 46, 0.1)' } : item.type === 'error' ? { boxShadow: '0 0 0 6px rgba(237, 67, 67, 0.3), 0 0 0 12px rgba(237, 67, 67, 0.3)', backgroundColor: 'rgba(237, 67, 67, 100)' } : { boxShadow: '0 0 0 6px rgba(229, 121, 23, 0.5), 0 0 0 12px rgba(229, 121, 23, 0.5)', backgroundColor: 'rgba(229, 121, 23, 0.5)' }} />
      <div className="notf-wrapper">
        <h1 style={{ color: item.type === 'success' ? "#B2EF30" : item.type === 'error' ? "#ED4343" : item.type === 'donate' || item.type === "cash" ? "#FD9B08" : "#FF6B00" }} >{item.type === 'success' ? "Успешно" : item.type === 'error' ? "Ошибка" : item.type === 'donate' || item.type === "cash" ? "Денежная транзакция" : "Предупреждение"}</h1>
        <span>{item.text}</span>

      </div>

      <div className={`progressBar-${i} progressBar`} style={{ width: `${value }%`, transition: `${item.time}ms linear`, background: item.type === 'success' ? '#B2EF30' : item.type === 'error' ? '#ED4343' : item.type === 'donate' ? '#FD9B08' : '#E57917' }} ></div>
    </section>
  )
}

