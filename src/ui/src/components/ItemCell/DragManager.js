import cls from 'classnames';
import s from './ItemCell.module.scss';

export var DragManager = new function () {

  /**
   * составной объект для хранения информации о переносе:
   * {
   *   elem - элемент, на котором была зажата мышь
   *   avatar - аватар
   *   downX/downY - координаты, на которых был mousedown
   *   shiftX/shiftY - относительный сдвиг курсора от угла элемента
   * }
   */

  var dragObject = {};

  var self = this;

  function onMouseDown(e) {

    if (e.which != 1) return;


    var elem1 = e.target.closest('.draggable');
    elem1.classList = elem1.classList + " " + cls({ [s.ItemCell_element]: true })
    if (elem1 === null) return
    
    let elem = elem1.cloneNode(true);

    if (!elem) return;

    dragObject.initElem = elem1;

    dragObject.elem = elem;
    dragObject.initId = elem1.id;

    // запомним, что элемент нажат на текущих координатах pageX/pageY
    dragObject.downX = e.pageX;
    dragObject.downY = e.pageY;

    return false;
  }

  function onMouseMove(e) {
    if (!dragObject.elem) return; // элемент не зажат

    if (!dragObject.avatar) { // если перенос не начат...
      var moveX = e.pageX - dragObject.downX;
      var moveY = e.pageY - dragObject.downY;

      // если мышь передвинулась в нажатом состоянии недостаточно далеко
      if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
        return;
      }

      // начинаем перенос
      dragObject.avatar = createAvatar(e); // создать аватар
      if (!dragObject.avatar) { // отмена переноса, нельзя "захватить" за эту часть элемента
        dragObject = {};
        return;
      }

      // аватар создан успешно
      // создать вспомогательные свойства shiftX/shiftY
      var coords = getCoords(dragObject.avatar);
      dragObject.shiftX = dragObject.downX - 200;
      dragObject.shiftY = dragObject.downY - 400;
      // dragObject.shiftX = 30;
      // dragObject.shiftY = 30;
      startDrag(e); // отобразить начало переноса
    }

    // отобразить перенос объекта при каждом движении мыши
    dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
    dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';

    return false;
  }

  function onMouseUp(e) {
    if (dragObject.avatar) { // если перенос идет
      finishDrag(e);
    }

    // перенос либо не начинался, либо завершился
    // в любом случае очистим "состояние переноса" dragObject
    dragObject = {};
  }

  function finishDrag(e) {
    var dropElem = findDroppable(e);
    
    self.onDragInit({
      status: false
    }, dragObject.initId);
    dragObject.elem.remove()

    let classes = dragObject.initElem.classList.value
    // const lastIndexOfSpace = classes.classList.lastIndexOf(' ');
    const lastIndexOfSpace = classes.lastIndexOf(' ');
   
    const withSpaces = classes.substring(0, lastIndexOfSpace);;

    dragObject.initElem.className = withSpaces
    if (!dropElem) {
      self.onDragCancel(dragObject);

    } else {
      self.onDragEnd(dragObject, dropElem);
    }
  }

  function createAvatar(e) {

    // запомнить старые свойства, чтобы вернуться к ним при отмене переноса
    var avatar = dragObject.elem;
    var old = {
      parent: avatar.parentNode,
      nextSibling: avatar.nextSibling,
      position: avatar.position || '',
      left: avatar.left || '',
      top: avatar.top || '',
      zIndex: avatar.zIndex || ''
    };

    // функция для отмены переноса
    avatar.rollback = function () {
      old.parent.insertBefore(avatar, old.nextSibling);
      avatar.style.position = old.position;
      avatar.style.left = old.left;
      avatar.style.top = old.top;
      avatar.style.zIndex = old.zIndex
    };

    return avatar;
  }

  function startDrag(e) {
    var avatar = dragObject.avatar;

    self.onDragInit({
      status: true
    }, dragObject.initId);
    // инициировать начало переноса
    document.body.appendChild(avatar);
    avatar.style.zIndex = 9999;
    avatar.style.position = 'absolute';
  }

  function findDroppable(event) {
    // спрячем переносимый элемент
    dragObject.avatar.hidden = true;

    // получить самый вложенный элемент под курсором мыши
    var elem = document.elementFromPoint(event.clientX, event.clientY);

    // показать переносимый элемент обратно
    dragObject.avatar.hidden = false;

    if (elem == null) {
      // такое возможно, если курсор мыши "вылетел" за границу окна
      return null;
    }

    return elem.closest('.droppable');
  }

  document.onmousemove = onMouseMove;
  document.onmouseup = onMouseUp;
  document.onmousedown = onMouseDown;

  this.onDragEnd = function (dragObject, dropElem) { };
  this.onDragCancel = function (dragObject) { };
  this.onDragInit = function (newObj, initId) { };
}();


function getCoords(elem) { // кроме IE8-
  var box = elem.getBoundingClientRect();

  return {

    top: box.top + window.pageYOffset,
    left: box.left + window.pageXOffset
  };

}