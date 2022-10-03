const logger = require('./client/modules/logger')
try
{
    const user = require('./client/user')
    const ui = require('./client/modules/ui')

    mp.events.add({
        "ui::inventory:useItem": data =>
        {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:inventory:useItem', data.id, data.type, data.indexInSection)
        },
        "ui::inventory:dropItem": data =>
        {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:inventory:dropItem', data.id, data.type, data.indexInSection)
        },
        "ui::inventory:splitItem": data => {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:inventory:splitItem', data.id, data.type, data.indexInSection)
        },
        "ui::inventory:trade": data =>
        {
            mp.events.callRemote('client::user:inventory:tradeItem', data)
        },
        "ui::inventory:set": data =>
        {
            mp.events.callRemote('client::user:inventory:setItem', data)
        },
        "ui::inventory:takeoff": data =>
        {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:inventory:takeoff', data.id, data.type, data.indexInSection)
        }
    })
}
catch(e)
{
    logger.error('events/ui/inventory', e)
}
