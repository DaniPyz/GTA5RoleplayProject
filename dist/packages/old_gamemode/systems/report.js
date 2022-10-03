const logger = require('../modules/logger')
try
{
    const container = require('../modules/container')
    const mysql = require('../plugins/mysql')
    const user = require('../user')
    const chat = require('../chat')

    const CONFIG_ADM = require('../configs/CONFIG_ADM.json')

    const func = require('../modules/func')
    const sys_adminchat = require('./adminchat')

    const sys_report = {}

    sys_report.create = (player, message) =>
    {
        const free = container.free('reports')

        container.set('reports', free, 'creator', player)
        container.set('reports', free, 'creator_uid', user.charID(player))
        container.set('reports', free, 'status', 0)
        container.set('reports', free, 'messages', [
            { type: 'player', name: user.getCharName(player), date: func.convertToMoscowDate(new Date()), text: message }
        ])

        sys_adminchat.addMessageSystem(`[ РЕПОРТ ] #${free} от ${user.getCharName(player)}`, '#cb5656')
        mp.players.forEach(pl =>
        {
            if(user.isOpened(pl, 'adminmenu')) user.uiSend(pl, 'client::admin', 'updateReports', sys_report.getForAdmin())
        })
    }
    sys_report.delete = id =>
    {
        container.delete('reports', id)
        mp.players.forEach(pl =>
        {
            if(user.isOpened(pl, 'adminmenu')) user.uiSend(pl, 'client::admin', 'updateReports', sys_report.getForAdmin())
        })
    }
    sys_report.addMessage = (id, message, isAdmin = false) =>
    {
        const messages = container.get('reports', id, 'messages')

        messages.push(message)
        container.set('reports', id, 'messages', messages)

        mp.players.forEach(pl =>
        {
            if(user.isOpened(pl, 'adminmenu')) user.uiSend(pl, 'client::admin', 'updateReports', sys_report.getForAdmin())
        })

        if(user.isOpened(container.get('reports', id, 'creator'), 'mainmenu')) user.uiSend(container.get('reports', id, 'creator'), 'client::menu', 'updateReports', sys_report.getForPlayer(container.get('reports', id, 'creator')))
        if(isAdmin) user.notify(container.get('reports', id, 'creator'), `Администратор ответил на Ваш репорт #${id}`)
    }

    sys_report.getForAdmin = () =>
    {
        const reports = []

        for(var key in container.all('reports'))
        {
            if(container.all('reports')[key].status !== 2) reports.push({
                id: parseInt(key), creator: container.all('reports')[key].creator, name: `Репорт #${key}`, desc: container.all('reports')[key].messages[0].text, status: container.all('reports')[key].status, date: new Date(container.all('reports')[key].messages[0].date), messages: container.all('reports')[key].messages
            })
        }
        return reports
    }
    sys_report.getForPlayer = player =>
    {
        const reports = []

        for(var key in container.all('reports'))
        {
            if(container.all('reports')[key].creator_uid === user.charID(player)) reports.push({
                id: parseInt(key), name: `Репорт #${key}`, desc: container.all('reports')[key].messages[0].text, status: container.all('reports')[key].status, date: new Date(container.all('reports')[key].messages[0].date), messages: container.all('reports')[key].messages
            })
        }

        return reports
    }

    module.exports = sys_report
}
catch(e)
{
    logger.error('systems/report', e)
}
