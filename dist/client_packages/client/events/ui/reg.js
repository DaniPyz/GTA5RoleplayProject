const logger = require('./client/modules/logger')
try
{
    const user = require('./client/user')
    const ui = require('./client/modules/ui')

    mp.events.add({
        "ui::reg": data =>
        {
            data = JSON.parse(data)
            if(data.type === 'registration')
            {
                mp.events.callRemote('client::user:createAccount', JSON.stringify({
                    login: data.login,
                    password: data.pass,
                    email: data.email,
                    promo: data.promo,
                    saveme: data.saveme
                }))
            }
            else if(data.type === 'auth')
            {
                mp.events.callRemote('client::user:loginAccount', JSON.stringify({
                    login: data.login,
                    password: data.pass,
                    saveme: data.saveme
                }))
            }
        },
        "server::reg": data =>
        {
            if(data.error) ui.send('client::reg', 'error', {
                state: true,
                text: data.error
            })
            else
            {
                user.cursor(false)
                ui.send('client::reg', 'toggle', {
                    status: false
                })

                mp.storage.data.authRemember = data.saveme
                mp.storage.data.authRemember.status = true

                mp.storage.flush()
            }
        }
    })
}
catch(e)
{
    logger.error('events/ui/reg', e)
}
