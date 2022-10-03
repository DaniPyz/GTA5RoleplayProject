const logger = require('../modules/logger')
try {
  const container = require('../modules/container')
  const user = require('../user')
  const chat = require('../chat')
  const sys_vehicle = require('./vehicle')
  const func = require('../modules/func')

  const sys_interaction = {}
  sys_interaction.getPosition = id => {
   
    return container.get('user', id, 'position')
  }
  
  sys_interaction.nearPlayer = (player, id = -1) => {
    if (!user.isLogged(player)) return -1

    if (id === -1) id = user.getNears(player).npc
    

    if (func.distance2D(player.position, new mp.Vector3(sys_interaction.getPosition(id).x, sys_interaction.getPosition(id).y, sys_interaction.getPosition(id).z)) >= 3.5
      || player.dimension !== sys_interaction.getPosition(id).vw) {
      if (id === user.getNears(player).interaction) user.removeNear(player, 'interaction')
      return -1
    }

    return id
  }

  // Events
  sys_interaction.enterColshape = (player, shape) => {

    const playerId = user.getID(player)

    if (sys_interaction.nearPlayer(player, playerId) === playerId) user.setNear(player, 'interaction', playerId)
    else return

    user.toggleActionText(player, true, 'G', `Нажмите, чтобы открыть меню взамодействия`)
   
  }
  sys_interaction.exitColshape = (player, shape) => {
    const playerId = user.getID(player)


    user.removeNear(player, 'interaction')
    user.toggleActionText(player, false)
  }

  module.exports = sys_interaction
}
catch (e) {
  logger.error('systems/interaction')
}