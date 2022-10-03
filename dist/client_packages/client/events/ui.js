const logger = require('./client/modules/logger')
try
{
    const ui = require('./client/modules/ui')

    mp.events.add({
        "server::ui:send": (eventname, cmd, data) =>
        {
            ui.send(eventname, cmd, data)
        }
    })
}
catch(e)
{
    logger.error('events/ui', e)
}
