const logger = require('./modules/logger')
try {
    const user = require('./user')
    const func = require('./modules/func')

    const chat = {}

    chat.local = (player, text, color = 'white', type = '') => {
        user.uiSend(player, 'client::hud', 'addChatMessage', {
            text,
            color,
            type
        })
    }
    chat.radius = (player, text, color) => {
        mp.players.forEach(pl => {
            if (user.isLogged(pl) === true
                && func.distance2D(player.position, pl.position) < 30) chat.local(pl, text, color)
        })
    }


    chat.error = (player, text) => {
        if (user.isOpened(player, 'adminmenu')) user.uiSend(player, 'client::admin', 'addNotf', {
            type: 'error',
            text
        })
        else chat.local(player, `[ Ошибка ] {#ffffff}${text}`, '#e76969')
    }
    chat.success = (player, text) => {
        if (user.isOpened(player, 'adminmenu')) user.uiSend(player, 'client::admin', 'addNotf', {
            type: 'success',
            text
        })
        else chat.local(player, `[ Успешно ] {#ffffff}${text}`, '#e27979')
    }
    chat.cmd = (player, text) => {
        if (user.isOpened(player, 'adminmenu')) user.uiSend(player, 'client::admin', 'addNotf', {
            type: 'error',
            text
        })
        else chat.local(player, `Используйте: ${text}`, 'silver')
    }

    chat.me = (player, text, showNick = true, color = '#db70d3') => {
        chat.radius(player, `${showNick ? `${user.getCharName(player)}[${player.id}],`: ''}  ${text}`, color)
    }

    chat.admin = (color, text, type) => {
        mp.players.forEach(pl => {
            if (user.isLogged(pl)
                && user.isAdmin(pl)) chat.local(pl, text, color, type)
        })
    }
    chat.cab = (text) => {
        mp.players.forEach(pl => {
            if (user.isWorkingAtIdWork(pl, 2)  ) chat.me(pl, text, false, 'orange')
           
        })
    }

    module.exports = chat
}
catch (e) {
    logger.error('chat', e)
}
