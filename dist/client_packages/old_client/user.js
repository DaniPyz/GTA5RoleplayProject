const logger = require('./client/modules/logger')
try {
    const enums = require('./client/modules/enums')
    const func = require('./client/modules/func')
    const ui = require('./client/modules/ui')
    const user = {}


    user.admin = 0
    user.adminLogged = false
    user.accSettings = {}
    user.keys = {}
    user.logged = false

    user._maxPlayersServer = 0
    user.fraction = []
    user.voiceListener = []
    user.voiceChatTimer = setInterval(() => {
        const localPlayer = mp.players.local
        mp.players.forEach(player => {
            if (player !== localPlayer && !player.isListening) {
                let dist = mp.game.system.vdist(player.position.x, player.position.y, player.position.z, localPlayer.position.x, localPlayer.position.y, localPlayer.position.z)
                if (dist <= 10.0) {
                    user.voiceListener.push(player)
                    player.isListening = true

                    mp.events.callRemote("client::user:addVoiceListener", player)

                    player.voiceVolume = 1 - (dist / 10.0)
                    player.voice3d = true
                }
            }
        })
        user.voiceListener.forEach(player => {
            let dist = mp.game.system.vdist(player.position.x, player.position.y, player.position.z, localPlayer.position.x, localPlayer.position.y, localPlayer.position.z)
            if (dist > 10.0) {
                const id = user.voiceListener.indexOf(player)
                if (id !== -1) user.voiceListener.splice(id, 1)

                player.isListening = false
                mp.events.callRemote("client::user:removeVoiceListener", player)
            }

            player.voiceVolume = 1 - (dist / 10.0)
        });
    }, 250)

    // user.gpsUpdateTimer = setInterval(() => {
    //     console.log(mp.splayers.local.id)
    //     user.updateHud({
    //         stats: {
    //             online: [mp.players.length, user._maxPlayersServer],
    //             id: mp.players.local.id,
    //             micro: !mp.voiceChat.muted,
    //             weather: ['Неизвестно', 0],
    //             gps: func.getStreetNames()
    //         }
    //     }, false)
    // }, 1000)

    user.cash = [0, 0]
    user.quests = {
        status: false,
        name: '',
        tasks: []
    }

    user.toggleHud = toggle => {
        if (toggle === true) user.updateHud()
        if (user.logged) ui.send('client::hud', 'toggle', {
            status: toggle
        })
        mp.game.ui.displayRadar(toggle)
    }
    user.updateHud = (changedata, log = true) => {
        if (!user.logged) return
        logger.log('Обновление интерфейса')
        ui.send('client::hud', 'toggle', {
            status: user.accSettings.hud_toggle
        })


        if (changedata !== undefined) ui.send('client::hud', 'update', changedata, log)
        else {
            const keys = []
            for (var key in user.keys) {
                if (user.admin >= user.keys[key].isAdmin
                    && !user.keys[key].noChange
                    && !user.keys[key].noView) keys.push({
                        name: user.keys[key].desc,
                        key: user.keys[key].key
                    })

                if (key === 'hud_toggleHint') ui.send('client::hud', 'keysToggleKey', {
                    key: user.keys[key].key
                })
            }

            ui.send('client::hud', 'update', {
                greenzone: false,
                wanted: 0,
                cash: user.cash,
                weapon: [0, '', 0, 0],
                quests: user.quests,
                keys: keys,
                keysToggle: user.accSettings.hud_toggleHint,
                stats: {
                    online: [mp.players.length, user._maxPlayersServer],
                    id: mp.players.local.remoteId,
                    name: mp.players.local.getVariable('charName'),
                    micro: !mp.voiceChat.muted,
                    weather: ['Неизвестно', 0],
                    gps: func.getStreetNames()
                },
                chatSettings: {
                    timestamp: false
                },
                chatIDS: ['IC', 'OOC'],
                chatIDSToggle: user.accSettings.hud_toggleChatChoice,
                satiety: [100, 100]
            }, log)
            ui.send('client::hud', 'speedometr', {
                speedometrKeys: {
                    belt: user.keys['vehicle_belt'].key,
                    engine: user.keys['vehicle_engine'].key,
                    lights: 'H',
                    doors: user.keys['vehicle_locked'].key
                }
            })
        }
    }

    user.camera = null
    user.setCamera = (position, atCoord, data = {}) => {
        if (user.camera) user.destroyCamera()

        user.camera = mp.cameras.new('default', position, new mp.Vector3(0, 0, 0), data.fov ? data.fov : 40)
        user.camera.pointAtCoord(atCoord[0], atCoord[1], atCoord[2])

        user.camera.setActive(true)
        if (data.render === undefined
            || data.render === true) mp.game.cam.renderScriptCams(true, data.ease ? true : false, data.ease ? data.ease : 0, false, false)

        user.toggleHud(false)
    }
    user.destroyCamera = (data = {}) => {
        if (!user.camera) return
        if (!data.renderDisable || data.renderDisable === false) mp.game.cam.renderScriptCams(false, data.ease ? true : false, data.ease ? data.ease : 0, false, false)

        user.camera.destroy()
        user.camera = null

        user.toggleHud(true)
    }
    user.setCameraToPlayer = (data = {}) => {
        const playerPosition = mp.players.local.position
        const cameraPosition = func.getCameraOffset(new mp.Vector3(playerPosition.x, playerPosition.y, playerPosition.z + (data.height || 0.5)), mp.players.local.getHeading() + (data.angle || 90), data.dist || 1.5)

        user.setCamera([cameraPosition.x, cameraPosition.y, cameraPosition.z], [playerPosition.x, playerPosition.y, playerPosition.z + (data.height || 0.5)], {
            ease: data.ease
        })
    }

    user.cursorStatus = false
    user.escStatus = true
    user.escStatusTimer = null

    user.cursor = (toggle, toggleESC = null) => {
        mp.gui.cursor.show(toggle, toggle)
        user.cursorStatus = toggle

        if (toggleESC !== null) {
            if (toggleESC === true) {
                if (user.escStatusTimer) clearTimeout(user.escStatusTimer)
                user.escStatusTimer = setTimeout(() => {
                    user.escStatus = true

                    clearTimeout(user.escStatusTimer)
                    user.escStatusTimer = null
                }, 1500)
            }
            else {
                user.escStatus = false

                clearTimeout(user.escStatusTimer)
                user.escStatusTimer = null
            }
        }
    }

    user.notify = (text, type = 'success', time = 5000) => {
        ui.send('client::notf', 'add', {
            type,
            text,
            time
        })
    }

    user.setVW = vw => {
        mp.events.callRemote('client::user:setVW', vw)
    }
    user.loadScreen = (toggle, duration = 500) => {
        user.toggleHud(!toggle)
        toggle ? mp.game.cam.doScreenFadeOut(duration) : mp.game.cam.doScreenFadeIn(duration)
    }

    user.freeze = (status) => {
        mp.players.local.freezePosition(status)
    }

    user.resetSkin = (settings, gender) => {
        mp.events.callRemote("client::user:resetSkin", JSON.stringify(settings), gender)
    }
    user.setClothes = (clothes, save = false) => {
        mp.events.callRemote("client::user:setClothes", typeof clothes === 'object' ? JSON.stringify(clothes) : clothes, false)
    }


    user.save = () => {
        mp.events.callRemote('client::user:save')
    }

    user.toggleActionText = (toggle, keyName = 'E', message = 'Нажмите для взаимодействия') => {
        ui.send('client::hud', 'keynotf', {
            toggle,
            key: keyName,
            message
        })
    }

    user.marker = null
    user.markerBlip = null
    user.markerColshape = null
    user.markerEnabled = false
    user.markerType = 0
    user.houseBlip = null
    user.createHouseBlip = (x, y, z,) => {
        user.houseBlip = mp.blips.new(1, new mp.Vector3(x, y, z),
            {
                name: 'Дом',
                color: 1,
                shortRange: false
            })
    }
    user.removeHouseBlip = () => {
        user.houseBlip.destroy()
    }
    user.setMarker = (x, y, z, dimension = -1, name = '', routeFor = false, blipColor = 1, blipType = 1 ) => {
        if (user.marker) user.destroyMarker()
        if (dimension === -1) dimension = mp.players.local.dimension


        user.marker = mp.markers.new(1, new mp.Vector3(x, y, z), 2,
            {
                color: [255, 255, 255, 255],
                dimension: 0
            })
        user.markerBlip = mp.blips.new(blipType, new mp.Vector3(x, y, z),
            {
                name: name.length ? name : 'Маркер',
                scale: 1,
                dimension: dimension,
                color: blipColor,
                shortRange: false
            })
        user.markerBlip.setRoute(true);
        user.marker.name = name
        user.markerEnabled = false

        user.markerType = 1
    }
    user.destroyMarker = () => {
        if (!user.marker) return

        user.marker.destroy()
        user.markerBlip.destroy()

        user.marker = null
    }
    user.setColshape = (x, y, z, dimension = -1, name = '', veh, needToBeOnFoot = false) => {
        const localPlayer = mp.players.local
        if (user.markerColshape) user.destroyColshape()
        if (dimension === -1) dimension = mp.players.local.dimension
        user.markerColshape = mp.colshapes.newSphere(x, y, z, 2, 0)
        let status = false
        
        let interval = setInterval(() => {
            if (Math.round(func.distance2D({
                x: localPlayer.position.x,
                y: localPlayer.position.y,
            }, {
                x: x,
                y: y

            })) < 6) {
                if (needToBeOnFoot === true) {
                    
                    if (name === 'port' && status === false) {
                        status = true

                        mp.events.callRemote("client::port")
                        clearInterval(interval)


                        
                        return
                        // mp.events.callRemote("client::garbage", veh, pos)
                    }
                    if(!veh) return
                    let pos = veh.getWorldPositionOfBone(veh.getBoneIndexByName('platelight'))

                    if (!mp.players.local.vehicle) {
                        user.destroyColshape()
                        user.destroyMarker()
                        user.notify(`Вы приехали на место.`)
                        if (name === 'garbage') {
                            mp.events.callRemote("client::garbage", veh, pos)
                        }
                        if (name === 'garbageLast') {
                            mp.events.callRemote("client::garbage:success", veh)
                            // mp.events.callRemote("client::garbage", veh, pos)
                        }
                        if (name === 'leaflets') {
                            mp.events.callRemote("client::leaflets", veh)
                        }
                        clearInterval(interval)
                    }
                } else {
                    user.destroyColshape()
                    user.destroyMarker()
                   
                    
                    clearInterval(interval)
                }



            }







        }, 2000);

    }
    user.destroyColshape = () => {
        if (!user.markerColshape) return

        user.markerColshape.destroy()


        user.markerColshape = null
    }
    user.setRaceMarker = (x, y, z, dimension = -1, name = '') => {
        if (user.marker) user.destroyMarker()
        if (dimension === -1) dimension = mp.players.local.dimension

        user.marker = mp.markers.new(2, new mp.Vector3(x, y, z), 1,
            {
                color: [255, 255, 255, 100],
                dimension: dimension,
                scale: 5.0
            })
        user.markerBlip = mp.blips.new(1, new mp.Vector3(x, y, z),
            {
                name: name.length ? name : 'Маркер',
                scale: 1,
                dimension: dimension
            })

        user.marker.name = name
        user.markerEnabled = false

        user.markerType = 1
    }

    user.setPos = (x, y, z, a = -1, vw = -1) => {
        mp.events.callRemote('client::user:setPos', x, y, z, a, vw)
    }

    user.setBlipDisplay = (blip, display) => {
        blip.setDisplay(display)
    }


    user.npcdialog = {}
    user.npcdialogShow = (id, title, desc, text, btns) => {
        ui.send('client::npcdialog', 'show', {
            id, title, desc, text, btns
        })

        user.cursor(true)
        user.npcdialog = id
    }
    user.npcdialogHide = () => {
        ui.send('client::npcdialog', 'hide')
        user.cursor(false)
    }

    exports = user
}
catch (e) {
    logger.error('user.js', e)
}
