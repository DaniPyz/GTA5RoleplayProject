const logger = require('../../modules/logger')
const CONFIG_FARM = require('../../configs/CONFIG_FARM.json');
const sys_vehicle = require('../vehicle');
// const sys_npc = require('../npc');
const container = require('../../modules/container');
const user = require('../../user');
const func = require('../../modules/func');
let marker = []
let colshape = []
try {

  const sys_works_farm = {}

  sys_works_farm.init = () => {


    for (let i = 0; i < CONFIG_FARM.vehs.length; i++) {

      let veh = sys_vehicle.create(CONFIG_FARM.vehs[i].model,
        [CONFIG_FARM.vehs[i].pos.x, CONFIG_FARM.vehs[i].pos.y, CONFIG_FARM.vehs[i].pos.z],
        {
          // number: item.number,
          // color: JSON.parse(item.color),
          locked: false,
          heading: CONFIG_FARM.vehs[i].heading,
          fuel: 21,
          dimension: 0
        })

    }






    logger.log('Система фермы запущена УСПЕШНО')
  }

  sys_works_farm.isWorking = (player) => {
    if (container.has('user', player.id, "work") && container.get('user', player.id, "work") === null) return false;
    return true;
  }

  sys_works_farm.isWorkingOnIdWork = (player, workId) => {
    if (container.has('user', player.id, "work") && container.get('user', player.id, "work")[0] === workId) return true;
    return false;
  }
  sys_works_farm.plantingSeed = (player) => {

    if (sys_works_farm.isWorking(player) && sys_works_farm.isWorkingOnIdWork(player, 1)) {} else return

    const id = container.free('work')

    container.set('work', id, '_lastMinute', false)

    const firstTimeout = setTimeout(() => {
      user.notify(player, `Семя выросло и у вас осталось 1 минута что бы собрать растение на красном маркере`, 'error')
      container.get('work', id, '_marker').setColor(255, 0, 0, 255)
      container.set('work', id, '_lastMinute', true)
    }, 30000)
    // 120000 , 180000
    const secondTimeout = setTimeout(() => {
      clearTimeout(firstTimeout)
      sys_works_farm.growingFinished(id)
      clearTimeout(secondTimeout)
    }, 60000)

    player.playScenario("WORLD_HUMAN_GARDENER_PLANT")
    setTimeout(() => {
      player.stopAnimation();
      container.set('work', id, '_colshape', mp.colshapes.newCircle(player.position.x, player.position.y, 1.5, 0)).setVariable('farmId', id)

      container.set('work', id, '_marker', mp.markers.new(1, new mp.Vector3(player.position.x, player.position.y, player.position.z - 1), 2, {
        color: [255, 255, 255, 255],
        visible: false
      })).showFor(player)
    }, 8000)



  }

  sys_works_farm.enterColshape = (player, shape) => {
    const id = shape.getVariable('farmId')
    if (container.get('work', id, '_lastMinute') === true) {
      player.playScenario("WORLD_HUMAN_GARDENER_PLANT")
      setTimeout(() => {
        player.stopAnimation();
        user.addInventory(player, 11, 3)
        sys_works_farm.growingFinished(id)

      }, 8000)
      // user.notify(player, `Тебе типо добавилось в инвентарь`)
    } else {


    }
  }
  sys_works_farm.exitColshape = (player, shape) => {
    const id = shape.getVariable('farmId')

  }
  sys_works_farm.growingFinished = (id) => {
    if (container.has('work', id, '_marker') === null && container.has('work', id, '_colshape') === null)
      container.get('work', id, '_marker').destroy()
    container.get('work', id, '_marker').destroy()
    container.get('work', id, '_colshape').destroy()
    container.clear('work', id, '_marker')
    container.clear('work', id, '_colshape')
    container.clear('work', id, 'lastMinute')


  }


  module.exports = sys_works_farm
}
catch (error) {
  logger.error('systems/farm')


}