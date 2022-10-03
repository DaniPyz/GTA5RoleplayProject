const logger = require('./client/modules/logger')
try {
    const user = require('./client/user')
    const ui = require('./client/modules/ui')

    mp.events.add({
        "ui::menu:openMenu": data => {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:menu:openMenu', data.id)
        },
        "ui::menu:bizOpenMenu": data => {

            data = JSON.parse(data)
            mp.events.callRemote('client::user:biz:openMenu', data.id)


        },
        "ui::menu:trackQuest": data => {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:trackQuest', data.id)
        },
        "ui::menu:compilQuest": data => {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:compilQuest', data.id)
        },

        "ui::menu:createReport": data => {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:menu:createReport', data.message)
        },
        "ui::menu:sendReportMessage": data => {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:menu:sendReportMessage', data.id, data.message)
        },
        "ui::menu:closeReport": data => {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:menu:closeReport', data.id)
        },

        "ui::menu:updateKeys": data => {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:menu:updateKeys', data.key, data.keyCode, data.keyName)
        },

        "ui::menu:updateSettings": data => {
            mp.events.callRemote('client::user:menu:updateSettings', data)
        },

        "ui::menu:donate:buyCash": data => {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:menu:buyCash', data.id)
        },

        "ui::menu:roullete:go": data => {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:menu:roullete:go', data.fast)
        },
        "ui::menu:roullete:stop": data => {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:menu:roullete:stop', data.id)
        }
    })
}
catch (e) {
    logger.error('events/ui/menu', e)
}
