const logger = require('./client/modules/logger')
try
{
    const user = require('./client/user')
    const ui = require('./client/modules/ui')

    mp.events.add({
        "ui::keypressed": data =>
        {
            mp.events.callRemote('client::key', data)
        }
    })
}
catch(e)
{
    logger.error('events/ui/keypressed', e)
}
