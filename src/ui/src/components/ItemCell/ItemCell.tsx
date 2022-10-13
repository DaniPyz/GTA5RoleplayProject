import { DragManager } from './DragManager';
import cls from 'classnames';
import s from './ItemCell.module.scss';
import { useAppDispatch } from 'hooks';

interface Props {
  index: number,
  selectedCell?: number | null,
  img?: string,
  count?: number,
  change?: (index: number) => void;
  selectedFilter: number
}

const ItemCell = ({ index, change, selectedCell = null, img, selectedFilter }: Props) => {

  const dispatch = useAppDispatch();
  let dragging = false
  DragManager.onDragCancel = function (dragObject) {
    dragObject.avatar.rollback();
  };


  DragManager.onDragEnd = function (dragObject, dropElem) {
    dragObject.elem.style.display = 'none';
    dispatch({ type: 'WAREHOUSE_CHANGE', data: { index: parseInt(dragObject.initId), indexNew: parseInt(dropElem.id), selectedFilter: selectedFilter } });
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

            // onMouseDown={onClickDown}
            id={index.toString()}
            onDragStart={() => {
              return false;
            }}

          >

            {

              img ? <img className="" src={require(`../ItemInfo/img/${img}`)} alt='' /> : ''
            }
          </div >
        ) : (
          <div className={'droppable ' + cls({ [s.ItemCell]: true, [s.ItemCell_exist]: img && index !== selectedCell, [s.ItemCell_selected]: index === selectedCell, [s.ItemCell_target]: false })} id={index.toString()}>
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