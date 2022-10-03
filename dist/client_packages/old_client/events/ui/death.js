const logger = require('./client/modules/logger')
try
{
    const user = require('./client/user')
    const ui = require('./client/modules/ui')

    mp.events.add({
        "ui::death": () =>
        {
            mp.events.callRemote('client::user:deathSuccess')
        },
        "ui::death:click": data =>
        {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:deathClick', data.status, data.timer)
        }
    })
}
catch(e)
{
    logger.error('events/ui/choicechar', e)
}
