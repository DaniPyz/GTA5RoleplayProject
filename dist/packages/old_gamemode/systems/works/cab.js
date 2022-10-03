const logger = require('../../modules/logger')
const CONFIG_CAB = require('../../configs/CONFIG_CAB.json');
const sys_vehicle = require('../vehicle');
// const sys_npc = require('../npc');
const container = require('../../modules/container');
const user = require('../../user');
const func = require('../../modules/func');
const chat = require('../../chat');

try {

  const sys_works_cab = {}


  sys_works_cab.init = () => {
    container.set('work', 2, 'online', 0)

    for (let i = 0; i < CONFIG_CAB.vehs.length; i++) {

      let veh = sys_vehicle.create(CONFIG_CAB.vehs[i].model,
        [CONFIG_CAB.vehs[i].pos.x, CONFIG_CAB.vehs[i].pos.y, CONFIG_CAB.vehs[i].pos.z],
        {
          // number: item.number,
          // color: JSON.parse(item.color),
          number: `TAXI ${i}`,
          // owner: {
          //   taxi: user.getID(player)
          // },
          locked: false,
          heading: CONFIG_CAB.vehs[i].heading,
          fuel: 21,
          dimension: 0,
          // owner: 'taxi'
        })

    }
    logger.log('Система такси запущена УСПЕШНО')
  }
  sys_works_cab.respawnCar = (player, numb) => {

    let veh = sys_vehicle.create(CONFIG_CAB.vehs[numb].model,
      [CONFIG_CAB.vehs[numb].pos.x, CONFIG_CAB.vehs[numb].pos.y, CONFIG_CAB.vehs[numb].pos.z],
      {
        // number: item.number,
        // color: JSON.parse(item.color),
        number: `TAXI ${numb}`,
        // owner: {
        //   taxi: user.getID(player)
        // },
        locked: false,
        heading: CONFIG_CAB.vehs[numb].heading,
        fuel: 21,
        dimension: 0,
        // owner: 'taxi'
      })
  }
  sys_works_cab.playerOrderedCab = (player) => {
    if (container.get('user', player.id, 'isCabCalled') === false || container.get('user', player.id, 'isCabCalled') === null) return false;
    return true;
  }
  sys_works_cab.removePlayerOrder = (player) => {
    container.set('user', player.id, 'isCabCalled', false)
  }

  sys_works_cab.isWorking = (player) => {
    if (container.has('user', player.id, "work") && container.get('user', player.id, "work") === null) return false;
    return true;
  }


  sys_works_cab.isWorkingOnIdWork = (player, workId = 2) => {
    if (container.has('user', player.id, "work") && container.get('user', player.id, "work")[0] === workId) return true;
    return false;
  }
  sys_works_cab.callCab = (player) => {
    if (container.get('work', 2, 'online') === 0) return user.notify(player, `Нету водителей онлайн. Попробуй позже.`, 'error')
    container.set('user', player.id, 'isCabCalled', true)
    chat.cab(`[T] Появился новый вызов что бы принять напишете /accept ${player.id}`)
  }
  sys_works_cab.shareWayPointToDriver = (player, positionX, postionY, positionZ) => {
    let driver = sys_vehicle.getDriver(player.vehicle)
   
    if (player.vehicle === null) return user.notify(player, 'Вы не в машине', 'error')
    if (driver === -1) return user.notify(player, 'В машине нету водителя', 'error')
    if (user.getPlayerForID(parseInt(driver.id)) === null) return user.notify(player, 'Водитель не находится в игре', 'error')
    let driverPlayer = user.getPlayerForID(parseInt(driver.id))
    if (driverPlayer === player) return user.notify(player, 'Вы не можете себе же предложить', 'error')

    user.toggleHud(player, false)
    user.cursor(player, true, false)
    user.showDialog(player, 'taxiClient', 'Поездка на такси.', `Поездка на растояние: ${Math.round(func.distance2D({ x: player.position.x, y: player.position.y }, { x: positionX, y: postionY }))}м, что обойдется вам в ${Math.round(func.distance2D({ x: player.position.x, y: player.position.y }, { x: positionX, y: postionY })) * 1.5} `, ['Да', "Нет"])

    player._onClickDialog = (player, btn, type) => {

      switch (type) {
        case 'taxiClient':

          if (btn === 0) {

            user.removeCash(player, Math.round(func.distance2D({ x: player.position.x, y: player.position.y }, { x: positionX, y: postionY })) * 1.5)
            user.giveCash(driverPlayer, Math.round(func.distance2D({ x: player.position.x, y: player.position.y }, { x: positionX, y: postionY })) * 1.5)
            user.hideDialog(player)
            user.removeOpened(player, 'cabdialog')
            user.toggleHud(player, true)
            user.cursor(player, false, true)
            // @ts-ignore
            console.log(positionZ)
            driverPlayer.call('server::user:setMarker', [positionX, postionY, positionZ, 0, 'Точка назначения', true, 75])
            // @ts-ignore
            driverPlayer.call('server::user:setColshape', [positionX, postionY, positionZ, 0, 'cabArrive' ]);
            // This function calls a client-side event for the selected player.
            // let marker = mp.markers.new(1, new mp.Vector3(positionX, postionY, positionZ), 3, {
            //   direction: new mp.Vector3(),
            //   rotation: new mp.Vector3(),
            //   color: [255, 255, 255, 255],
            //   visible: true,
            //   dimension: 0
            // });
            // let blip = mp.blips.new(1, new mp.Vector3(positionX, postionY, positionZ), {
            //   name: 'Точка назначения',
            //   color: 75,
            //   shortRange: false
            // })
            // // @ts-ignore
            // marker.showFor(driverPlayer)
            // // @ts-ignore
            // blip.showFor(driverPlayer)
            // // @ts-ignore
            // blip.routeFor(driverPlayer, 77, 1);
            
          } else {
            user.notify(player, 'Вы отказались от поездки.', 'error')
            user.notify(driverPlayer, 'Пасажир отказался от поездки.', 'error')
          }
          user.hideDialog(player)
          user.removeOpened(player, 'cabdialog')
          user.toggleHud(player, true)
          user.cursor(player, false, true)

        default:
          break;
      }

    }

    user.addOpened(player, 'cabdialog')
  }

  sys_works_cab.enterCar = (player, vech, seat) => {
    if (seat === 0 && sys_works_cab.isWorkingOnIdWork(player) === false) {
      player.removeFromVehicle()
      user.notify(player, `Вы не начали работу`, 'error')
      return
    }

    if (seat === 0 && sys_vehicle.isRights(vech.id, player) === false) {
      user.toggleHud(player, false)
      user.cursor(player, true, false)

      user.showDialog(player, 'taxi', 'Аренда машины такси', 'Вы хотите арендовать машину такси за 500$?', ['Да', "Нет"])

      player._onClickDialog = (player, btn, type) => {

        switch (type) {
          case 'taxi':

            if (btn === 0) {

              sys_vehicle.createRentForWork(player, vech, 'cab')
              vech.engine = sys_vehicle.getEngine(vech.id)
              user.removeCash(player, 500)
              sys_vehicle.updatePlayerData(player, vech)
              user.uiSend(player, 'client::hud', 'speedometr', {
                speedometrSpeed: 0
              })
              user.uiSend(player, 'client::hud', 'speedometrToggle', {
                status: true
              })
            } else {
              console.log('Нет')
              player.removeFromVehicle()


            }
            user.hideDialog(player)
            user.removeOpened(player, 'cabdialog')
            user.toggleHud(player, true)
            user.cursor(player, false, true)

          default:
            break;
        }

      }

      user.addOpened(player, 'cabdialog')
    } else if (seat === 0 && sys_vehicle.isRights(vech.id, player) === true) {
      sys_vehicle.updatePlayerData(player, vech)
      user.uiSend(player, 'client::hud', 'speedometr', {
        speedometrSpeed: 0
      })
      user.uiSend(player, 'client::hud', 'speedometrToggle', {
        status: true
      })

    } else if (seat !== 0) {
      if (container.get('user', player.id, 'waypoint')) {
        // console.log(container.get('user', player.id, 'waypoint').positionX,
        //   container.get('user', player.id, 'waypoint').postionY)
      }
    }
  }



  sys_works_cab.exitCar = (player, vech) => {
    if (container.get('user', player.id, 'rentVehicle') && container.get('user', player.id, 'rentVehicle').vehicle.id === vech.id) {
      const timer = setTimeout(() => {
        container.clear('user', player.id, 'rentVehicle')
        sys_works_cab.respawnCar(player, vech.numberPlate.split(' ')[1])
        sys_vehicle.destroy(vech.id)

        clearTimeout(timer)
      }, 3000);
      // 900000 - 15 minute

    }


  }
  sys_works_cab.enterColshape = (player, shape) => {
    const id = shape.getVariable('cabID')
    // if (!houses.isState(id)) return

    if (sys_vehicle.isRights(player, id) === id) user.setNear(player, 'house', id)
    
  }



  module.exports = sys_works_cab
}
catch (error) {
  logger.error('systems/cab')


}