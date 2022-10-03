const logger = require('./client/modules/logger')
try {
  const user = require('./client/user')
  const ui = require('./client/modules/ui')

  mp.events.add({
    "ui::fraction:openMenu": data => {
      data = JSON.parse(data)
      mp.events.callRemote('client::user:fraction:openMenu', data.id)
    },
    "ui::fraction:employeePromotion": data => {
      data = JSON.parse(data)
      mp.events.callRemote('client::user:fraction:employeePromotion', data.id)
    },
    "ui::fraction:employeeDemontion": data => {
      data = JSON.parse(data)
      mp.events.callRemote('client::user:fraction:employeeDemontion', data.id)
    },
    "ui::fraction:employeeDismissal": data => {
      data = JSON.parse(data)
      mp.events.callRemote('client::user:fraction:employeeDismissal', data.id)
    },
    "ui::fraction:walkieTalkieChangetime": data => {
      let newData = JSON.parse(data)
      mp.events.callRemote('client::user:fraction:walkieTalkieChangetime', newData.id, newData.time.hour, newData.time.minute)
    },
    "ui::fraction:walkieTalkieSubmit": data => {
      let newData = JSON.parse(data)
      mp.events.callRemote('client::user:fraction:walkieTalkieSubmit', newData.message, newData.time.hour, newData.time.minute)
    },
    "ui::fraction:employeeEdit": data => {
      data = JSON.parse(data)
      mp.events.callRemote('client::user:fraction:employeeEdit', data.id, data.type)
    }
   
  })
}
catch (e) {
  logger.error('events/ui/fraction', e)
}
