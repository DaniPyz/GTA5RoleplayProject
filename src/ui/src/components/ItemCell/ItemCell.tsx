import { useEffect, useState } from 'react';

import { DragManager } from './DragManager';
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
  selectedFilter: number;
  isLocker?: boolean
}

const ItemCell = ({ index, change, selectedCell = null, img, selectedFilter, isLocker = false }: Props) => {

  const [locker, setLocker] = useState(isLocker)
 
  
  const dispatch = useAppDispatch();


  DragManager.onDragEnd = function (dragObject, dropElem) {
    dragObject.elem.style.display = 'none';
    
    if (dragObject.elem.dataset.customInfo) {
      dispatch({ type: 'LOCKER_CHANGE', data: { index: parseInt(dragObject.initId), indexNew: parseInt(dropElem.id), selectedFilter: selectedFilter } });

    } else {
      dispatch({ type: 'WAREHOUSE_CHANGE', data: { index: parseInt(dragObject.initId), indexNew: parseInt(dropElem.id), selectedFilter: selectedFilter } });
    }
    if (change && parseInt(dragObject.initId) === selectedCell) {

      let newId = parseInt(dropElem.id)
      change(newId)
    }

  };
  DragManager.onDragInit = function (status: { status: boolean }) {
 
    if (status.status) {
      dragging = status.status
    } else {

      dragging = false
    }
  };



  return (
    <>


      {
        img ? (
          <div
            className={"draggable " + cls({ [s.ItemCell]: true, [s.ItemCell_exist]: img && index !== selectedCell, [s.ItemCell_selected]: index === selectedCell, [s.ItemCell_element]: dragging })}
            id={index.toString()}
            onDragStart={() => {
              return false;
            }}
            data-custom-info={isLocker}
          >

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