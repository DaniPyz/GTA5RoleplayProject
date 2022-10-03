const logger = require('../../modules/logger')
try
{
    const sha256 = require('js-sha256')

    const mysql = require('../../plugins/mysql')

    const user = require('../../user')
    const chat = require('../../chat')

    const container = require('../../modules/container')
    const logs = require('../../modules/logs')
    const func = require('../../modules/func')

    const sys_report = require('../../systems/report')
    const sys_adminchat = require('../../systems/adminchat')
    const sys_npc = require('../../systems/npc')

    const { addKey } = require('../../modules/keys')
    const { commands, addCommand } = require('../../modules/commands')

    const CONFIG_UIFAQ = require('../../configs/CONFIG_UIFAQ.json')
    const CONFIG_ADMCMD = require('../../configs/CONFIG_ADMCMD.json')
    const CONFIG_ADMTP = require('../../configs/CONFIG_ADMTP.json')
    const CONFIG_ADM = require('../../configs/CONFIG_ADM.json')
    const CONFIG_ENUMS = require('../../configs/CONFIG_ENUMS.json')
    const CONFIG_DONATE = require('../../configs/CONFIG_DONATE.json')

    mp.events.add({
        "client::user:menu:openMenu": (player, id) =>
        {
            if(container.get('user', player.id, '_roulleteGo') === true)return user.notify(player, 'Дождитесь окончания рулетки', 'error')
            user.uiSend(player, 'client::menu', 'setDonateCount', {
                count: user.getDonate(player)
            })

            switch(id)
            {
                case 'stats':
                {
                    user.uiSend(player, 'client::menu', 'openMenu', {
                        id: 'stats',
                        data: {
                            level: [user.getLevel(player),user.getExp(player),user.nextLevelToExp(player)],
                            createDate: new Date(container.get('user', player.id, 'char_birthday')),
                            vip: 0,
                            gender: user.getGender(player),
                            married: 'None',
                            phone: 0,
                            cash: [user.getCash(player),user.getBankCash(player)],
                            job: 'Отсутсвует',
                            frac: user.getFraction(player)[1] !== undefined ? user.getFraction(player)[1] : 'Отсутствует',
                            warns: 0,
                            property: [],
                            charName: user.getCharName(player),
                            userName: container.get('user', player.id, 'user_name'),
                            userID: container.get('user', player.id, 'user_id')
                        }
                    })
                    break
                }
                case 'skills':
                {
                    user.uiSend(player, 'client::menu', 'openMenu', {
                        id: 'skills',
                        data: [0,0,0,0]
                    })
                    break
                }
                case 'faq':
                {
                    user.uiSend(player, 'client::menu', 'openMenu', {
                        id: 'faq',
                        data: CONFIG_UIFAQ
                    })
                    break
                }
                case 'report':
                {
                    user.uiSend(player, 'client::menu', 'openMenu', {
                        id: 'report',
                        data: sys_report.getForPlayer(player)
                    })
                    break
                }
                case 'quests':
                {
                    const quests = user.getQuests(player)
                    let returnQuests = []

                    for(var key in quests)
                    {
                        let prize = ''
                        for(var i in quests[key].prize)
                        {
                            prize += ' '

                            if(i === 'money') prize += `$${quests[key].prize[i].toLocaleString()}`
                            else prize += `Неизвестно ${quests[key].prize[i]}`
                        }

                        returnQuests.push({
                            id: key,
                            name: quests[key].name,
                            desc: quests[key].desc,
                            prize: prize,
                            status: quests[key].status,
                            traking: quests[key].traking,
                            tasks: quests[key].tasks
                        })
                    }

                    user.uiSend(player, 'client::menu', 'openMenu', {
                        id: 'quests',
                        data: returnQuests
                    })
                    break
                }
                case 'rewards':
                {
                    user.uiSend(player, 'client::menu', 'openMenu', {
                        id: 'rewards',
                        data: []
                    })
                    break
                }
                case 'settings':
                {
                    user.uiSend(player, 'client::menu', 'openMenu', {
                        id: 'settings',
                        data: [
                            { name: "Сохранять авторизацию", desc: "Сохранять ник и пароль при авторизации", status: container.get('user', player.id, '_authSaveStatus'), id: "_authSaveStatus" },
                            { name: "Предложение обмена", desc: "Могут ли игроки предлогать Вам обмен предметами", status: user.getSettings(player, 'trade_privacy'), id: "trade_privacy" }
                        ]
                    })
                    break
                }
                case 'settings-interface':
                {
                    user.uiSend(player, 'client::menu', 'openMenu', {
                        id: 'settings-interface',
                        data: [
                            { name: "Показывать подсказки", desc: "Показывать подсказываемые клавиши в худе", status: user.getSettings(player, 'hud_toggleHint'), id: "hud_toggleHint" },
                            // { name: "Включить худ", desc: "Показывать худ в игре", status: user.getSettings(player, 'hud_toggle'), id: "hud_toggle" },
                            { name: "Выбор чата", desc: "Показывать выбор чата при его открытии", status: user.getSettings(player, 'hud_toggleChatChoice'), id: "hud_toggleChatChoice" }
                        ]
                    })
                    break
                }
                case 'settings-aim':
                {
                    user.uiSend(player, 'client::menu', 'openMenu', {
                        id: 'settings-aim',
                        data: { type: 'point', size: 5, height: 5, saveds: 3 }
                    })
                    break
                }
                case 'settings-promo':
                {
                    user.uiSend(player, 'client::menu', 'openMenu', {
                        id: 'settings-promo',
                        data: { promo: '', players: 0, level: "0000", bonuse: [
                            { name: "Игровая валюта", count: 0 }
                        ] }
                    })
                    break
                }
                case 'settings-keys':
                {
                    const keys = []
                    for(var key in container.get('user', player.id, 'user_keysSettings'))
                    {
                        if(user.getAdminLvl(player) >= container.get('user', player.id, 'user_keysSettings')[key].isAdmin
                            && !container.get('user', player.id, 'user_keysSettings')[key].noChange) keys.push({
                            name: container.get('user', player.id, 'user_keysSettings')[key].name,
                            desc: container.get('user', player.id, 'user_keysSettings')[key].desc,
                            key: container.get('user', player.id, 'user_keysSettings')[key].key,
                            keyCode: container.get('user', player.id, 'user_keysSettings')[key].keyCode,
                            id: key
                        })
                    }

                    user.uiSend(player, 'client::menu', 'openMenu', {
                        id: 'settings-keys',
                        data: keys
                    })
                    break
                }
                case 'donate':
                {
                    user.refreshRoulletePrize(player)
                    user.uiSend(player, 'client::menu', 'openMenu', {
                        id: 'donate',
                        data: {
                            prizes: CONFIG_DONATE.roullete,
                            roullete: container.get('user', player.id, 'char_donateRoullete').data
                        }
                    })
                    break
                }
                case 'donate-cash':
                {
                    user.uiSend(player, 'client::menu', 'openMenu', {
                        id: 'donate-cash',
                        data: CONFIG_DONATE.cash
                    })
                    break
                }
                case 'donate-vip':
                {
                    user.uiSend(player, 'client::menu', 'openMenu', {
                        id: 'donate-vip',
                        data: CONFIG_DONATE.vip
                    })
                    break
                }
                case 'donate-cars':
                {
                    user.uiSend(player, 'client::menu', 'openMenu', {
                        id: 'donate-cars',
                        data: CONFIG_DONATE.cars
                    })
                    break
                }
                case 'donate-other':
                {
                    user.uiSend(player, 'client::menu', 'openMenu', {
                        id: 'donate-other',
                        data: []
                    })
                    break
                }
            }
        },
        "client::user:menu:updateKeys": (player, key, keyCode, keyName) =>
        {
            const tempKeys = container.get('user', player.id, 'user_keysSettings')

            tempKeys[key].keyCode = keyCode
            tempKeys[key].key = keyName

            container.set('user', player.id, 'user_keysSettings', tempKeys)
            user.save(player)

            player.call('server::user:setKeys', [ tempKeys ])
            mp.events.call('client::user:menu:openMenu', player, 'settings-keys')
        },
        "client::user:menu:updateSettings": (player, data) =>
        {
            data = JSON.parse(data)
            data.forEach(item =>
            {
                if(item.id === '_authSaveStatus')
                {
                    container.set('user', player.id, '_authSaveStatus', item.status)
                    player.call('server::user:setAuthSaveStatus', [ item.status ])
                }
                else if(user.getSettings(player, item.id) !== undefined) user.setSettings(player, item.id, item.status, false)
            })
        },
        'client::user:menu:createReport': (player, message) =>
        {
            if(!message.length)return

            sys_report.create(player, message)
            mp.events.call('client::user:menu:openMenu', player, 'report')
        },
        "client::user:menu:sendReportMessage": (player, id, text) =>
        {
            if(container.get('reports', id, 'status') === undefined
                || container.get('reports', id, 'status') === 2)return

            sys_report.addMessage(id, {
                type: 'player', name: user.getCharName(player), date: func.convertToMoscowDate(new Date()), text
            })
        },
        "client::user:menu:closeReport": (player, id) =>
        {
            if(container.get('reports', id, 'status') === undefined
                || container.get('reports', id, 'status') === 2)return

            container.set('reports', id, 'status', 2)
            mp.players.forEach(pl =>
            {
                if(user.isOpened(pl, 'adminmenu')) user.uiSend(pl, 'client::admin', 'updateReports', sys_report.getForAdmin())
            })
            mp.events.call('client::user:menu:openMenu', player, 'report')
        },

        "client::user:menu:buyCash": (player, id) =>
        {
            if(!CONFIG_DONATE.cash[id])return user.notify(player, 'Данный пак не найден', 'error')
            if(user.getDonate(player) < CONFIG_DONATE.cash[id].price)return user.notify(player, 'У Вас не достаточно GC', 'error')

            user.giveDonate(player, -CONFIG_DONATE.cash[id].price)
            user.giveCash(player, CONFIG_DONATE.cash[id].cash)

            logs.send('user', user.getID(player), `Купил $${CONFIG_DONATE.cash[id].cash.toLocaleString()} за ${CONFIG_DONATE.cash[id].price.toLocaleString()} доната.`)
        },

        "client::user:menu:roullete:go": (player, fast) =>
        {
            if(user.getDonate(player) < 350)return user.notify(player, 'У Вас не достаточно GC', 'error')
            if(container.get('user', player.id, '_roulleteGo') === true)return user.notify(player, 'Дождитесь окончания рулетки', 'error')

            user.refreshRoulletePrize(player)

            user.giveDonate(player, -350, false)
            user.uiSend(player, 'client::menu', 'roulleteGo', {
                fast: fast
            })
            container.set('user', player.id, '_roulleteGo', true)
        },
        "client::user:menu:roullete:stop": (player, id) =>
        {
            if(!container.get('user', player.id, '_roulleteGo'))return

            const items = container.get('user', player.id, 'char_donateRoullete').data
            container.set('user', player.id, '_roulleteGo', false)

            function error()
            {
                user.giveDonate(player, 350, false)
                user.refreshRoulletePrize(player, true)

                return user.notify(player, 'Произошла ошибка с рулеткой. Повторите попытку', 'error')
            }

            if(!items[id]
                || !items[id].item
                || !items[id].item.type
                || items[id].item.count === undefined)return error()

            switch(items[id].item.type)
            {
                case 'cash':
                {
                    user.giveCash(player, items[id].item.count)
                    break
                }
                case 'inventory':
                {
                    if(!user.addInventory(player, items[id].item.count))
                    {
                        user.giveDonate(player, 350, false)
                        return user.notify(player, 'В Вашем инвентаре не достаточно места для нового предмета. 350 GC было возвращено', 'error')
                    }
                    break
                }
                case 'donate':
                {
                    user.giveDonate(player, items[id].item.count)
                    break
                }
                default:
                {
                    return error()
                }
            }

            if(items[id].type === 'legendary') user.refreshRoulletePrize(player, true)
        }
    })
}
catch(e)
{
    logger.erorr('events/user/menu', e)
}
