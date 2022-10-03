const logger = require('./client/modules/logger')
try
{
    const user = require('./client/user')
    const ui = require('./client/modules/ui')

    mp.events.add({
        "ui::phone:openApp": data =>
        {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:phone:openApp', data.id, data.currentID)
        },
        "ui::phone:keypad:call": data => {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:phone:call', data.phone)
        }
    })
}
catch(e)
{
    logger.error('events/ui/phone', e)
}
