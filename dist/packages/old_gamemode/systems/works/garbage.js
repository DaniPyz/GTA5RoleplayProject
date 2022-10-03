const logger = require('../../modules/logger')
const CONFIG_GARBAGE = require('../../configs/CONFIG_GARBAGE.json');
const CONFIG_GARBAGE_TRASH = require('../../configs/CONFIG_GARBAGE_TRASH.json');
const sys_vehicle = require('../vehicle');
// const sys_npc = require('../npc');
const container = require('../../modules/container');
const user = require('../../user');
const func = require('../../modules/func');
const chat = require('../../chat');

try {

  const sys_works_garbage = {}


  sys_works_garbage.init = () => {
    container.set('work', 3, 'online', 0)

    for (let i = 0; i < CONFIG_GARBAGE.vehs.length; i++) {

      let veh = sys_vehicle.create(CONFIG_GARBAGE.vehs[i].model,
        [CONFIG_GARBAGE.vehs[i].pos.x, CONFIG_GARBAGE.vehs[i].pos.y, CONFIG_GARBAGE.vehs[i].pos.z],
        {
         
          number: `Trash ${i}`,
          locked: false,
          heading: CONFIG_GARBAGE.vehs[i].heading,
          fuel: 22,
          dimension: 0,
          // owner: 'taxi'
        })

    }
    logger.log('Система мусоровозов запущена УСПЕШНО')
  }
  sys_works_garbage.respawnCar = (player, numb) => {

    let veh = sys_vehicle.create(CONFIG_GARBAGE.vehs[numb].model,
      [CONFIG_GARBAGE.vehs[numb].pos.x, CONFIG_GARBAGE.vehs[numb].pos.y, CONFIG_GARBAGE.vehs[numb].pos.z],
      {
        // number: item.number,
        // color: JSON.parse(item.color),
        number: `Trash ${numb}`,
        // owner: {
        //   taxi: user.getID(player)
        // },
        locked: false,
        heading: CONFIG_GARBAGE.vehs[numb].heading,
        fuel: 22,
        dimension: 0,
        // owner: 'taxi'
      })
  }


  sys_works_garbage.isWorking = (player) => {
    if (container.has('user', player.id, "work") && container.get('user', player.id, "work") === null) return false;
    return true;
  }
  sys_works_garbage.isWorkingOnIdWork = (player, workId = 3) => {
    if (container.has('user', player.id, "work") && container.get('user', player.id, "work")[0] === workId) return true;
    return false;
  }
  sys_works_garbage.selectTrash = (player, veh) => {
    let randomPoint = Math.floor(Math.random() * CONFIG_GARBAGE_TRASH.trash.length)
   
    player.call('server::user:setMarker', [CONFIG_GARBAGE_TRASH.trash[randomPoint].pos.x, CONFIG_GARBAGE_TRASH.trash[randomPoint].pos.y, CONFIG_GARBAGE_TRASH.trash[randomPoint].pos.z, 0, 'Мусор', true, 77])
    player.call('server::user:setColshape', [CONFIG_GARBAGE_TRASH.trash[randomPoint].pos.x, CONFIG_GARBAGE_TRASH.trash[randomPoint].pos.y, CONFIG_GARBAGE_TRASH.trash[randomPoint].pos.z, 0, 'garbage', veh, true]);
   
  }

  sys_works_garbage.enterCar = (player, veh, seat) => {
    if (seat === 0 && sys_works_garbage.isWorkingOnIdWork(player) === false) {
      player.removeFromVehicle()
      user.notify(player, `Вы не начали работу`, 'error')
      return
    }

    if (seat === 0 && sys_vehicle.isRights(veh.id, player) === false) {
      user.toggleHud(player, false)
      user.cursor(player, true, false)

      user.showDialog(player, 'garbage', 'Аренда мусоровоза', 'Вы хотите арендовать мусоровоз за 600$?', ['Да', "Нет"])

      player._onClickDialog = (player, btn, type) => {

        switch (type) {
          case 'garbage':

            if (btn === 0) {

              sys_vehicle.createRentForWork(player, veh, 'garbage')
              veh.engine = sys_vehicle.getEngine(veh.id)
              user.removeCash(player, 600)
              sys_vehicle.updatePlayerData(player, veh)
              user.uiSend(player, 'client::hud', 'speedometr', {
                speedometrSpeed: 0
              })
              user.uiSend(player, 'client::hud', 'speedometrToggle', {
                status: true
              })
              sys_works_garbage.selectTrash(player, veh)

              
            } else {
              player.removeFromVehicle()


            }
            user.hideDialog(player)
            user.removeOpened(player, 'garbagedialog')
            user.toggleHud(player, true)
            user.cursor(player, false, true)

          default:
            break;
        }

      }

      user.addOpened(player, 'garbagedialog')
    } else if (seat === 0 && sys_vehicle.isRights(veh.id, player) === true) {
      sys_vehicle.updatePlayerData(player, veh)
      user.uiSend(player, 'client::hud', 'speedometr', {
        speedometrSpeed: 0
      })
      user.uiSend(player, 'client::hud', 'speedometrToggle', {
        status: true
      })

    } 
  }



  sys_works_garbage.exitCar = (player, vech) => {
   
    if (container.get('user', player.id, 'rentVehicle') && container.get('user', player.id, 'rentVehicle').vehicle.id === vech.id) {
      const timer = setTimeout(() => {
        sys_works_garbage.respawnCar(player, vech.numberPlate.split(' ')[1])
        sys_vehicle.destroy(vech.id)
        container.clear('user', player.id, 'rentVehicle')
        player.call('server::user:destroyMarker')
        player.call('server::user:destroyColshape')
        clearTimeout(timer)
      }, 900000);
      // 900000 - 15 minute

    }


  }
  // sys_works_garbage.enterColshape = (player, shape) => {
  //   const id = shape.getVariable('cabID')
  //   // if (!houses.isState(id)) return

  //   if (sys_vehicle.isRights(player, id) === id) user.setNear(player, 'house', id)
    
  // }



  module.exports = sys_works_garbage
}
catch (error) {
  logger.error('systems/garbage')


}