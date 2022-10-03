const logger = require('./client/modules/logger')
try
{
    const user = require('./client/user')
    const ui = require('./client/modules/ui')

    mp.events.add({
        "ui::hud:chatClosed": () =>
        {
            user.cursor(false, true)
        },
        "ui::hud:sendChatMessage": data =>
        {
            data = JSON.parse(data)
            if(!data.text.length)return

            if(data.text[0] === '/' || data.text[0] === '!')
            {
                const command = data.text.split(' ')[0].replace('!', '').replace('/', '')

                const args = data.text.trim().split(' ')
                args.splice(0, 1)

                let strArgs = ''
                args.forEach(item => strArgs += item + ' ')

                mp.events.callRemote('client::user:enterCommand', command, strArgs.trim(), JSON.stringify(args))
            }
            else mp.events.callRemote('client::user:sendChatMessage', JSON.stringify(data))
        }
    })
}
catch(e)
{
    logger.error('events/ui/hud', e)
}
