const logger = require('../modules/logger')
const user = require('../user')
try {
  const chat = require('../chat')

  // @ts-ignore
  mp.events.add({
    "serverNew::give:item": (player, id, count = 1, data = {}, onlyInv = false, customWeight = 0, canStack = false) => {
 
      user.addInventory(player, id, count , data , onlyInv, customWeight, canStack)
    },
    'serverNew::writeChat': (player, message) => {
      console.log(player, message)
      chat.me(player, message, true, 'gray')
    }
   
  })
}
catch (e) {
  logger.error('events/newServer.js', e)
}
