const logger = require('../modules/logger')
try
{
    const container = require('../modules/container')
    const mysql = require('../plugins/mysql')
    const user = require('../user')
    const chat = require('../chat')

    const CONFIG_ADM = require('../configs/CONFIG_ADM.json')

    const func = require('../modules/func')

    const sys_adminchat = {}

    sys_adminchat.addMessage = (player, text) =>
    {
        const free = container.free('adminchat')

        container.set('adminchat', free, "creator", {
            name: user.getName(player),
            uid: user.getID(player),
            cid: user.charID(player),
            lvl: user.getAdminLvl(player)
        })
        container.set('adminchat', free, "date", func.convertToMoscowDate(new Date()))
        container.set('adminchat', free, "text", text)
        container.set('adminchat', free, "views", [user.getID(player)])

        chat.admin('#e19528', `[A] ${CONFIG_ADM.names[user.getAdminLvl(player)]} (${user.getAdminLvl(player)}) ${user.getName(player)}[${player.id}]: ${text}`)
        mp.players.forEach(pl =>
        {
            if(user.isOpened(pl, 'adminmenu')) user.uiSend(pl, 'client::admin', 'updateChatMessages', {
                players: sys_adminchat.getAdmins(),
                messages: sys_adminchat.getMessages(),
                write: null
            })
        })
    }
    sys_adminchat.addMessageSystem = (text, color = 'white') =>
    {
        try
        {
            logger.debug('sdasd')
            const free = container.free('adminchat')

            container.set('adminchat', free, "creator", {
                name: '',
                uid: 0,
                cid: 0,
                lvl: 0
            })
            container.set('adminchat', free, "date", func.convertToMoscowDate(new Date()))
            container.set('adminchat', free, "text", text)
            container.set('adminchat', free, "views", [])
            container.set('adminchat', free, 'system', true)

            chat.admin(color, `[A] ${text}`)
            mp.players.forEach(pl =>
            {
                if(user.isOpened(pl, 'adminmenu')) user.uiSend(pl, 'client::admin', 'updateChatMessages', {
                    players: sys_adminchat.getAdmins(),
                    messages: sys_adminchat.getMessages(),
                    write: null
                })
            })
        }
        catch(e)
        {
            logger.error('', e)
        }
    }
    sys_adminchat.viewMessage = (player, id) =>
    {
        const views = container.get('adminchat', id, "views")
        if(views.indexOf(user.getID(id)) !== -1)
        {
            views.push(user.getID(id))
            container.set('adminchat', id, 'views', views)

            mp.players.forEach(pl =>
            {
                if(user.isOpened(pl, 'adminmenu')) user.uiSend(pl, 'client::admin', 'updateChatMessages', {
                    players: sys_adminchat.getAdmins(),
                    messages: sys_adminchat.getMessages(),
                    write: null
                })
            })
        }
    }

    sys_adminchat.getMessages = () =>
    {
        const messages = []

        for(var key in container.all('adminchat'))
        {
            messages.push({
                id: parseInt(key), name: container.all('adminchat')[key].creator.name, uid: container.all('adminchat')[key].creator.uid, lvl: container.all('adminchat')[key].creator.lvl, text: container.all('adminchat')[key].text, views: container.all('adminchat')[key].views, date: new Date(container.all('adminchat')[key].date), system: container.all('adminchat')[key].system
            })
        }
        logger.log('', messages)
        return messages
    }
    sys_adminchat.getAdmins = () =>
    {
        const adms = []
        mp.players.forEach(pl =>
        {
            if(user.isAdmin(pl)) adms.push([ user.getName(pl), `${CONFIG_ADM.minNames[user.getAdminLvl(pl)]} (${user.getAdminLvl(pl)} лвл)`, user.getAdminLvl(pl) ])
        })

        return adms
    }

    module.exports = sys_adminchat
}
catch(e)
{
    logger.error('systems/adminchat', e)
}
