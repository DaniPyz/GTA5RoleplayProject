const logger = require('./client/modules/logger')
try
{
    const user = require('./client/user')
    const ui = require('./client/modules/ui')

    mp.events.add({
        "ui::selectchar": data =>
        {
            data = JSON.parse(data)

            if(data.charData.buy) mp.events.callRemote('client::user:buyCharClot')
            else if(data.charData.id) mp.events.callRemote('client::user:selectChar', data.charData.id)
            else mp.events.callRemote('client::user:createChar')
        },
        "server::ui:selectchat:hide": () =>
        {
            ui.send('client::selectchar', 'toggle', {
                status: false
            })
            user.cursor(false)
        }
    })
}
catch(e)
{
    logger.error('events/ui/choicechar', e)
}
