const logger = require('../../modules/logger')
const biz = require('../../property/biz')
const sys_works_farm = require('../../systems/works/farm')
try {
    const user = require('../../user')

    const container = require('../../modules/container')

    const sys_report = require('../../systems/report')
    const sys_adminchat = require('../../systems/adminchat')
    const sys_npc = require('../../systems/npc')

    const houses = require('../../property/houses')

    const { addKey } = require('../../modules/keys')

    const CONFIG_UIFAQ = require('../../configs/CONFIG_UIFAQ.json')
    const CONFIG_ADMCMD = require('../../configs/CONFIG_ADMCMD.json')
    const CONFIG_ADMTP = require('../../configs/CONFIG_ADMTP.json')
    const CONFIG_ADM = require('../../configs/CONFIG_ADM.json')
    const CONFIG_ENUMS = require('../../configs/CONFIG_ENUMS.json')

    addKey({
        'chatOpen': {
            keyCode: 84,
            func: player => {
                if (!user.isOnFoot(player)) return

                user.uiSend(player, 'client::hud', 'toggleChat', {
                    status: true
                })
                user.cursor(player, true, true)
            }
        },
        'hud_toggleHint': {
            keyCode: 120,
            func: (player, up) => {
                if (up) return
                if (!user.isOnFoot(player)) return

                user.setSettings(player, 'hud_toggleHint', !user.getSettings(player, 'hud_toggleHint'))
                player.call('server::user:updateAccSettings', [container.get('user', player.id, 'user_settings')])
            }
        },
        'mainmenu': {
            keyCode: 77,
            func: player => {
                if (!user.isOnFoot(player)) return
                user.uiSend(player, 'client::menu', 'setDonateCount', {
                    count: user.getDonate(player)
                })
                user.uiSend(player, 'client::menu', 'openMenu', {
                    id: 'stats',
                    data: {
                        level: [1, 0, 8],
                        createDate: container.get('user', player.id, 'char_birthday'),
                        vip: 0,
                        gender: user.getGender(player),
                        married: 'None',
                        phone: 0,
                        cash: [0, 0],
                        job: 'Отсутствует',
                        frac: user.getFraction(player)[1] !== undefined ? user.getFraction(player)[1] : 'Отсутствует',
                        warns: 0,
                        property: [],
                        charName: user.getCharName(player),
                        userName: container.get('user', player.id, 'user_name'),
                        userID: container.get('user', player.id, 'user_id')
                    }
                })
                user.uiSend(player, 'client::menu', 'toggle', {
                    status: true
                })

                user.toggleHud(player, false)
                user.cursor(player, true, false)

                // user.notify(player, 'Нажмите ESC, чтобы закрыть меню', 'warning')
                user.addOpened(player, 'mainmenu')
            }
        },
        'esc': {
            keyCode: 27,
            func: player => {
                console.log(container.get('user', player.id, 'openeds'))
                if (user.isOpened(player, 'mainmenu')) {
                    if (container.get('user', player.id, '_roulleteGo') === true) return user.notify(player, 'Дождитесь окончания рулетки', 'error')

                    user.toggleHud(player, true)
                    user.cursor(player, false, true)

                    user.uiSend(player, 'client::menu', 'toggle', {
                        status: false
                    })
                    user.removeOpened(player, 'mainmenu')
                }
                else if (user.isOpened(player, 'adminmenu')) {
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
                else if (user.isOpened(player, 'fraction')) {
                    user.toggleHud(player, true)
                    user.cursor(player, false, true)

                    user.uiSend(player, 'client::fraction', 'toggle', {
                        status: false
                    })
                    user.removeOpened(player, 'fraction')
                }
                else if (user.isOpened(player, 'interactionMenu')) {
                    user.toggleHud(player, true)
                    user.cursor(player, false, true)

                    user.uiSend(player, 'client::interactionmenu', 'toggle', {
                        status: false
                    })
                    user.removeOpened(player, 'interactionMenu')
                }
                else if (user.isOpened(player, 'cabdialog')) {
                    user.toggleHud(player, true)
                    user.cursor(player, false, true)

                    user.hideDialog(player)
                    user.hideHouseDialog(player)
                    user.removeOpened(player, 'cabdialog')
                }
                else if (user.isOpened(player, 'housedialog')) {
                    user.toggleHud(player, true)
                    user.cursor(player, false, true)
                    user.hideHouseDialog(player)


                    user.removeOpened(player, 'bizdialog')
                } else if (user.isOpened(player, 'bizdialog')) {
                    user.toggleHud(player, true)
                    user.cursor(player, false, true)
                    user.hideBizDialog(player)


                    user.removeOpened(player, 'bizdialog')
                }
            }
        },
        'adminmenu': {
            keyCode: 117,
            func: player => {
                if (!user.isOnFoot(player)
                    || !user.isAdmin(player)) return false

                if (container.get('user', player.id, 'user_adminPassword').length <= 0) mp.events.call('client::user:admin:openMenu', player, 'loginNew')
                else if (container.get('user', player.id, 'user_adminBan') === 1) mp.events.call('client::user:admin:openMenu', player, 'loginError')
                else if (!user.isAdminLogged(player)) mp.events.call('client::user:admin:openMenu', player, 'login')
                else mp.events.call('client::user:admin:openMenu', player, 'reports')

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

                // user.notify(player, 'Нажмите ESC, чтобы закрыть меню', 'warning')
                user.addOpened(player, 'adminmenu')
            }
        },
        'fractionmenu': {
            keyCode: 79,
            func: player => {
                logger.log('Запрос на открытие меню фракции', container.get('user', player.id, 'char_fraction')[0])

                if (!user.isOnFoot(player)
                    || !user.isFractionUser(player)) return false


                user.uiSend(player, 'client::fraction', 'toggle', {
                    status: true
                })
                user.toggleHud(player, false)
                user.cursor(player, true, false)

                // user.notify(player, 'Нажмите ESC, чтобы закрыть меню', 'warning')
                user.addOpened(player, 'fraction')
                //     user.uiSend(player, 'client::admin', 'mainData', {
                //         id: player.id,
                //         uid: user.getID(player),
                //         cid: user.charID(player),
                //         name: user.getName(player),
                //         lvl: user.getAdminLvl(player)
                //     })

                //     user.toggleHud(player, false)
                //     user.cursor(player, true, false)

                //     user.notify(player, 'Нажмите ESC, чтобы закрыть меню', 'warning')
                //     user.addOpened(player, 'adminmenu')
            }
        },
        'interaction': {
            keyCode: 69,
            func: player => {
                if (!user.isOnFoot(player)) return

                sys_npc.action(player)
                houses.action(player)
                biz.action(player)
                // sys_works_farm.action(player)
            }
        },
        'interactionMenu': {
            keyCode: 71,
            func: player => {

                if (!user.isOnFoot(player)) return


                user.uiSend(player, 'client::interactionmenu', 'toggle', {
                    status: true
                })
                user.toggleHud(player, false)
                user.cursor(player, true, false)

                user.notify(player, 'Нажмите ESC, чтобы закрыть меню', 'warning')
                user.addOpened(player, 'interactionMenu')




                // sys_npc.action(player)
                // houses.action(player)
            }
        },
        "voiceChat": {
            keyCode: 88,
            func: (player, up) => {
                if (!user.isOnFoot(player)) return

                if (up === false) player.call('server::user:startVoice')
                else player.call('server::user:stopVoice')
            }
        },
        "inventory": {
            keyCode: 73,
            func: player => {
                if (!user.isOnFoot(player)) return

                user.updateUIInventory(player)
                user.uiSend(player, 'client::inventory', 'toggle', {
                    status: true
                })

                user.toggleHud(player, false)
                user.cursor(player, true, false)

                user.addOpened(player, 'inventory')
            }
        },
        'phone': {
            keyCode: 80,
            func: player => {
                if (!user.isOnFoot(player)) return

                user.uiSend(player, 'client::phone', 'toggle', {
                    status: true
                })
                user.cursor(player, true, false)

                user.addOpened(player, 'phone')
            }
        },

    })
}
catch (e) {
    logger.error('events/user/_keys', e)
}
