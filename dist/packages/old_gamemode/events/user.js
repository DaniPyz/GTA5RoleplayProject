const logger = require('../modules/logger')
try {
    const sha256 = require('js-sha256')

    const mysql = require('../plugins/mysql')

    const user = require('../user')
    const chat = require('../chat')

    const container = require('../modules/container')
    const logs = require('../modules/logs')
    const func = require('../modules/func')
    const sys_works_cab = require('../systems/works/cab')

    const sys_report = require('../systems/report')
    const sys_adminchat = require('../systems/adminchat')
    const sys_npc = require('../systems/npc')

    const { addKey } = require('../modules/keys')
    const { commands, addCommand } = require('../modules/commands')

    const CONFIG_UIFAQ = require('../configs/CONFIG_UIFAQ.json')
    const CONFIG_ADMCMD = require('../configs/CONFIG_ADMCMD.json')
    const CONFIG_ADMTP = require('../configs/CONFIG_ADMTP.json')
    const CONFIG_ADM = require('../configs/CONFIG_ADM.json')
    const CONFIG_ENUMS = require('../configs/CONFIG_ENUMS.json')

    require('./user/adminmenu')
    require('./user/menu')
    require('./user/_keys')
    require('./user/inventory')
    require('./user/phone')
    require('./user/fraction')


    mp.events.add({
        "client::user:setVW": (player, vw) => {
            player.dimension = vw
        },
        "client::user:kick": (player, reason) => {
            user.kick(player, reason)
        },
        "client::user:setPos": (player, x, y, z, a, vw) => {
            user.setPos(player, x, y, z, a, vw)
        },

        "client::user:join": player => {
            container.delete('user', player.id)

            container.set('user', player.id, 'id', player.id)
            container.set('user', player.id, 'username', player.name)
            container.set('user', player.id, 'logged', false)
            player.call('server::user:isReadyConnection')
            mp.players.forEach(pl => user.updateHud(pl))
        },

        "client::user:createAccount": (player, data) => {
            data = JSON.parse(data)
            mysql.query(`select id from users where username = ?`, [data.login], (err, res) => {
                if (err) return logger.error('client::user:createAccount', err)
                if (res.length) return player.call('server::reg', [{
                    error: 'Данный ник уже занят. Придумайте другой'
                }])

                player.call('server::reg', [{
                    saveme: data.saveme === false ? false : { login: data.login, password: data.password }
                }])
                user.createAccount(player, data.login, data.password, data.email, data.promo)
            })
        },
        "client::user:loginAccount": (player, data) => {
            data = JSON.parse(data)
            mysql.query(`select id, password from users where username = ?`, [data.login], (err, res) => {
                if (err) {
                    player.call('server::reg', [{
                        error: `Ошибка MySQL: ${err}`
                    }])
                    return logger.error('client::user:loginAccount', err)
                }
                if (!res.length) return player.call('server::reg', [{
                    error: 'Аккаунта с данным ником не найдено'
                }])

                if (res[0]['password'] !== sha256(data.password)) return player.call('server::reg', [{
                    error: 'Не верный пароль! Повторите попытку'
                }])

                player.call('server::reg', [{
                    saveme: data.saveme === false ? false : { login: data.login, password: data.password }
                }])
                user.loadAccount(player, res[0]['id'])
            })
        },


        "client::user:buyCharClot": player => {
            user.notify(player, 'Пока не доступно', 'error')
            // container.set('user', player.id, 'user_buy_slots_chars', [1])
            // user.choiceChar(player)
            //
            // mysql.query(`update users set buy_slots_chars = ? where id = ?`, JSON.stringify(container.get('user', player.id, 'user_buy_slots_chars')), user.getID(player))
        },
        "client::user:selectChar": (player, charid) => {
            user.loadCharacter(player, charid)
            logger.log('user.join', container.getAll('user', player.id))
            player.call('server::ui:selectchat:hide')
        },
        "client::user:createChar": player => {
            user.createCharacter(player)
            player.call('server::ui:selectchat:hide')
        },

        "client::user:editCharacter": (player, data) => {
            data = JSON.parse(data)
            logger.debug('client::user:editCharacter', data)

            mysql.query(`select id from characters where name = ?`, [JSON.stringify(data.name)], (err, res) => {
                if (err) return logger.error('client::user:editCharacter', err)
                if (res.length) return user.notify(player, 'Данное Имя и Фамилия уже занято. Придумайте другое', 'error')

                container.set('user', player.id, 'char_skin', data.skin)
                if (container.get('user', player.id, 'char_createchar') === 1) {
                    container.set('user', player.id, 'char_name', data.name)
                    container.set('user', player.id, 'char_age', data.age)
                    container.set('user', player.id, 'char_gender', data.gender)

                    data.clothes.forEach(item => user.setClothes(player, item, true))
                }

                player.call('server::ui:createchar:hide')
                container.set('user', player.id, 'char_createchar', 0)

                user.save(player)
                user.spawn(player)
            })
        },
        "client::user:createchar:updategender": (player, gender) => {
            container.set('user', player.id, 'char_gender', gender)
        },

        "client::user:sendChatMessage": (player, data) => {
            data = JSON.parse(data)
            switch (data.chatID) {
                case 'IC':
                    {
                        chat.radius(player, `${user.getCharName(player)}[${player.id}]: ${data.text}`, 'white')
                        break
                    }
                case 'OOC':
                    {
                        chat.radius(player, `(( ${user.getCharName(player)}[${player.id}]: ${data.text} ))`, 'white')
                        break
                    }
            }

            user.updateQuests(player, 'testquest', 1, "+")
        },
        "client::user:enterCommand": (player, command, argsStr, args) => {
            if (commands[command]) commands[command](player, argsStr, JSON.parse(args), {
                admin: user.getAdminLvl(player),
                adminLogged: user.isAdminLogged(player)
            })
            else user.notify(player, 'Такой команды не существует', 'error')
        },

        "client::user:trackQuest": (player, id) => {
            const quest = user.getQuestTraking(player)

            if (quest && quest.id === id) user.removeQuestTraking(player)
            else user.setQuestTraking(player, id)

            mp.events.call('client::user:menu:openMenu', player, 'quests')
        },
        "client::user:compilQuest": (player, id) => {
            const quest = user.getQuests(player, id)
            if (quest.status !== true) return user.notify(player, 'Вы еще не выполнили данный квест', 'error')

            user.questPrize(player, id)
            user.removeQuest(player, id)

            mp.events.call('client::user:menu:openMenu', player, 'quests')
        },


        'client::user:npcdialogCallback': (player, id, btn) => {
            player._npcDialogCallback(id, btn)
        },


        "client::user:addVoiceListener": (player, target) => {
            player.enableVoiceTo(target)
        },
        "client::user:removeVoiceListener": (player, target) => {
            player.disableVoiceTo(target)
        },

        "client::user:return:getAuthSave": (player, status) => {
            container.set('user', player.id, '_authSaveStatus', status)
        },

        "client::user:resetSkin": (player, settings, gender) => {
            user.resetSkin(player, gender, JSON.parse(settings))
        },
        "client::user:setClothes": (player, clothes, save) => {
            if (func.isJSON(clothes)) clothes = JSON.parse(clothes)
            user.setClothes(player, clothes, save)
        },

        "client::user:dialogClick": (player, btn, type) => {
            
                

           
                player._onClickDialog(player, btn, type)
          

        },

        "client::user:deathSuccess": player => {
            if (!container.get('user', player.id, '_death')) return user.kick(player)
            user.spawn(player)
        },
        "client::user:deathClick": (player, status, timer) => {
            logger.log('', status, timer)
            if (!container.get('user', player.id, '_death')) return user.kick(player)

            if (!status) {
                if (timer >= 120000) return user.notify(player, 'Вы сможете уйти на тот свет после 2х минут таймера', 'error')
                user.spawn(player)
            }
            else user.notify(player, 'В разработке, пока не появится система фракций и медики :)', 'warning')
        },
        'client::playerCreateWaypoint': (player, positionX, postionY, positionZ) => {
           
            logger.log(positionX, postionY, positionZ)
            sys_works_cab.shareWayPointToDriver(player, positionX, postionY, positionZ)

        }
    })
}
catch (e) {
    logger.error('events - user.js', e)
}
