const logger = require('./client/modules/logger')
try
{
    const user = require('./client/user')
    const ui = require('./client/modules/ui')

    mp.events.add({
        "ui::npcdialog": data =>
        {
            data = JSON.parse(data)

            if(user.npcdialog.server === false) mp.players.local._npcDialogCallback(data.id, data.btn)
            else mp.events.callRemote('client::user:npcdialogCallback', data.id, data.btn)
        }
    })
}
catch(e)
{
    logger.error('events/ui/npcdialog', e)
}
