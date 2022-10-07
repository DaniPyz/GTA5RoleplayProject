import React, { FC } from 'react'

import s from './ItemInfo.module.scss';

type Props = {
  img: string,
  name: string,
  weight: number
}
const ItemInfo: FC<Props> = ({ img, name, weight }: Props) => {


  return (
    <div className={s.ItemInfo}>
      <div className={s.header}>
        <section>
          <img src={require(`./img/${img}`)} alt='' />
        </section>
        <div>
          <h1>{name}</h1>
          <p>Вес <span>{weight} кг.</span></p>
        </div>
      </div>
      <div className={s.info}>
        <h1>Информация</h1>

        <p>Износ <span>{weight} кг.</span></p>
        <p>Объем магазина <span>{30} патр.</span></p>
        <p>Урон <span>{150} HP.</span></p>
        <p>Дальность <span>{1500} м.</span></p>
      </div>
      <div className={s.footer}>
        <h1>Взаимодействие</h1>

        <button>Взять</button>
        <button>Выбросить</button>
        <button>Разделить</button>
      </div>
    </div>
  )
};

export default ItemInfo;