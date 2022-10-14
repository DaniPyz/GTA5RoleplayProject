import React, { FC, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd';

import cls from 'classnames';
import s from './ItemCell.module.scss';
import { store } from 'store';
import { useAppDispatch } from 'hooks';

interface Props {
  index: number,
  selected?: number | null,
  img?: string,
  count?: number,
  change?: (index: number) => void;
  selectedFilter: number
}
const ItemCell = ({ index, selected, img, change, selectedFilter }: Props) => {
  const dispatch = useAppDispatch();


  const [{ isOver }, drop] = useDrop({
    accept: "image",
    drop: (item: any) => {
      if (change && item.id === item.idOfSelected) {
        change(index)
      }

      dispatch({ type: 'WAREHOUSE_CHANGE', data: { index: item.id, indexNew: index, selectedFilter: selectedFilter } });
    },
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver(),
    }),
  })
  const [{ isDragging }, drag] = useDrag({
    type: "image",
    item: { id: index, idOfSelected: selected },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging()
      // data[0].isDragging: !!monitor.isDragging(),
    }),
  })




  return (
    <>


      {
        img ? (
          <div ref={drag}
            className={cls({ [s.ItemCell]: true, [s.ItemCell_exist]: img && index !== selected, [s.ItemCell_selected]: index === selected, [s.ItemCell_element]: isDragging })} >
            {
              img ? <img src={require(`../ItemInfo/img/${img}`)} alt='' /> : ''
            }
          </div >
        ) : (
          <div ref={drop} className={cls({ [s.ItemCell]: true, [s.ItemCell_exist]: img && index !== selected, [s.ItemCell_selected]: index === selected, [s.ItemCell_target]: isOver })} >
            {
              img ? <img src={require(`../ItemInfo/img/${img}`)} alt='' /> : ''
            }
          </div >
        )
      }





    </>
  )

};

export default ItemCell;