const logger = require('./client/modules/logger')
try
{
    const user = require('./client/user')
    const ui = require('./client/modules/ui')

    mp.events.add({
        "ui::dialog": data =>
        {
            data = JSON.parse(data)
            // console.log('Data')
            mp.events.callRemote('client::user:dialogClick', data.id, data.type)
        }
    })
}
catch(e)
{
    logger.error('events/ui/dialog', e)
}
