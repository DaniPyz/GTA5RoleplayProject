const logger = require('./client/modules/logger')

try {
    const user = require('./client/user')
    const ui = require('./client/modules/ui')

    mp.events.add({
        'server::user:loadScreen': (toggle, duration) => {
            user.loadScreen(toggle, duration)
        },

        'server::user:isReadyConnection': () => {
            user.toggleHud(false)

            ui.send('client::reg', 'setLogin', {
                value: mp.players.local.name
            })
            ui.send('client::reg', 'setPassword', {
                value: ''
            })
            ui.send('client::reg', 'setSaveme', {
                status: 0
            })

            if (mp.storage.data.authRemember
                && mp.storage.data.authRemember.status) {
                ui.send('client::reg', 'setLogin', {
                    value: mp.storage.data.authRemember.login
                })
                ui.send('client::reg', 'setPassword', {
                    value: mp.storage.data.authRemember.password
                })
                ui.send('client::reg', 'setSaveme', {
                    status: 1
                })
            }

            ui.send('client::reg', 'toggle', {
                status: true
            })
            user.cursor(true)
        },

        'server::user:setCamera': (position, atCoord, data) => {
            user.setCamera(position, atCoord, data)
        },
        'server::user:destroyCamera': data => {
            user.destroyCamera(data)
        },
        'server::user:freeze': status => {
            user.freeze(status)
        },

        'server::user:choiceChar': chars => {
            ui.send('client::selectchar', 'chars', {
                chars
            })
            ui.send('client::selectchar', 'toggle', {
                status: true
            })

            user.cursor(true)
        },
        'server::user:editCharacter': (createchar, data) => {
            setTimeout(() => {
                user.cursor(true)
                user.setCameraToPlayer()

                ui.send('client::createchar', 'update', data.skin)
                ui.send('client::createchar', 'toggle', {
                    status: true
                })
            }, 1200)
        },


        "ui::user:createChar": data => {
            logger.debug('ui::user:createChar')

            data = JSON.parse(data)
            data.clothes.forEach((item, i) => {
                if (item < 0) data.clothes[i] = 0
            })

            mp.events.callRemote('client::user:editCharacter', JSON.stringify({
                name: data.name,
                age: data.age,
                gender: data.gender,
                skin: {
                    genetic: data.genetic,
                    hair: data.hair,
                    appearance: data.appearance,
                    face: data.face
                },
                clothes: [`createchar_top_${data.clothes[0]}`, `createchar_bottom_${data.clothes[1]}`, `createchar_shoes_${data.clothes[2]}`]
            }))
        },

        'server::user:notify': data => {
            user.notify(data.text, data.type, data.time)
        },
        'server::user:toggleHud': status => {
            user.toggleHud(status)
        },
        'server::user:cursor': (status, toggleESC) => {
            user.cursor(status, toggleESC)
        },
        'newserver::user:cursor': (status, toggleESC) => {
            mp.gui.cursor.show(status, toggleESC)
        },

        'server::user:updateAccSettings': (settings, updateHud) => {
            user.accSettings = settings
            if (updateHud) user.updateHud()
        },

        'server::user:updateHud': changedata => {
            user.updateHud(changedata)
        },

        'server::user:setcash': cash => {
            user.cash = cash
            user.updateHud()
        },
        'server::user:setquests': quests => {
            user.quests = quests
            user.updateHud()
        },
        'server::user:setAdmin': lvl => {
            user.admin = lvl
            user.updateHud()
        },
        'server::user:setAdminLogged': logged => {
            user.adminLogged = logged
        },
        // Все что связанно с фракциями
        'server::user:setFraction': (fractionId, updateHud) => {
            user.fraction = fractionId
            ui.send('client::admin', 'openMenu', { menu: 'frac', data: [Array] })


        },
        // 'server::user:': (fractionId, updateHud) => {
        //     user.fraction = fractionId
        //     ui.send('client::admin', 'openMenu', { menu: 'frac', data: [Array] })


        // },
        'server::user:setKeys': keys => {
            user.keys = keys
            user.updateHud()
        },
        'server::user:setLogged': status => {
            user.logged = status
            user.updateHud()
        },
        'server::user:setMaxPlayersServer': count => {
            user._maxPlayersServer = count
            user.updateHud()
        },

        'server::user:toggleActionText': (toggle, keyName, message) => {
            user.toggleActionText(toggle, keyName, message)
        },

        'server::user:npcdialogShow': (id, title, desc, text, btns) => {
            user.npcdialogShow(id, title, desc, text, btns)
        },
        'server::user:npcdialogHide': () => {
            user.npcdialogHide()
        },


        'server::user:startVoice': () => {
            mp.voiceChat.muted = false
            user.updateHud()
        },
        'server::user:stopVoice': () => {
            mp.voiceChat.muted = true
            user.updateHud()
        },

        'server::user:getAuthSave': () => {
            mp.events.callRemote('client::user:return:getAuthSave', mp.storage.data.authRemember.status)
        },
        'server::user:setAuthSaveStatus': status => {
            mp.storage.data.authRemember.status = status
            mp.storage.flush()
        },

        'server::user:setVehBelt': status => {
            mp.players.local.setConfigFlag(32, !status)
        },
        'server::user:toggleCaptcha': (status, svg) => {
            user.cursor(true)


            ui.send('client::captcha', 'toggle', { status: status, svg: svg })
        },
        'server::user:setMarker': (x, y, z, dimension, name, routeFor,  color ) => {
            user.setMarker(x, y, z, dimension, name, routeFor, color)
        },
        'server::user:destroyMarker': () => {
            user.destroyMarker()
        },
        'server::user:createHouseBlip': (x, y, z) => {
            user.createHouseBlip(x, y, z)
        },
        'server::user:destroyHouseBlip': () => {
            user.removeHouseBlip(x, y, z)
        },
        'server::user:setColshape': (x, y, z, dimension, name, veh, needToBeOnFoot) => {
           
           
            user.setColshape(x, y, z, dimension, name, veh, needToBeOnFoot)
        },
        'server::user:destroyColshape': () => {
            user.destroyColshape()
        },
        
        "ui::captchaValue": data => {
            data = JSON.parse(data)
            const { value } = data
            mp.events.callRemote('client::captcha:verify', value)
        }
        

    })
}
catch (e) {
    logger.error('events - user.js', e)
}
