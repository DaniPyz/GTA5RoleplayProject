const logger = require('../../modules/logger')
const svgCaptcha = require('svg-captcha');
const CONFIG_FARM = require('../../configs/CONFIG_FARM.json');
const sys_npc = require('../../systems/npc');
const container = require('../../modules/container');
const user = require('../../user');
var marker1 = null
var marker2 = null
var colshape1 = null
var colshape2 = null
var deliveryBlip = null
const objectsList = [
  'prop_cardbordbox_02a',
  'prop_ld_fireaxe'
];

const bodyParts = [
  {
    name: 'Skel root',
    id: 0
  },

  {
    name: 'Right hand',
    id: 57005
  },

  {
    name: 'Left hand',
    id: 18905
  },

  {
    name: 'Head',
    id: 12844
  }
];

try {

  const sys_works_port = {}

  sys_works_port.init = () => {
    
    marker1 = mp.markers.new(1, new mp.Vector3(-374.61431884765625, -2809.68994140625, 3.000308513641357), 5,
      {
        direction: new mp.Vector3(),
        rotation: new mp.Vector3(),
        color: [255, 255, 255, 255],
        visible: true,
        dimension: 0
      })

    colshape1 = mp.colshapes.newCircle(-374.61431884765625, -2809.68994140625, 3, 0)
    colshape1.setVariable('portId', 0)




    logger.log('Система порта запущена УСПЕШНО')
  }
  sys_works_port.isWorking = (player) => {
    if (container.get('user', player.id, "work") === null) return false;
    return true;
  }
  sys_works_port.isWorkingOnIdWork = (player, workId) => {
    if (container.get('user', player.id, "work")[0] === workId) return true;
    return false;
  }
  sys_works_port.startWork = (player) => {
    // const views = container.get('adminchat', id, "views")
    // container.set('adminchat', free, "date", func.convertToMoscowDate(new Date()))
  }
  sys_works_port.endWork = (player) => {

  }
  sys_works_port.createCaptcha = (player) => {
    user.addOpened(player, 'captcha')
    user.toggleHud(player, false)
    user.cursor(player, true)
    let captcha = svgCaptcha.createMathExpr({
      noise: Math.floor(Math.random() * 4),
      color: true,
      fontSize: 60,
      width: 180,
      height: 64,
    });
    container.set('user', player.id, 'captcha', captcha.text);
    user.uiSend(player, 'client::captcha', 'toggle', {
      status: true,
      svg: JSON.stringify(captcha.data).slice(1, -1)
    })
  }
  sys_works_port.verifyCaptcha = (player, value) => {

    if (container.get('user', player.id, 'captcha') === value) return true;

    return false;

  }
  sys_works_port.closeCaptcha = (player) => {
    user.uiSend(player, 'client::captcha', 'toggle', {
      status: false,
      svg: ''
    })
    user.toggleHud(player, true)
    user.cursor(player, false, true)
    container.clear('user', player.id, 'captcha');
    user.removeOpened(player, 'captcha')



  }
  sys_works_port.enterColshape = (player, shape) => {
    const id = shape.getVariable('portId')

    switch (id) {
      case 0:
        player.call('server::user:destroyMarker')
        player.call('server::user:setMarker', [-315.20916748046875, -2698.0341796875, 6.550227642059326, 0, 'Точка приема', true, 77, 371])
        player.call('server::user:setColshape', [-315.20916748046875, -2698.0341796875, 6.550227642059326, 0, 'port', null, true]);

        player.playAnimation('anim@heists@box_carry@', 'idle', 1, 49)
        player.call("attachObject", [objectsList[0], bodyParts[1].id]);

        break;
     

    }

  }
  sys_works_port.exitColshape = (player, shape) => {

  }
  sys_works_port.pay = (player) => {

    user.giveCash(player, 100)
  }




  module.exports = sys_works_port
}
catch (error) {
  logger.error('systems/port')


}