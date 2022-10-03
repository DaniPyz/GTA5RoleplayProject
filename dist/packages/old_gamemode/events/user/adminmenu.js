const logger = require('../../modules/logger')
try {
    const sha256 = require('js-sha256')
    const func = require('../../modules/func')
    const user = require('../../user')
    const mysql = require('../../plugins/mysql')
    const container = require('../../modules/container')
    const chat = require('../../chat')
    const logs = require('../../modules/logs')

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
    const CONFIG_INVENTORY = require('../../configs/CONFIG_INVENTORY.json')

    mp.events.add({
        "client::user:admin:openMenu": (player, id) => {
            if (!user.isAdmin(player)) {
                user.toggleHud(player, true)
                user.cursor(player, false, true)

                user.uiSend(player, 'client::admin', 'toggle', {
                    status: false
                })
                user.removeOpened(player, 'adminmenu')

                return
            }

            user.uiSend(player, 'client::admin', 'mainData', {
                id: player.id,
                uid: user.getID(player),
                cid: user.charID(player),
                name: user.getName(player),
                lvl: user.getAdminLvl(player)
            })
            user.uiSend(player, 'client::admin', 'updateChatMessages', {
                players: sys_adminchat.getAdmins(),
                messages: sys_adminchat.getMessages(),
                write: null
            })

            if (container.get('user', player.id, 'user_adminBan') === 1) {
                user.uiSend(player, 'client::admin', 'openMenu', {
                    menu: 'loginError'
                })
            }
            else {
                switch (id) {
                    case 'login':
                        {
                            user.uiSend(player, 'client::admin', 'openMenu', {
                                menu: 'login'
                            })
                            break
                        }
                    case 'loginError':
                        {
                            user.uiSend(player, 'client::admin', 'openMenu', {
                                menu: 'loginError'
                            })
                            break
                        }
                    case 'loginNew':
                        {
                            user.uiSend(player, 'client::admin', 'openMenu', {
                                menu: 'loginNew'
                            })
                            break
                        }
                    case 'reports':
                        {
                            user.uiSend(player, 'client::admin', 'openMenu', {
                                menu: 'reports',
                                data: sys_report.getForAdmin()
                            })
                            break
                        }
                    case 'cmd':
                        {
                            user.uiSend(player, 'client::admin', 'openMenu', {
                                menu: 'cmd',
                                data: CONFIG_ADMCMD
                            })
                            break
                        }
                    case 'chat':
                        {
                            user.uiSend(player, 'client::admin', 'openMenu', {
                                menu: 'chat',
                                data: {
                                    players: sys_adminchat.getAdmins(),
                                    messages: sys_adminchat.getMessages(),
                                    write: null
                                }
                            })
                            break
                        }
                    case 'tp':
                        {
                            const returnTP = []
                            for (var key in CONFIG_ADMTP) returnTP.push({ name: CONFIG_ADMTP[key].name, desc: CONFIG_ADMTP[key].desc, id: parseInt(key) })

                            user.uiSend(player, 'client::admin', 'openMenu', {
                                menu: 'tp',
                                data: returnTP
                            })
                            break
                        }
                    case 'frac':
                        {
                            mysql.query('select id, name, description, leader, status from fraction', [], (err, res) => {
                                if (err) return logger.error('client::user:admin:openMenu', err)
                                // console.log(returnFractions)
                                // logger.log('Ответ', returnFractions)
                                let returnFractions = []
                                res.forEach((item, i) => {


                                    returnFractions.push({
                                        id: item.id,
                                        name: item.name,
                                        description: item.description,
                                        leader: item.leader,
                                        status: item.status
                                    })

                                })
                                console.log(returnFractions)

                                user.uiSend(player, 'client::admin', 'openMenu', {
                                    menu: 'frac',
                                    data: returnFractions
                                })

                            })


                            break
                        }
                    case 'admins':
                        {
                            mysql.query('select id, username, admin, online, onlineChar, adminData from users where admin > 0', [], (err, res) => {
                                if (err) return logger.error('client::user:admin:openMenu', err)

                                const returnAdmins = []
                                res.forEach((item, i) => {
                                    returnAdmins.push({
                                        uid: item.id,
                                        charid: item.onlineChar,
                                        name: item.username,
                                        lvl: item.admin,
                                        status: item.online === -1 ? 'Offline' : `Онлайн (ID: ${item.online})`,
                                        data: JSON.parse(item.adminData)
                                    })
                                })
                                console.log(returnAdmins)
                                logger.log(returnAdmins)
                                user.uiSend(player, 'client::admin', 'openMenu', {
                                    menu: 'admins',
                                    data: returnAdmins
                                })
                            })
                            break
                        }
                    case 'invitems':
                        {
                            let items = []
                            CONFIG_INVENTORY.forEach((item, i) => {
                                items.push(item)
                                items[i].id = i
                            })

                            user.uiSend(player, 'client::admin', 'openMenu', {
                                menu: 'invitems',
                                data: items
                            })
                            break
                        }
                }
            }
        },
        "client::user:admin:reportSendMessage": (player, id, text) => {
            if (!user.isAdmin(player)) return
            if (container.get('reports', id, 'status') === undefined
                || container.get('reports', id, 'status') === 2) return

            if (container.get('reports', id, 'status') === 0) container.set('reports', id, 'status', 1)
            sys_report.addMessage(id, {
                type: 'admin', name: user.getName(player), date: func.convertToMoscowDate(new Date()), text
            }, true)
        },
        "client::user:admin:reportSendEvent": (player, id, eventname) => {
            if (!user.isAdmin(player)) return
            if (container.get('reports', id, 'status') === undefined
                || container.get('reports', id, 'status') === 2) return

            switch (eventname) {
                case 'closereport':
                    {
                        container.set('reports', id, 'status', 2)
                        mp.players.forEach(pl => {
                            if (user.isOpened(pl, 'adminmenu')) user.uiSend(pl, 'client::admin', 'updateReports', sys_report.getForAdmin())
                        })

                        if (user.isOpened(container.get('reports', id, 'creator'), 'mainmenu')) user.uiSend(container.get('reports', id, 'creator'), 'client::menu', 'updateReports', sys_report.getForPlayer(container.get('reports', id, 'creator')))
                        user.notify(container.get('reports', id, 'creator'), `Администратор закрыл Ваш репорт #${id}`)

                        break
                    }
            }
        },

        "client::user:admin:tp": (player, id) => {
            if (!user.isAdmin(player)) return

            user.toggleHud(player, true)
            user.cursor(player, false, true)

            user.uiSend(player, 'client::admin', 'toggle', {
                status: false
            })
            user.removeOpened(player, 'adminmenu')

            user.setPos(player, CONFIG_ADMTP[id].pos[0], CONFIG_ADMTP[id].pos[1], CONFIG_ADMTP[id].pos[2], CONFIG_ADMTP[id].pos[3], CONFIG_ADMTP[id].pos[4])
        },

        "client::user:admin:chatSend": (player, text) => {
            if (!user.isAdmin(player)) return
            sys_adminchat.addMessage(player, text)
        },
        "client::user:admin:chatView": (player, id) => {
            if (!user.isAdmin(player)) return
            sys_adminchat.viewMessage(player, id)
        },

        "client::user:admin:login": (player, password) => {
            if (!user.isAdmin(player)) return
            if (user.isAdminLogged(player)) return mp.events.call('client::user:admin:openMenu', player, 'reports')

            if (parseInt(container.get('user', player.id, 'adminlogintry')) <= 0) return user.adminBan(player)
            if (sha256(password) !== container.get('user', player.id, 'user_adminPassword')) {
                container.set('user', player.id, 'adminlogintry', parseInt(container.get('user', player.id, 'adminlogintry')) - 1)
                if (parseInt(container.get('user', player.id, 'adminlogintry')) <= 0) user.adminBan(player)

                return user.uiSend(player, 'client::admin', 'addNotf', {
                    type: 'error',
                    text: 'Не верный пароль'
                })
            }
            if (!user.isAdminCorrect(player)) return user.adminBan(player)

            mp.events.call('client::user:admin:openMenu', player, 'reports')
            user.uiSend(player, 'client::admin', 'addNotf', {
                type: 'success',
                text: 'Вы успешно зашли в админ систему'
            })

            container.set('user', player.id, 'adminlogintry', 3)
            container.set('user', player.id, 'adminlogged', true)

            player.call('server::user:setAdminLogged', [true])
            sys_adminchat.addMessageSystem(`${user.returnAdminName(player)} ${user.getName(player)}[${player.id}] авторизовался в системе администрирования.`, '#3bcdce')
        },
        "client::user:admin:login:new": (player, password) => {
            if (!user.isAdmin(player)) return
            if (user.isAdminLogged(player)
                || container.get('user', player.id, 'user_adminPassword').length > 0) return mp.events.call('client::user:admin:openMenu', player, 'reports')

            container.set('user', player.id, 'user_adminPassword', sha256(password))
            mp.events.call('client::user:admin:openMenu', player, 'login')

            container.set('user', player.id, 'adminlogintry', 3)
            user.save(player)
        },
        "client::user:admin:out": player => {
            if (!user.isAdmin(player)) return
            if (!user.isAdminLogged(player)) {
                user.toggleHud(player, true)
                user.cursor(player, false, true)

                user.uiSend(player, 'client::admin', 'toggle', {
                    status: false
                })
                return user.removeOpened(player, 'adminmenu')
            }

            mp.events.call('client::user:admin:openMenu', player, 'login')
            user.notify(player, 'Вы успешно вышли из админ системы!')

            container.set('user', player.id, 'adminlogintry', 3)
            container.set('user', player.id, 'adminlogged', false)

            player.call('server::user:setAdminLogged', [false])
            sys_adminchat.addMessageSystem(`${user.returnAdminName(player)} ${user.getName(player)}[${player.id}] вышел из системы администрирования.`, 'silver')
        },
        "client::user:admin:addAdmin": (player, username) => {
            if (!user.isAdmin(player, 10)) return
            if (!user.isAdminLogged(player)) {
                user.toggleHud(player, true)
                user.cursor(player, false, true)

                user.uiSend(player, 'client::admin', 'toggle', {
                    status: false
                })
                return user.removeOpened(player, 'adminmenu')
            }

            mysql.query('select id, admin from users where username = ?', [username], (err, res) => {
                if (err) {
                    user.uiSend(player, 'client::admin', 'addNotf', {
                        type: 'error',
                        text: err
                    })
                    return logger.error('client::user:admin:addAdmin', err)
                }

                if (!res.length) return user.uiSend(player, 'client::admin', 'addNotf', {
                    type: 'error',
                    text: 'Аккаунт с данным ником не найден'
                })
                if (res[0]['admin'] > 0) return user.uiSend(player, 'client::admin', 'addNotf', {
                    type: 'error',
                    text: `${username} уже является администратором ${res[0]['admin']} уровня`
                })
                const pl = user.getPlayerForName(username)

                if (pl) {
                    container.set('user', pl.id, 'user_adminData', {
                        ...CONFIG_ADM.defaultData,

                        addDate: func.convertToMoscowDate(new Date()),
                        adder: `${CONFIG_ADM.names[user.getAdminLvl(player)]} ${user.getName(player)}`
                    })

                    container.set('user', pl.id, 'user_admin', 1)
                    user.save(pl)
                }
                else mysql.query(`update users set admin = 1, adminData = ? where id = ?`, [JSON.stringify({ ...CONFIG_ADM.defaultData, addDate: func.convertToMoscowDate(new Date()), adder: `${CONFIG_ADM.minNames[user.getAdminLvl(player)]} ${user.getName(player)}` }), res[0]['id']])

                if (pl) user.notify(pl, `Вы были поставлены на должность ${CONFIG_ADM.names[1]} админом ${CONFIG_ADM.names[user.getAdminLvl(player)]} ${user.getName(player)}`)
                mp.events.call('other::adminchat:addMessageSystem', `${CONFIG_ADM.names[user.getAdminLvl(player)]} ${user.getName(player)} поставил ${username}${pl && `[${pl.id}]`} на должность ${CONFIG_ADM.names[1]}`, '#91f29a')

                logs.send('user', user.getID(player), `Поставил ${username} на ${CONFIG_ADM.names[1]}`, {
                    userid: res[0]['id'],
                    username
                })
                logs.send('user', res[0]['id'], `Был поставлен на ${CONFIG_ADM.names[1]} админом ${CONFIG_ADM.names[user.getAdminLvl(player)]} ${user.getName(player)}`, {
                    userid: user.getID(player),
                    username: user.getName(player)
                })

                user.uiSend(player, 'client::admin', 'addNotf', {
                    type: 'success',
                    text: `Вы успешно поставили ${username} на ${CONFIG_ADM.names[1]}`
                })
                user.uiSend(player, 'client::admin', 'dialog', {
                    status: false,
                    title: '',
                    text: '',
                    type: '',
                    btn: []
                })
                mp.events.call('client::user:admin:openMenu', player, 'admins')
            })
        },
        "client::user:admin:adminEdit": (player, uid, type) => {
            if (!user.isAdmin(player)) return
            if (!user.isAdminLogged(player)) {
                user.toggleHud(player, true)
                user.cursor(player, false, true)

                user.uiSend(player, 'client::admin', 'toggle', {
                    status: false
                })
                return user.removeOpened(player, 'adminmenu')
            }
            const pl = user.getPlayerForUID(uid)

            if (type === 'up' || type === 'down' || type === 'uval') {
                mysql.query('select username, admin, adminData from users where id = ?', [uid], (err, res) => {
                    if (err) {
                        user.uiSend(player, 'client::admin', 'addNotf', {
                            type: 'error',
                            text: err
                        })
                        return logger.error('client::user:admin:adminEdit', err)
                    }

                    if (!res.length || res[0]['admin'] <= 0) return mp.events.call('client::user:admin:openMenu', player, 'admins')
                    if (user.getAdminLvl(player) <= res[0]['lvl']) return user.uiSend(player, 'client::admin', 'addNotf', {
                        type: 'error',
                        text: 'Вы не можете сделать это с данным админом'
                    })

                    let newlvl = parseInt(res[0]['admin'])

                    if (type === 'up') {
                        if (newlvl + 1 > CONFIG_ADM.names.length) return user.uiSend(player, 'client::admin', 'addNotf', {
                            type: 'error',
                            text: 'Вы не можете больше повысить данного администратора'
                        })
                        newlvl = newlvl + 1
                    }
                    else if (type === 'down') {
                        if (newlvl - 1 <= 0) return user.uiSend(player, 'client::admin', 'addNotf', {
                            type: 'error',
                            text: 'Вы не можете больше понизить данного администратора'
                        })
                        newlvl = newlvl - 1
                    }
                    else if (type === 'uval') newlvl = 0

                    user.uiSend(player, 'client::admin', 'dialog', {
                        status: true,
                        title: 'Изменение должности администратора',
                        text: `Вы действительно хотите ${type === 'down' ? 'понизить' : type === 'up' ? 'повысить' : 'снять'} ${res[0]['username']} до ${CONFIG_ADM.names[newlvl]} ?`,
                        type: 'normal',
                        btn: ['Да', 'Нет'],
                        server: true
                    })
                    player._adminDialogCallback = btn => {
                        user.uiSend(player, 'client::admin', 'dialog', {
                            status: false,
                            title: 'Изменение должности администратора',
                            text: '',
                            type: 'normal',
                            btn: ['Да', 'Нет']
                        })

                        if (btn === 0) {
                            if (!res.length || res[0]['admin'] <= 0) return mp.events.call('client::user:admin:openMenu', player, 'admins')
                            if (user.getAdminLvl(player) <= res[0]['lvl']) return user.uiSend(player, 'client::admin', 'addNotf', {
                                type: 'error',
                                text: 'Вы не можете сделать это с данным админом'
                            })

                            if (pl) {
                                container.set('user', pl.id, 'user_adminData', {
                                    ...CONFIG_ADM.defaultData,

                                    upDate: func.convertToMoscowDate(new Date()),
                                    upper: `${CONFIG_ADM.names[user.getAdminLvl(player)]} ${user.getName(player)}`
                                })

                                container.set('user', pl.id, 'user_admin', newlvl)
                                user.save(pl)
                            }
                            else mysql.query(`update users set admin = ?, adminData = ? where id = ?`, [newlvl, JSON.stringify({ ...JSON.parse(res[0]['adminData']), upDate: func.convertToMoscowDate(new Date()), upper: `${CONFIG_ADM.minNames[user.getAdminLvl(player)]} ${user.getName(player)}` }), uid])

                            if (pl) user.notify(pl, `Вы были ${type === 'up' ? `повышены на должность ${CONFIG_ADM.names[newlvl]}` : type === 'down' ? `понижены на должность ${CONFIG_ADM.names[newlvl]}` : 'сняты со своей должности'} админом ${CONFIG_ADM.names[user.getAdminLvl(player)]} ${user.getName(player)}`)
                            mp.events.call('other::adminchat:addMessageSystem', `${CONFIG_ADM.names[user.getAdminLvl(player)]} ${user.getName(player)} ${type === 'up' ? `повысил` : type === 'down' ? `понизил` : 'снял'} ${res[0]['username']}${pl && `[${pl.id}]`} на должность ${CONFIG_ADM.names[newlvl]}`, type === 'up' ? '#91f29a' : '#f29292')

                            logs.send('user', user.getID(player), `${type === 'up' ? `Повысил` : type === 'down' ? `Понизил` : 'Снял'} ${res[0]['username']} на ${CONFIG_ADM.names[newlvl]}`, {
                                userid: uid,
                                username: res[0]['username']
                            })
                            logs.send('user', uid, `Был ${type === 'up' ? `повышен на должность ${CONFIG_ADM.names[newlvl]}` : type === 'down' ? `понижен на должность ${CONFIG_ADM.names[newlvl]}` : 'снят со своей должности'} админом ${CONFIG_ADM.names[user.getAdminLvl(player)]} ${user.getName(player)}`, {
                                userid: user.getID(player),
                                username: user.getName(player)
                            })

                            user.uiSend(player, 'client::admin', 'addNotf', {
                                type: 'success',
                                text: `Вы успешно ${type === 'up' ? `повысили` : type === 'down' ? `понизили` : 'сняли'} ${res[0]['username']} на ${CONFIG_ADM.names[newlvl]}`
                            })
                            mp.events.call('client::user:admin:openMenu', player, 'admins')
                        }
                    }
                })
            }
            else if (type === 'tp') {
                if (!pl) return user.uiSend(player, 'client::admin', 'addNotf', {
                    type: 'error',
                    text: 'Админ Offline'
                })
            }
            else if (type === 'spec') {
                if (!pl) return user.uiSend(player, 'client::admin', 'addNotf', {
                    type: 'error',
                    text: 'Админ Offline'
                })
            }
        },

        "client::user:admin:dialogEnter": (player, btn, input) => {
            player._adminDialogCallback(btn, input)
        },
        "client::user:admin:setLider": (player, fracId, liderID) => {
            if (user.getAdminLvl(player) < 10) return user.uiSend(player, 'client::admin', 'addNotf', {
                type: 'error',
                text: 'Вы не можете ставить игрока на лидерку'
            })




            mysql.query('select leaderId, leader, name, maxRank, users from fraction where id = ?', [fracId], (err, res) => {
                if (err) return logger.err(err)
                let name = res[0]['name']
                let maxRank = res[0]['maxRank']


                let allAboutChar = container.getAll('user', liderID)

                let userBluePrint = {
                    id: allAboutChar.char_id,
                    name: allAboutChar.char_name.join(' '),
                    rank: maxRank,
                    status: 1
                }
                let newUsersArr = JSON.parse(res[0]["users"])

                newUsersArr.push(userBluePrint)
                // if (res[0]['leaderId'] === allAboutChar.char_id) return user.uiSend(player, 'client::admin', 'addNotf', {
                //     type: 'error',
                //     text: 'Игрок уже на лидерке'
                // })

                mysql.query('update fraction set leaderId = ?, leader = ?, status = ?, users = ? where id = ?', [allAboutChar.char_id, allAboutChar.char_name.join(' '), 1, JSON.stringify(newUsersArr), fracId], (err, res) => {
                    if (err) return logger.err(err)
                    user.uiSend(player, 'client::admin', 'addNotf', {
                        type: 'success',
                        text: 'Вы успешно стали лидером отряда'
                    })

                })
                mysql.query('update fraction set leaderId = ?, leader = ?, status = ? where id = ?', [allAboutChar.char_id, allAboutChar.char_name.join(' '), 1, fracId])
                let newArr = []
                newArr.push(fracId)
                newArr.push(res[0]['name'])
                newArr.push(res[0]['maxRank'])
                mysql.query('update characters set fraction = ? where id = ?', [newArr, allAboutChar.char_id])








                container.set('user', liderID, 'char_fraction', newArr)


                // user.setFraction(pl, fracId, res[0]['name'])
                user.save(player)



                mp.events.call('client::user:admin:openMenu', player, 'frac')

            })


        },
        "client::user:admin:invitems": (player, id, charname) => {
            if (user.getAdminLvl(player) < 10) return user.uiSend(player, 'client::admin', 'addNotf', {
                type: 'error',
                text: 'Вы не можете выдавать предметы'
            })
            if (!CONFIG_INVENTORY[id]) return user.uiSend(player, 'client::admin', 'addNotf', {
                type: 'error',
                text: 'Выдаваемый предмет не найден'
            })

            const pl = user.getPlayerForCharName(charname)
            if (!pl) {
                user.uiSend(player, 'client::admin', 'addNotf', {
                    type: 'error',
                    text: 'Игрока с данным персонажем нет онлайн'
                })
                // mysql.query('select id, inventory from characters where name like ')
            }
            else {
                if (!user.addInventory(pl, id)) return user.uiSend(player, 'client::admin', 'addNotf', {
                    type: 'error',
                    text: `У игрока не хватает места в инвентаре`
                })

                user.uiSend(player, 'client::admin', 'addNotf', {
                    type: 'success',
                    text: `Вы успешно выдали ${CONFIG_INVENTORY[id].name} ${charname}[${pl.id}]`
                })
                logs.send('user', user.getID(player), `Выдал предмет ${CONFIG_INVENTORY[id].name} в инвентарь ${charname}.`, {
                    charid: user.getCharID(pl)
                })
            }
        }
    })
}
catch (e) {
    logger.erorr('events/user/adminmenu', e)
}
