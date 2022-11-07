const logger = require('./modules/logger')
try {
    const sha256 = require('js-sha256')
    const moment = require('moment')

    const container = require('./modules/container')
    const mysql = require('./plugins/mysql')
    // const chat = require('./chat')

    const func = require('./modules/func')
    const logs = require('./modules/logs')

    const CONFIG_SPAWN = require('./configs/CONFIG_SPAWN.json')
    const CONFIG_CHARDATA = require('./configs/CONFIG_CHARDATA.json')
    const CONFIG_CLOTHES = require('./configs/CONFIG_CLOTHES.json')
    const CONFIG_ACCSETTINGS = require('./configs/CONFIG_ACCSETTINGS.json')
    const CONFIG_ADM = require('./configs/CONFIG_ADM.json')
    const CONFIG_ENUMS = require('./configs/CONFIG_ENUMS.json')
    const CONFIG_INVENTORY = require('./configs/CONFIG_INVENTORY.json')
    const CONFIG_DONATE = require('./configs/CONFIG_DONATE.json')

    const user = {}

    user.loadScreen = (player, status, duration = 500) => {
        player.call('server::user:loadScreen', [status, duration])
    }

    user.setPos = (player, x, y, z, a = -1, vw = -1) => {
        if (a === -1) a = player.heading
        if (vw === -1) vw = player.dimension

        x = parseFloat(x)
        y = parseFloat(y)
        z = parseFloat(z)
        a = parseInt(a)
        vw = parseInt(vw)

        user.loadScreen(player, true)
        setTimeout(() => {
            if (!player.vehicle) player.position = new mp.Vector3(x, y, z)
            else {
                player.vehicle.position = new mp.Vector3(x, y, z)
                player.vehicle.heading = a
                player.vehicle.dimension = vw
            }

            player.heading = a
            player.dimension = vw

            setTimeout(() => {
                user.loadScreen(player, false)
                user.freeze(player, false)
            }, 500)
        }, 500)
    }


    user.createAccount = (player, login, password, email, promo) => {
        if (user.isLogged(player) === true) return

        mysql.query(`insert into users (username, password, email, promo, regIP) values (?, ?, ?, ?, ?)`, [login, sha256(password), email, promo, player.ip], (err, res) => {
            if (err) return logger.error('user.createAccount', err)
            user.loadAccount(player, res.insertId)
        })
    }
    user.loadAccount = (player, id) => {
        if (user.isLogged(player) === true) return

        mysql.query(`select * from users where id = ?`, [id], (err, res) => {
            if (err) return logger.error('user.loadAccount', err)
            if (!res.length) return user.kick(player, "Загружаемый аккаунт не найден")

            try {
                mp.events.call('playerHasLogged', res[0]['id'])
                container.set('user', player.id, 'user_id', res[0]['id'])
                container.set('user', player.id, 'user_name', res[0]['username'])

                container.set('user', player.id, 'user_password', res[0]['password'])
                container.set('user', player.id, 'user_email', res[0]['email'])
                container.set('user', player.id, 'user_password', res[0]['password'])

                container.set('user', player.id, 'user_promo', res[0]['promo'])
                container.set('user', player.id, 'user_buy_slots_chars', JSON.parse(res[0]['buy_slots_chars']))

                container.set('user', player.id, 'user_lastDate', res[0]['lastDate'])
                container.set('user', player.id, 'user_lastIP', res[0]['lastIP'])

                mysql.query('update users set lastIP = ?, lastDate = ? where id = ?', [player.ip, moment(func.convertToMoscowDate(new Date())).format('YYYY-MM-DD hh:mm:ss'), res[0]['id']])

                container.set('user', player.id, 'user_admin', res[0]['admin'])
                container.set('user', player.id, 'user_adminPassword', res[0]['adminPassword'])
                container.set('user', player.id, 'user_adminData', JSON.parse(res[0]['adminData']))
                container.set('user', player.id, 'user_adminBan', res[0]['adminBan'])

                container.set('user', player.id, 'user_keysSettings', JSON.parse(res[0]['keysSettings']))

                container.set('user', player.id, 'user_donate', res[0]['donate'])

                const keyssettings = JSON.parse(res[0]['keysSettings'])
                for (var key in CONFIG_ENUMS.keysSettings) {
                    if (keyssettings[key] === undefined) keyssettings[key] = CONFIG_ENUMS.keysSettings[key]
                }
                container.set('user', player.id, 'user_keysSettings', keyssettings)

                const admdata = JSON.parse(res[0]['adminData'])
                for (var key in CONFIG_ADM.defaultData) {
                    if (admdata[key] === undefined) admdata[key] = CONFIG_ADM.defaultData[key]
                }
                container.set('user', player.id, 'user_adminData', admdata)

                const settingsTemp = JSON.parse(res[0]['settings'])
                for (var key in CONFIG_ACCSETTINGS) {
                    if (settingsTemp[key] === undefined) settingsTemp[key] = CONFIG_ACCSETTINGS[key]
                }
                container.set('user', player.id, 'user_settings', settingsTemp)

                player.call('server::user:updateAccSettings', [settingsTemp])
                player.call('server::user:setAdmin', [user.getAdminLvl(player)])
                player.call('server::user:setAdminLogged', [false])
                player.call('server::user:setKeys', [keyssettings])
                player.call('server::user:setMaxPlayersServer', [mp.config.maxplayers])

                container.set('user', player.id, 'openeds', {})
                container.set('user', player.id, 'nears', {})

                container.set('user', player.id, 'adminlogged', false)
                container.set('user', player.id, 'adminlogintry', 3)

                container.set('user', player.id, '_death', false)

                user.choiceChar(player)
                player.call('server::user:getAuthSave')
            }
            catch (e) {
                logger.error('', e)
            }
        })
    }
    user.loadCharacter = (player, id) => {
        if (user.isLogged(player) === true) return

        mysql.query(`select * from characters where id = ?`, [id], (err, res) => {
            if (err) return logger.error('user.loadCharacter', err)
            if (!res.length) return user.choiceChar(player)

            try {
                CONFIG_CHARDATA.map(item => {
                    container.set('user', player.id, 'char_' + item, func.isJSON(res[0][item]) ? JSON.parse(res[0][item]) : res[0][item])
                })
                container.set('user', player.id, 'logged', true)

                if (!container.get('user', player.id, 'char_inventory').length) {
                    let tempInv = []
                    for (var i = 0; i < 4; i++) tempInv[i] = null

                    container.set('user', player.id, 'char_inventory', tempInv)
                }
                if (!container.get('user', player.id, 'char_backpack').length) {
                    let tempInv = []
                    for (var i = 0; i < 100; i++) tempInv[i] = null

                    container.set('user', player.id, 'char_backpack', tempInv)
                }

                mysql.query('update characters set lastDate = ? where id = ?', [moment(func.convertToMoscowDate(new Date())).format('YYYY-MM-DD hh:mm:ss'), res[0]['id']])

                user.destroyCamera(player)
                user.spawn(player)

                mp.events.call('chat::user:say', player, 'Добро пожаловать на сервер', '#5db43e')
                if (user.isAdmin(player)) mp.events.call('chat::user:say', player, `Вы успешно вошли как {${CONFIG_ADM.colors[user.getAdminLvl(player)]}}${CONFIG_ADM.names[user.getAdminLvl(player)]}`)

                user.addQuest(player, 'testquest', 'Тестовый квест', 'Тестовый квест, выполнить его очень легко', {
                    money: 15000000
                }, [
                    { name: "Введите команду /testquest", count: [0, 1] },
                    { name: "Напишите 2 первых сообщения в чат", count: [0, 2] }
                ])
                mysql.query('update users set online = ?, onlineChar = ?, adminData = ? where id = ?', [player.id, user.charID(player), JSON.stringify(container.get('user', player.id, 'user_adminData')), user.getID(player)], err => {
                    if (err) return logger.error('user.loadCharacter', err)
                })

                player.call('server::other:createPeds', [container.all('npc')])
                player.call('server::user:setLogged', [true])

                logs.send('user', user.getID(player), `Вошел под персонажем ${user.getCharName(player)}. IP: ${player.ip}; LastIP: ${container.get('user', player.id, 'user_lastIP')};`, {
                    charid: user.charID(player),
                    ip: player.ip,
                    lastip: container.get('user', player.id, 'user_lastIP')
                })

                player.setVariable('charName', user.getCharName(player))
                player.setVariable('playerId', player.id)
                player.setVariable('charID', user.charID(player))
                player.setVariable('userName', user.getName(player))
                player.setVariable('userID', user.getID(player))

                player.setVariable('admin', user.getAdminLvl(player))
            }
            catch (e) {
                logger.error('user.loadCharacter', e)
            }
        })
    }

    user.kick = (player, reason = "") => {
        if (reason.length) user.notify(player, reason, 'error', 2000)
        setTimeout(() => player.kick(), 2000)
    }


    user.notify = (player, text, type = 'success', time = 5000) => {
        player.call('server::user:notify', [{
            text,
            type,
            time
        }])
    }


    user.spawn = player => {
        if (user.isLogged(player) === false) return user.kick(player)
        if (container.get('user', player.id, 'char_createchar') !== 0) return user.editCharacter(player)

        if (container.get('user', player.id, '_death') === true) {
            container.set('user', player.id, '_death', false)
            user.uiSend(player, 'client::death', 'closedeath')
        }

        user.freeze(player, false)
        user.destroyCamera(player)

        player.health = 100
        player.armour = 0

        player.clearDecorations()
        user.cursor(player, false)

        user.resetSkin(player)
        user.updateClothes(player)

        user.toggleHud(player, true)
        user.setCash(player, user.getCash(player), user.getBankCash(player))

        const randomSpawn = CONFIG_SPAWN[func.random(0, CONFIG_SPAWN.length - 1)]
        user.setPos(player, randomSpawn[0], randomSpawn[1], randomSpawn[2], randomSpawn[3], randomSpawn[4])

        player.stopAnimation()

        if (user.isOpened(player, 'mainmenu')) {
            if (container.get('user', player.id, '_roulleteGo') === true) {
                container.get('user', player.id, '_roulleteGo', false)
                user.giveDonate(player, 350)
            }

            user.toggleHud(player, true)
            user.cursor(player, false, true)

            user.uiSend(player, 'client::menu', 'toggle', {
                status: false
            })
            user.removeOpened(player, 'mainmenu')
        }
        if (user.isOpened(player, 'adminmenu')) {
            user.toggleHud(player, true)
            user.cursor(player, false, true)

            user.uiSend(player, 'client::admin', 'toggle', {
                status: false
            })
            user.removeOpened(player, 'adminmenu')
        }
        else if (user.isOpened(player, 'inventory')) {
            user.toggleHud(player, true)
            user.cursor(player, false, true)

            user.uiSend(player, 'client::inventory', 'toggle', {
                status: false
            })
            user.removeOpened(player, 'inventory')
        }
        else if (user.isOpened(player, 'phone')) {
            user.cursor(player, false, true)

            user.uiSend(player, 'client::phone', 'toggle', {
                status: false
            })
            user.removeOpened(player, 'phone')
        }

        if (user.getQuestTraking(player)) {
            let tasksTemp = []
            user.getQuestTraking(player).tasks.map((item, i) => {
                return tasksTemp.push({
                    name: item.name,
                    status: item.count[0] >= item.count[1] ? true : false,
                    count: item.count
                })
            })

            player.call('server::user:setquests', [
                {
                    status: true,
                    name: user.getQuestTraking(player).name,
                    tasks: tasksTemp
                }
            ])
            user.updateHud(player)
        }
    }

    user.toggleHud = (player, status) => {
        player.call('server::user:toggleHud', [status])
    }
    user.isLogged = player => {
        return container.get('user', player.id, 'logged')
    }


    user.setCamera = (player, position, atCoord, data = {}) => {
        player.call('server::user:setCamera', [position, atCoord, data])
    }
    user.destroyCamera = (player, data = {}) => {
        player.call('server::user:destroyCamera', [data])
    }
    user.freeze = (player, status) => {
        player.call('server::user:freeze', [status])
    }


    user.choiceChar = player => {
        if (user.isLogged(player) === true) return

        mysql.query(`select id, name, birthday, level, cash, bankcash, fractionId, fractionRank from characters where userid = ?`, [user.getID(player)], (err, res) => {
            if (err) return logger.error('user.choiceChar', err)

            try {

                let chars = []
                res.forEach(item => {
                    chars.push({
                        id: item.id,
                        name: JSON.parse(item.name)[0] + ' ' + JSON.parse(item.name)[1],
                        birthDay: item.birthday,
                        level: item.level,
                        cash: item.cash,
                        frac: item.fractionId !== undefined ? 'Отсутствует' : item.fractionId,
                        bankCash: item.bankcash
                    })
                    // JSON.parse(item.fraction)[1] !== undefined ? JSON.parse(item.fraction)[1] : 
                })
                if (!chars.length) chars.push({})
                if (chars.length === 1
                    && container.get('user', player.id, 'user_buy_slots_chars')[0] === 0) chars.push({
                        buy: true
                    })
                else if (chars.length !== 2) chars.push({})

                player.call('server::user:choiceChar', [chars])
            }
            catch (e) {
                logger.error('user.choiceChar', e)
            }
        })
    }
    user.createCharacter = player => {
        if (user.isLogged(player) === true) return

        mysql.query('insert into characters (userid) values (?)', [user.getID(player)], (err, res) => {
            if (err) return logger.error('user.createCharacter', err)

            user.loadCharacter(player, res.insertId)
        })
    }

    user.editCharacter = player => {
        if (user.isLogged(player) === false) return
        if (container.get('user', player.id, 'char_createchar') === 0) return user.editCharacter(player)

        container.set('user', player.id, 'char_gender', 0)

        user.freeze(player, true)
        user.setPos(player, 436.1955261230469, -993.43701171875, 30.689594268798828, -93.25418853759766, player.id + 1)

        user.resetSkin(player)
        user.setClothes(player)

        player.call('server::user:editCharacter', [container.get('user', player.id, 'char_createchar'), {
            skin: container.get('user', player.id, 'char_skin')
        }])
    }

    user.getID = player => {
        return container.get('user', player.id, 'user_id')

    }
    user.charID = player => {
        return container.get('user', player.id, 'char_id')
    }
    user.getGender = player => {
        return container.get('user', player.id, 'char_gender')
    }


    user.resetSkin = (player, gender = -1, data = null) => {
        if (user.isLogged(player) === false) return
        // { "genetic": { "mother": 0, "father": 0, "similarity": 0.5, "skinTone": 0.5 }, "hair": { "head": 0, "eyebrow": 0, "beard": 0, "breast": 0, "head_color": 0, "eyebrow_color": 0, "beard_color": 0, "breast_color": 0 }, "face": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "appearance": [0, 0, 0, 0, 0, 0, 0, 0, 0] }

        let settings = container.get('user', player.id, 'char_skin')

        if (data !== null) settings = data
        if (gender === -1) gender = user.getGender(player)

        player.setCustomization(gender === 0 ? true : false,
            settings.genetic.mother,
            settings.genetic.father,
            0,

            settings.genetic.mother,
            settings.genetic.father,
            0,

            settings.genetic.similarity,
            settings.genetic.skinTone,
            0,

            settings.appearance[0],
            settings.hair.head_color,

            0,
            settings.face
        )
        player.setClothes(2, settings.hair.head, 0, 0) // Волосы на голове

        player.setHeadOverlay(1, [settings.hair.beard, !settings.hair.beard ? 0.0 : 100.0, settings.hair.beard_color, settings.hair.beard_color]) // Волосы на лице
        player.setHeadOverlay(2, [settings.hair.eyebrow, !settings.hair.eyebrow ? 0.0 : 100.0, settings.hair.eyebrow_color, settings.hair.eyebrow_color]) // Брови
        player.setHeadOverlay(10, [settings.hair.breast, !settings.hair.breast ? 0.0 : 100.0, settings.hair.breast_color, settings.hair.breast_color]) // Волосы на теле

        player.setHeadOverlay(0, [settings.appearance[1], !settings.appearance[1] ? 0 : 100.0, 0, 0]) // Пятна на лице
        player.setHeadOverlay(3, [settings.appearance[2], !settings.appearance[2] ? 0 : 100.0, 0, 0]) // Старение
        player.setHeadOverlay(6, [settings.appearance[3], !settings.appearance[3] ? 0 : 100.0, 0, 0]) // Цвет лица
        player.setHeadOverlay(7, [settings.appearance[4], !settings.appearance[4] ? 0 : 100.0, 0, 0]) // Повреждения кожи
        player.setHeadOverlay(8, [settings.appearance[5], !settings.appearance[5] ? 0.0 : 100.0, settings.appearance[6], 0]) // Губная помада (цвет помады)
        player.setHeadOverlay(9, [settings.appearance[7], !settings.appearance[7] ? 0 : 100.0, 0, 0]) // Родинки
        player.setHeadOverlay(11, [settings.appearance[8], !settings.appearance[8] ? 0 : 100.0, 0, 0]) // Пятна на теле
    }
    user.resetClothes = player => {
        if (user.isLogged(player) === false) return
        user.setClothes(player)
    }
    user.setClothes = (player, clothes = 'none', save = false) => {
        if (user.isLogged(player) === false) return

        if (typeof clothes === 'string') clothes = user.getClothes(player, clothes)
        for (var key in clothes) player.setClothes(CONFIG_ENUMS.clothesComponentID[key], clothes[key], 0, 0)

        if (save) {
            const saveClothes = container.get('user', player.id, 'char_clothes')
            for (var key in clothes) saveClothes[key] = clothes[key]

            container.set('user', player.id, 'char_clothes', saveClothes)
            user.save(player)
        }
    }
    user.updateClothes = player => {
        const clothes = { ...container.get('user', player.id, 'char_clothes') }
        if (!clothes.bags) clothes.bags = 0

        if (container.get('user', player.id, 'char_backpackStatus') !== 0
            && clothes.bags === 0) {
            if (CONFIG_INVENTORY[container.get('user', player.id, 'char_backpackStatus')]) clothes.bags = CONFIG_INVENTORY[container.get('user', player.id, 'char_backpackStatus')].bags
            else container.get('user', player.id, 'char_backpackStatus', 0)
        }

        user.setClothes(player, clothes, false)
    }

    user.getClothes = (player, clothes) => {
        if (user.isLogged(player) === false
            || !CONFIG_CLOTHES[clothes]) return {}

        return CONFIG_CLOTHES[clothes][user.getGender(player)]
    }

    user.uiSend = (player, eventname, cmd, data) => {
        player.call('server::ui:send', [eventname, cmd, data])
    }
    user.cursor = (player, status, toggleESC = null) => {
        player.call('server::user:cursor', [status, toggleESC])
    }

    user.getCharName = (player, obj = false) => {
        if (obj === true) return container.get('user', player.id, 'char_name')
        return container.get('user', player.id, 'char_name')[0] + ' ' + container.get('user', player.id, 'char_name')[1]
    }
    user.getName = player => {
        return container.get('user', player.id, 'user_name')
    }

    user.save = player => {
        if (user.isLogged(player) === false) return

        try {
            let query = 'update characters set '
            const args = []

            // Сохранение персонажа
            CONFIG_CHARDATA.forEach((item, i) => {
                if (item !== 'id' && item !== 'birthday') {
                    query += `${item} = ?`
                    if (item === 'lastDate') {
                        let date = new Date(container.get('user', player.id, 'char_' + item))
                        args.push(moment(date).format('YYYY-MM-DD hh:mm:ss'))
                    }
                    else {
                        if (typeof container.get('user', player.id, 'char_' + item) === 'object') args.push(JSON.stringify(container.get('user', player.id, 'char_' + item)).replace("\\", ""))
                        else if (typeof container.get('user', player.id, 'char_' + item) === 'string') args.push(container.get('user', player.id, 'char_' + item).replace('"', ''))
                        else args.push(container.get('user', player.id, 'char_' + item))
                    }

                    if (i === CONFIG_CHARDATA.length - 1) query += ' '
                    else query += ', '
                }
            })

            query += `where id = ?`
            args.push(container.get('user', player.id, 'char_id'))

            // logger.debug('user.save', {
            // 	message: query,
            // 	args: args
            // })
            mysql.query(query, args, err => {
                if (err) return logger.error('user.save', err)
            })

            // Сохранение аккаута
            mysql.query(`update users set username = ?, password = ?, email = ?, promo = ?, buy_slots_chars = ?, settings = ?,
                admin = ?, adminPassword = ?, adminBan = ?, adminData = ?, keysSettings = ?, donate = ? where id = ?`, [
                container.get('user', player.id, 'user_name'),
                container.get('user', player.id, 'user_password'),
                container.get('user', player.id, 'user_email'),
                container.get('user', player.id, 'user_promo'),
                JSON.stringify(container.get('user', player.id, 'user_buy_slots_chars')),
                JSON.stringify(container.get('user', player.id, 'user_settings')),
                container.get('user', player.id, 'user_admin'),
                container.get('user', player.id, 'user_adminPassword'),
                container.get('user', player.id, 'user_adminBan'),
                JSON.stringify(container.get('user', player.id, 'user_adminData')),
                JSON.stringify(container.get('user', player.id, 'user_keysSettings')),
                container.get('user', player.id, 'user_donate'),
                container.get('user', player.id, 'user_id')
            ], err => {
                if (err) return logger.error('user.save', err)
            })
        }
        catch (e) {
            logger.error('user.save', e)
        }
    }


    user.getSettings = (player, name) => {
        return container.get('user', player.id, 'user_settings')[name]
    }
    user.setSettings = (player, name, param, updateHud = true) => {
        const settings = container.get('user', player.id, 'user_settings')
        settings[name] = param

        container.set('user', player.id, 'user_settings', settings)
        user.save(player)

        player.call('server::user:updateAccSettings', [settings, updateHud])
    }
    user.setFraction = (player, fractionId, fractionName, fractionRank, updateHud = true) => {


        container.set('user', player.id, 'char_fraction', [fractionId, fractionName, fractionRank])




        user.save(player)


    }
    user.removeFraction = (player) => {
        container.set('user', player.id, 'char_fraction', [])
        user.save(player)

    }
    user.getFraction = player => {
        return container.get('user', player.id, 'char_fraction')
    }


    user.getOpened = player => {
        return container.get('user', player.id, 'openeds')
    }
    user.isOpened = (player, name) => {
        return container.get('user', player.id, 'openeds')[name]
    }
    user.isOnFoot = player => {
        if (container.get('user', player.id, '_death') === true) return false
        return JSON.stringify(container.get('user', player.id, 'openeds')) === '{}'
    }
    user.addOpened = (player, name) => {
        const openeds = container.get('user', player.id, 'openeds')

        openeds[name] = true
        container.set('user', player.id, 'openeds', openeds)
    }
    user.removeOpened = (player, name) => {
        const openeds = container.get('user', player.id, 'openeds')

        delete openeds[name]
        container.set('user', player.id, 'openeds', openeds)
    }

    user.updateHud = (player, changedata) => {

        player.call('server::user:updateHud', [changedata])
    }


    user.setCash = (player, cash, bankcash = -1) => {
        if (!user.isLogged(player)) return

        cash = parseInt(cash)
        if (bankcash !== -1) bankcash = parseInt(bankcash)

        container.set('user', player.id, 'char_cash', cash)
        if (bankcash !== -1) container.set('user', player.id, 'char_bankcash', bankcash)

        player.call('server::user:setcash', [[user.getCash(player), user.getBankCash(player)]])

        user.updateHud(player)
        user.save(player)
    }

    user.giveCash = (player, cash) => {
        if (!user.isLogged(player)
            || cash === 0) return

        cash = parseInt(cash)
        container.set('user', player.id, 'char_cash', user.getCash(player) + cash)

        if (cash > 0) user.notify(player, `+ $${cash.toLocaleString()}`, 'cash')
        else user.notify(player, `$${cash.toLocaleString()}`, 'cash')

        player.call('server::user:setcash', [[user.getCash(player), user.getBankCash(player)]])

        user.updateHud(player)
        user.save(player)
    }
    user.removeCash = (player, cash) => {
        if (!user.isLogged(player)
            || cash === 0) return

        cash = parseInt(cash)
        container.set('user', player.id, 'char_cash', user.getCash(player) - cash)

        if (cash > 0) user.notify(player, `- $${cash.toLocaleString()}`, 'cash')
        else user.notify(player, `$${cash.toLocaleString()}`, 'cash')

        player.call('server::user:setcash', [[user.getCash(player), user.getBankCash(player)]])

        user.updateHud(player)
        user.save(player)
    }
    user.giveBankCash = (player, cash) => {
        if (!user.isLogged(player)
            || cash === 0) return

        cash = parseInt(cash)
        container.set('user', player.id, 'char_bankcash', user.getBankCash(player) + cash)

        if (cash > 0) user.notify(player, `+ $${cash.toLocaleString()}`, 'bankcash')
        else user.notify(player, `$${cash.toLocaleString()}`, 'bankcash')

        player.call('server::user:setcash', [[user.getCash(player), user.getBankCash(player)]])

        user.updateHud(player)
        user.save(player)
    }

    user.getCash = player => {
        return parseInt(container.get('user', player.id, 'char_cash'))
    }
    user.getBankCash = player => {
        return parseInt(container.get('user', player.id, 'char_bankcash'))
    }

    user.getLevel = player => {
        return parseInt(container.get('user', player.id, 'char_level'))
    }
    user.getExp = player => {
        return parseInt(container.get('user', player.id, 'char_exp'))
    }
    user.nextLevelToExp = player => {
        return (user.getLevel(player) + 1) * 4
    }

    // {
    //     "questID": {
    //         name: "",
    //         desc: "",
    //         prize: {
    //             money: "650",
    //             donate: "650"
    //         },
    //         status: false,
    //         traking: false,
    //         tasks: [
    //             { name: "", count: [ 0, 15 ] }
    //         ]
    //     }
    // }

    user.addQuest = (player, questID, questName, questDesc, prize, tasks) => {
        if (!user.isLogged(player)) return

        let questTemp = user.getQuests(player)
        if (questTemp[questID]) return -1

        if (user.isOldQuests(player, questID)) return -2

        questTemp[questID] = {
            name: questName,
            desc: questDesc,
            prize: prize,
            status: false,
            traking: false,
            tasks: tasks
        }
        container.set('user', player.id, 'char_quests', questTemp)

        if (!user.getQuestTraking(player)) user.setQuestTraking(player, questID)
        else user.notify(player, 'Добавлен новый квест, проверьте его в меню')

        user.save(player)
    }
    user.updateQuests = (player, questID, tasksID, count) => {
        if (!user.isLogged(player)) return
        let questTemp = user.getQuests(player)

        if (!questTemp[questID]
            || questTemp[questID].tasks.length < tasksID || tasksID < 0) return
        if (questTemp[questID].status !== false) return

        if (count === "+") questTemp[questID].tasks[tasksID].count[0]++
        else questTemp[questID].tasks[tasksID].count[0] = count

        let status = 0
        questTemp[questID].tasks.forEach(item => {
            if (item.count[0] >= item.count[1]) status++
        })

        if (status >= questTemp[questID].tasks.length) {
            questTemp[questID].status = true
            user.notify(player, `Вы выполнили квест << ${questTemp[questID].name} >>. Забрать награду можно в меню`, 'warning')
        }
        else user.notify(player, `Вы выполнили задание << ${questTemp[questID].tasks[tasksID].name} >> из квеста << ${questTemp[questID].name} >>`, 'warning')

        container.set('user', player.id, 'char_quests', questTemp)
        user.save(player)

        if (user.getQuestTraking(player) && user.getQuestTraking(player).id === questID) {
            let tasksTemp = []
            questTemp[questID].tasks.map((item, i) => {
                return tasksTemp.push({
                    name: item.name,
                    status: item.count[0] >= item.count[1] ? true : false,
                    count: item.count
                })
            })

            player.call('server::user:setquests', [
                {
                    status: true,
                    name: questTemp[questID].name,
                    tasks: tasksTemp
                }
            ])
            user.updateHud(player)
        }
    }
    user.removeQuest = (player, questID) => {
        if (!user.isLogged(player)) return

        let questTemp = user.getQuests(player)
        if (!questTemp[questID]) return

        if (user.getQuestTraking(player) && user.getQuestTraking(player).id === questID) user.removeQuestTraking(player)

        delete questTemp[questID]
        container.set('user', player.id, 'char_quests', questTemp)

        questTemp = container.get('user', player.id, 'char_questsOld')

        if (questTemp.indexOf(questID) === -1) questTemp.push(questID)
        container.set('user', player.id, 'char_questsOld', questTemp)

        user.save(player)
    }
    user.questPrize = (player, questID) => {
        if (!user.isLogged(player)) return

        let quest = user.getQuests(player, questID)
        if (!quest) return

        for (var key in quest.prize) {
            switch (key) {
                case 'money':
                    {
                        user.giveCash(player, quest.prize[key])
                        break
                    }
            }
        }
    }
    user.getQuests = (player, questID) => {
        if (!user.isLogged(player)) return

        if (questID) return container.get('user', player.id, 'char_quests')[questID]
        return container.get('user', player.id, 'char_quests')
    }
    user.getQuestTraking = player => {
        if (!user.isLogged(player)) return

        let quests = user.getQuests(player)
        let traking = undefined

        for (var i in quests) {
            if (quests[i].traking === true) {
                traking = quests[i]
                traking.id = i
            }
        }
        return traking
    }
    user.setQuestTraking = (player, questID) => {
        if (!user.isLogged(player)) return
        if (!user.getQuests(player, questID)) return

        if (user.getQuestTraking(player)) user.removeQuestTraking(player)

        let quests = user.getQuests(player)
        quests[questID].traking = true
        container.set('user', player.id, 'char_quests', quests)

        user.save(player)

        let tasksTemp = []
        quests[questID].tasks.map((item, i) => {
            return tasksTemp.push({
                name: item.name,
                status: item.count[0] >= item.count[1] ? true : false,
                count: item.count
            })
        })

        player.call('server::user:setquests', [
            {
                status: true,
                name: quests[questID].name,
                tasks: tasksTemp
            }
        ])
        user.updateHud(player)
    }
    user.removeQuestTraking = player => {
        if (!user.isLogged(player)) return

        let quests = user.getQuests(player)
        for (var i in quests) quests[i].traking = false

        container.set('user', player.id, 'char_quests', quests)
        user.save(player)

        player.call('server::user:setquests', [
            {
                status: false,
                name: '',
                tasks: []
            }
        ])
        user.updateHud(player)
    }
    user.isOldQuests = (player, questID) => {
        if (!user.isLogged(player)) return

        if (container.get('user', player.id, 'char_questsOld').indexOf(questID) !== -1) return true
        return false
    }

    user.toggleActionText = (player, toggle, keyName = "E", message = "Нажмите для взаимодействия") => {
        player.call('server::user:toggleActionText', [
            toggle,
            keyName,
            message
        ])
    }


    user.isAdmin = (player, lvl = 1) => {
        return user.getAdminLvl(player) >= lvl
    }
    user.getAdminLvl = player => {
        return parseInt(container.get('user', player.id, 'user_admin'))
    }
    user.isAdminLogged = player => {
        return container.get('user', player.id, 'adminlogged')
    }
    user.returnAdminName = (player, min = false) => {
        if (min) return CONFIG_ADM.minNames[user.getAdminLvl(player)]
        return CONFIG_ADM.names[user.getAdminLvl(player)]
    }

    user.isAdminLoggedText = (player, lvl) => {
        if (!user.isAdmin(player, lvl)) return false
        if (!user.isAdminLogged(player)) {
            user.notify(player, 'Вы должны авторизоваться в админ панели', 'error')
            return false
        }

        return true
    }

    user.isAdminCorrect = player => {
        if (!user.isLogged(player)) return false

        if (func.getSubnet(container.get('user', player.id, 'user_lastIP')) !== func.getSubnet(player.ip)) return false
        return true
    }
    user.adminBan = player => {
        if (!user.isLogged(player)) return
        if (container.get('user', player.id, 'user_adminBan') === 1) return

        container.set('user', player.id, 'user_adminBan', 1)
        container.set('user', player.id, 'adminlogintry', 3)
        container.set('user', player.id, 'adminlogged', false)

        player.call('server::user:setAdminLogged', [false])
        user.save(player)

        mp.events.call('client::user:admin:openMenu', player, 'loginError')
        mp.events.call('other::adminchat:addMessageSystem', `${user.returnAdminName(player)} ${user.getName(player)}[${player.id}] был заблокирован в системе администрирования.`, '#ee7272')

        if (!user.isOpened(player, 'adminmenu')) {
            user.uiSend(player, 'client::admin', 'toggle', {
                status: true
            })
            user.uiSend(player, 'client::admin', 'mainData', {
                id: player.id,
                uid: user.getID(player),
                cid: user.charID(player),
                name: user.getName(player),
                lvl: user.getAdminLvl(player)
            })

            user.toggleHud(player, false)
            user.cursor(player, true, false)

            user.notify(player, 'Нажмите ESC, чтобы закрыть меню', 'warning')
            user.addOpened(player, 'adminmenu')
        }
    }


    user.npcdialogShow = (player, id, title, desc, text, btns = []) => {
        if (!user.isLogged(player)) return
        player.call('server::user:npcdialogShow', [id, title, desc, text, btns])
    }
    user.npcdialogHide = player => {
        if (!user.isLogged(player)) return
        player.call('server::user:npcdialogHide', [])
    }


    user.setNear = (player, nearName, nearData) => {
        if (!user.isLogged(player)) return

        const nears = user.getNears(player)

        nears[nearName] = nearData
        container.set('user', player.id, 'nears', nears)
    }
    user.removeNear = (player, nearName) => {
        if (!user.isLogged(player)) return

        const nears = user.getNears(player)
        if (nears[nearName] !== undefined) {
            delete nears[nearName]
            container.set('user', player.id, 'nears', nears)
        }
    }
    user.getNears = player => {
        if (!user.isLogged(player)) return {}
        return container.get('user', player.id, 'nears')
    }

    user.getPlayerForID = (id) => {
        let pls = null
        mp.players.forEach(pl => {
            if (pl.id === id) pls = pl
        })
        return pls

    }
    user.getPlayerForName = username => {
        let pls = null
        mp.players.forEach(pl => {

            if (user.getName(pl) === username) pls = pl
        })
        return pls
    }
    user.getPlayerForCharName = charname => {
        let pls = null
        mp.players.forEach(pl => {
            if (user.getCharName(pl) === charname) pls = pl
        })
        return pls
    }
    user.getPlayerForUID = id => {
        let pls = null
        mp.players.forEach(pl => {

            if (user.getID(pl) === id) pls = pl
        })
        return pls
    }
    user.getPlayerForCharID = id => {
        let pls = null
        mp.players.forEach(pl => {
            console.log(pl)

            if (container.get('user', pl.id, 'char_id') === id) pls = pl
        })
        return pls
    }


    user.getKey = (player, keyname) => {
        if (!user.isLogged(player)) return 'null'
        return container.get('user', player.id, 'user_keysSettings')[keyname]
    }


    user.addInventory = (player, id, count = 1, data = {}, onlyInv = false, customWeight = 0, canStack = false) => {
        if (!CONFIG_INVENTORY[id]) return false

        if (!onlyInv) {
            if (user.getInventoryWeight(player) + CONFIG_INVENTORY[id].weight > CONFIG_ENUMS.invMaxWeight
                && user.getBackpackWeight(player) + CONFIG_INVENTORY[id].weight > user.getBackpackMaxWeight(player)) return false
        }
        else {
            if (user.getInventoryWeight(player) + CONFIG_INVENTORY[id].weight > CONFIG_ENUMS.invMaxWeight) return false
        }

        const invItem = CONFIG_INVENTORY[id]
        if ((user.getInventoryWeight(player) + CONFIG_INVENTORY[id].weight > CONFIG_ENUMS.invMaxWeight
            || !onlyInv) && user.getBackpackMaxWeight(player) !== 0.0) {
            const tempInv = container.get('user', player.id, 'char_backpack')

            let status = false


            if (canStack === true) {

                const found = tempInv.find((el, i) => {

                    if (el && !status && el.id === id) {
                        status = true
                        tempInv[i].count = tempInv[i].count + count
                        invItem.type = invItem.type

                    }
                });
                if (!found) {
                    tempInv.map((item, i) => {


                        if (!item && !status) {
                            status = true

                            tempInv[i] = invItem
                            if (customWeight !== 0) tempInv[i].weight = customWeight

                            tempInv[i].id = id
                            tempInv[i].data = data
                            tempInv[i].count = count
                            tempInv[i].status = 4
                            invItem.type = invItem.type
                        }
                    })
                }



            } else {
                tempInv.map((item, i) => {


                    if (!item && !status) {
                        status = true

                        tempInv[i] = invItem
                        if (customWeight !== 0) tempInv[i].weight = customWeight

                        tempInv[i].id = id
                        tempInv[i].data = data
                        tempInv[i].count = count
                        tempInv[i].status = 4
                        invItem.type = invItem.type
                    }
                })


            }









            if (!status) return false
            container.set('user', player.id, 'char_backpack', tempInv)
        }
        else {
            const tempInv = container.get('user', player.id, 'char_inventory')

            let status = false

            if (canStack === true) {
                const found = tempInv.find((el, i) => {
                    if (el && !status && el.id === id) {
                        status = true
                        tempInv[i].count = tempInv[i].count + count
                        invItem.type = invItem.type
                    }
                });
                if (!found) {
                    tempInv.map((item, i) => {


                        if (!item && !status) {
                            status = true

                            tempInv[i] = invItem
                            if (customWeight !== 0) tempInv[i].weight = customWeight

                            tempInv[i].id = id
                            tempInv[i].data = data
                            tempInv[i].count = count
                            tempInv[i].status = 4
                            invItem.type = invItem.type
                        }
                    })
                }


            } else {
                tempInv.map((item, i) => {


                    if (!item && !status) {
                        status = true

                        tempInv[i] = invItem
                        if (customWeight !== 0) tempInv[i].weight = customWeight

                        tempInv[i].id = id
                        tempInv[i].data = data
                        tempInv[i].count = count
                        tempInv[i].status = 4
                    }
                })


            }


            if (!status) return false
            container.set('user', player.id, 'char_inventory', tempInv)
        }

        let user_backpack = CONFIG_INVENTORY[container.get('user', player.id, 'char_backpackStatus')]
        user_backpack.id = container.get('user', player.id, 'char_backpackStatus')

        user.save(player)
        if (user.isOpened(player, 'inventory')) user.updateUIInventory(player)

        user.notify(player, `В Ваш инвентарь был добавлен новый предмет: ${CONFIG_INVENTORY[id].name} [${count} шт.]`)
        logs.send('user', user.charID(player), `В инвентарь был добавлен предмет: ${CONFIG_INVENTORY[id].name} [${count} шт.]`)

        return true
    }
    user.removeInventory = (player, id, count = 1, notify = false, indexInSection) => {
        if (!CONFIG_INVENTORY[id]) return false
        let status = false

        let tempInv = JSON.parse(JSON.stringify(container.get('user', player.id, 'char_backpack')))
        tempInv.find((el, i) => {


            if (el && el.id === id && count > 0 && i == indexInSection) {

                console.log('Нашел')
                if (tempInv[i].count >= count) {
                    tempInv[i].count -= count
                    count = 0

                    if (tempInv[i].count <= 0) tempInv[i] = null


                }
                else {
                    count -= tempInv[i].count
                    tempInv[i] = 0
                }
                status = true
            }
        });

        container.set('user', player.id, 'char_backpack', tempInv)


        user.updateUIInventory(player)
        if (!status) {
            let tempInv = JSON.parse(JSON.stringify(container.get('user', player.id, 'char_inventory')))


            tempInv.find((el, i) => {


                if (el && el.id === id && count > 0 && i == indexInSection) {

                    console.log('Нашел Инвентарь')
                    if (tempInv[i].count >= count) {
                        tempInv[i].count -= count
                        count = 0

                        if (tempInv[i].count <= 0) tempInv[i] = null


                    }
                    else {
                        count -= tempInv[i].count
                        tempInv[i] = 0
                    }
                }
            });









            container.set('user', player.id, 'char_inventory', tempInv)


            user.updateUIInventory(player)
        }












        if (user.isOpened(player, 'inventory')) user.updateUIInventory(player)
        user.save(player)
        if (notify) user.notify(player, `Из Вашего инвентаря был удален предмет: ${CONFIG_INVENTORY[id].name}`)
        logs.send('user', user.charID(player), `Из инвентаря был удален предмет: ${CONFIG_INVENTORY[id].name}`)
    }
    user.getInventoryWeight = player => {
        let weight = 0.0
        container.get('user', player.id, 'char_inventory').forEach((item, i) => {
            if (item) weight += item.weight
        })
        return weight
    }
    user.getBackpackWeight = player => {
        let weight = 0.0
        container.get('user', player.id, 'char_backpack').forEach((item, i) => {
            if (item) weight += item.weight
        })
        return weight
    }
    user.getBackpackMaxWeight = player => {
        let weight = 0.0
        if (container.get('user', player.id, 'char_backpackStatus') !== 0) {
            if (CONFIG_INVENTORY[container.get('user', player.id, 'char_backpackStatus')]
                && CONFIG_INVENTORY[container.get('user', player.id, 'char_backpackStatus')].type === 'backpack') weight = CONFIG_INVENTORY[container.get('user', player.id, 'char_backpackStatus')].maxWeight
            else container.set('user', player.id, 'char_backpackStatus', 0)
        }
        return weight
    }


    user.updateUIInventory = (player, targetPlayer = false) => {
        let user_backpack = 0
        if (container.get('user', player.id, 'char_backpackStatus') > 0
            && CONFIG_INVENTORY[container.get('user', player.id, 'char_backpackStatus')]
            && CONFIG_INVENTORY[container.get('user', player.id, 'char_backpackStatus')].type === 'backpack') {
            user_backpack = CONFIG_INVENTORY[container.get('user', player.id, 'char_backpackStatus')]
            user_backpack.id = container.get('user', player.id, 'char_backpackStatus')
        }

        user.uiSend(targetPlayer === false ? player : targetPlayer, 'client::inventory', 'update', {
            inventory: container.get('user', player.id, 'char_inventory'),
            backpack: container.get('user', player.id, 'char_backpack'),
            player: user.getCharName(player),
            user: {
                cap: 0,
                body: 0,
                armour: 0,
                accessory: 0,
                accessory2: 0,
                accessory3: 0,
                shirt: 0,
                pants: 0,
                bottom: 0,
                camera: 0,
                backpack: user_backpack
            },
            keys: [],
            weapons: [],

            invData: {
                lvl: 1,
                weight: user.getInventoryWeight(player).toFixed(1),
                maxWeight: CONFIG_ENUMS.invMaxWeight
            },
            backpackData: !container.get('user', player.id, 'char_backpackStatus') ? null : {
                lvl: 1,
                weight: user.getBackpackWeight(player),
                maxWeight: user.getBackpackMaxWeight(player).toFixed(1)
            },
            armourData: null
        })



    }


    user.getDonate = player => {
        return parseInt(container.get('user', player.id, 'user_donate'))
    }
    user.setDonate = (player, count) => {
        if (!user.isLogged(player)) return

        if (user.isOpened(player, 'mainmenu')) user.uiSend(player, 'client::menu', 'setDonateCount', {
            count
        })
        return container.set('user', player.id, 'user_donate', count)
    }
    user.giveDonate = (player, cash, message = true) => {
        if (!user.isLogged(player)
            || cash === 0) return

        cash = parseInt(cash)
        container.set('user', player.id, 'user_donate', user.getDonate(player) + cash)

        if (message) {
            if (cash > 0) user.notify(player, `+ ${cash.toLocaleString()} GC`, 'donate')
            else user.notify(player, `${cash.toLocaleString()} GC`, 'donate')
        }

        // player.call('server::user:setcash', [ [user.getCash(player), user.getBankCash(player)] ])
        user.save(player)

        if (user.isOpened(player, 'mainmenu')) user.uiSend(player, 'client::menu', 'setDonateCount', {
            count: user.getDonate(player)
        })
    }


    user.showDialog = (player, type = 'dialog', title, body, btn = ['Окей'], input = []) => {

        user.uiSend(player, 'client::dialog', 'dialog', {
            status: true,
            type,
            title,
            body,
            input,
            btn
        })
    }
    user.hideDialog = player => {



        user.uiSend(player, 'client::dialog', 'dialog', {
            status: false,

            title: '',
            body: '',

            input: [],
            btn: []
        })
    }
    user.showHouseDialog = (player, type = 'buy', propertyType, propertyId, propertyClass, propertyParkingLots, ownerName, propertyPrice, propertyFee, btn = ['Окей'], propertyBalance = 0) => {

        user.uiSend(player, 'client::house', 'toggle', {
            status: true

        })
        user.uiSend(player, 'client::house', 'dialog', {
            type,
            propertyType,
            propertyId,
            propertyClass,
            propertyParkingLots,
            ownerName,
            propertyPrice,
            propertyFee,
            propertyBalance,
            btn
        })


    }
    user.hideHouseDialog = player => {

        user.uiSend(player, 'client::house', 'toggle', {
            status: false

        })


    }
    user.showBizDialog = (player, bizType, bizId, rentFee, bizFee, bizBalance, bizAccountBalance, bizPrice, btn = ['Окей'], stats, settings) => {

        user.uiSend(player, 'client::biz', 'toggle', {
            status: true

        })
        user.uiSend(player, 'client::biz', 'dialog', {
            bizType,
            bizId,
            rentFee,
            bizFee,
            bizBalance,
            bizAccountBalance,
            bizPrice,
            btn,
            stats,
            settings
        })


    }
    user.hideBizDialog = player => {

        user.uiSend(player, 'client::biz', 'toggle', {
            status: false

        })


    }

    user.refreshRoulletePrize = (player, ttp = false) => {
        if (!container.get('user', player.id, 'char_donateRoullete').status
            || container.get('user', player.id, 'char_donateRoullete').time < +func.convertToMoscowDate(new Date())
            || ttp === true) {
            const tempRoullete = []
            const types = {
                standart: [],
                low: [],
                medium: [],
                legendary: []
            }

            CONFIG_DONATE.roullete.map((item, i) => {
                if (item.type === 'legendary') types.legendary.push(item)
                else if (item.type === 'medium') types.medium.push(item)
                else if (item.type === 'low') types.low.push(item)
                else if (item.type === 'standart') types.standart.push(item)
            })

            for (var i = 0; i < 200; i++) {
                let prox = func.random(0, 100)

                if (prox >= 0 && prox <= 5) tempRoullete.push(types.legendary[func.random(0, types.legendary.length - 1)])
                else if (prox > 5 && prox <= 20) tempRoullete.push(types.medium[func.random(0, types.medium.length - 1)])
                else if (prox > 20 && prox <= 50) tempRoullete.push(types.low[func.random(0, types.low.length - 1)])
                else if (prox > 50) {
                    prox = func.random(0, 100)

                    if (prox >= 0 && prox <= 50
                        && types.standart.length > 0) tempRoullete.push(types.standart[func.random(0, types.standart.length - 1)])
                    else {
                        prox = func.random(0, 100)
                        if (prox >= 60) {
                            prox = func.random(10, 250)
                            tempRoullete.push({
                                name: prox.toLocaleString(),
                                type: "standart",
                                img: "donate.png",
                                item: {
                                    type: "donate",
                                    count: prox
                                }
                            })
                        }
                        else {
                            prox = func.random(250, 5000)
                            tempRoullete.push({
                                name: prox.toLocaleString(),
                                type: "standart",
                                img: "donate_cash_0.png",
                                item: {
                                    type: "cash",
                                    count: prox
                                }
                            })
                        }
                    }
                }
            }

            container.set('user', player.id, 'char_donateRoullete', {
                status: true,
                data: tempRoullete,
                time: +func.convertToMoscowDate(new Date()) + 10800000
            })
            if (user.isOpened(player, 'mainmenu')) {
                user.uiSend(player, 'client::menu', 'openMenu', {
                    id: 'donate',
                    data: {
                        prizes: CONFIG_DONATE.roullete,
                        roullete: container.get('user', player.id, 'char_donateRoullete').data
                    }
                })
            }
        }
    }
    user.isFractionUser = (player) => {
        if (container.get('user', player.id, 'char_fraction') == false) return false
        return true
    }
    user.isWorkingAtIdWork = (player, id) => {
        if (container.get('user', player.id, "work") === undefined && container.get('user', player.id, "work")[0] !== id) return false

        return true
    }
    user.isWorkingAtIdFraction = (player, id) => {
        if (container.get('user', player.id, "fractionId") === undefined && container.get('user', player.id, "fractionId") !== id) return false

        return true
    }
    
    module.exports = user
}
catch (e) {
    logger.error('user.js', e)
}
