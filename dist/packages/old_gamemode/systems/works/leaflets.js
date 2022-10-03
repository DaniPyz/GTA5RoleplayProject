const logger = require('../../modules/logger')
const CONFIG_LEAFLETS = require('../../configs/CONFIG_LEAFLETS.json');
const CONFIG_LEAFLETS_POS = require('../../configs/CONFIG_LEAFLETS_POS.json');
const sys_vehicle = require('../vehicle');
// const sys_npc = require('../npc');
const container = require('../../modules/container');
const user = require('../../user');
const func = require('../../modules/func');
const chat = require('../../chat');

try {

  const sys_works_leaflets = {}


  sys_works_leaflets.init = () => {
    container.set('work', 4, 'online', 0)

    for (let i = 0; i < CONFIG_LEAFLETS.vehs.length; i++) {

      let veh = sys_vehicle.create(CONFIG_LEAFLETS.vehs[i].model,
        [CONFIG_LEAFLETS.vehs[i].pos.x, CONFIG_LEAFLETS.vehs[i].pos.y, CONFIG_LEAFLETS.vehs[i].pos.z],
        {
         
          number: `Leaf ${i}`,
          locked: false,
          heading: CONFIG_LEAFLETS.vehs[i].heading,
          fuel: 22,
          dimension: 0,
          // owner: 'taxi'
        })

    }
    logger.log('Система листовок запущена УСПЕШНО')
  }
  sys_works_leaflets.respawnCar = (player, numb) => {

    let veh = sys_vehicle.create(CONFIG_LEAFLETS.vehs[numb].model,
      [CONFIG_LEAFLETS.vehs[numb].pos.x, CONFIG_LEAFLETS.vehs[numb].pos.y, CONFIG_LEAFLETS.vehs[numb].pos.z],
      {
        // number: item.number,
        // color: JSON.parse(item.color),
        number: `Leaf ${numb}`,
        // owner: {
        //   taxi: user.getID(player)
        // },
        locked: false,
        heading: CONFIG_LEAFLETS.vehs[numb].heading,
        fuel: 22,
        dimension: 0,
        // owner: 'taxi'
      })
  }


  sys_works_leaflets.isWorking = (player) => {
    if (container.has('user', player.id, "work") && container.get('user', player.id, "work") === null) return false;
    return true;
  }
  sys_works_leaflets.isWorkingOnIdWork = (player, workId = 4) => {
    if (container.has('user', player.id, "work") && container.get('user', player.id, "work")[0] === workId) return true;
    return false;
  }
  sys_works_leaflets.selectHouse= (player, veh) => {
    // CONFIG_GARBAGE.vehs
    let randomPoint = Math.floor(Math.random() * CONFIG_LEAFLETS_POS.leaflets.length)
    // console.log(Math.floor(Math.random() * CONFIG_GARBAGE.trash.length))
  
    player.call('server::user:setMarker', [CONFIG_LEAFLETS_POS.leaflets[randomPoint].pos.x, CONFIG_LEAFLETS_POS.leaflets[randomPoint].pos.y, CONFIG_LEAFLETS_POS.leaflets[randomPoint].pos.z, 0, 'Цель', true, 77])
    player.call('server::user:setColshape', [CONFIG_LEAFLETS_POS.leaflets[randomPoint].pos.x, CONFIG_LEAFLETS_POS.leaflets[randomPoint].pos.y, CONFIG_LEAFLETS_POS.leaflets[randomPoint].pos.z, 0, 'leaflets', veh, true]);
   
  }

  sys_works_leaflets.enterCar = (player, vech, seat) => {
    if (seat === 0 && sys_works_leaflets.isWorkingOnIdWork(player) === false) {
      player.removeFromVehicle()
      user.notify(player, `Вы не начали работу`, 'error')
      return
    }

    if (seat === 0 && sys_vehicle.isRights(vech.id, player) === false) {
      user.toggleHud(player, false)
      user.cursor(player, true, false)

      user.showDialog(player, 'leaflets', 'Аренда маишины для листовок', 'Вы хотите арендовать машину за 700$?', ['Да', "Нет"])

      player._onClickDialog = (player, btn, type) => {

        switch (type) {
          case 'leaflets':

            if (btn === 0) {

              sys_vehicle.createRentForWork(player, vech, 'leaflets')
              vech.engine = sys_vehicle.getEngine(vech.id)
              user.removeCash(player, 700)
              sys_vehicle.updatePlayerData(player, vech)
              user.uiSend(player, 'client::hud', 'speedometr', {
                speedometrSpeed: 0
              })
              user.uiSend(player, 'client::hud', 'speedometrToggle', {
                status: true
              })
              sys_works_leaflets.selectHouse(player, vech)

              
            } else {
              player.removeFromVehicle()


            }
            user.hideDialog(player)
            user.removeOpened(player, 'leafletsdialog')
            user.toggleHud(player, true)
            user.cursor(player, false, true)

          default:
            break;
        }

      }

      user.addOpened(player, 'leafletsdialog')
    } else if (seat === 0 && sys_vehicle.isRights(vech.id, player) === true) {
      sys_vehicle.updatePlayerData(player, vech)
      user.uiSend(player, 'client::hud', 'speedometr', {
        speedometrSpeed: 0
      })
      user.uiSend(player, 'client::hud', 'speedometrToggle', {
        status: true
      })

    } 
  }



  sys_works_leaflets.exitCar = (player, vech) => {
   
    if (container.get('user', player.id, 'rentVehicle') && container.get('user', player.id, 'rentVehicle').vehicle.id === vech.id) {
      const timer = setTimeout(() => {
        sys_works_leaflets.respawnCar(player, vech.numberPlate.split(' ')[1])
        sys_vehicle.destroy(vech.id)
        container.clear('user', player.id, 'rentVehicle')
        player.call('server::user:destroyMarker')
        player.call('server::user:destroyColshape')
        clearTimeout(timer)
      }, 900000);
      // 900000 - 15 minute

    }


  }
  sys_works_leaflets.enterColshape = (player, shape) => {
    const id = shape.getVariable('cabID')
    // if (!houses.isState(id)) return

    if (sys_vehicle.isRights(player, id) === id) user.setNear(player, 'house', id)
    
  }



  module.exports = sys_works_leaflets
}
catch (error) {
  logger.error('systems/leaflets')


}