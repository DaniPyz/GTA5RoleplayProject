const logger = require('../modules/logger')
const sys_works_cab = require('./works/cab')
const sys_works_farm = require('./works/farm')
const sys_works_port = require('./works/port')
const sys_works_garbage = require('./works/garbage')
const sys_works_leaflets = require('./works/leaflets')


const works = [

]
try {
    const container = require('../modules/container')
    const user = require('../user')
    const chat = require('../chat')
    const sys_vehicle = require('./vehicle')
    const func = require('../modules/func')
    const SHARED_FRACTIONS_DATA = require('../../../../src/shared/constants')

    const sys_npc = {}

    sys_npc.create = (position, hash, name, model, data = {}) => {
        const id = container.free('npc')

        container.set('npc', id, 'state', true)
        container.set('npc', id, 'name', name)

        container.set('npc', id, 'position', {
            x: position[0],
            y: position[1],
            z: position[2],
            a: position[3],
            vw: position[4]
        })
        container.set('npc', id, 'hash', hash)

        container.set('npc', id, 'model', model)
        container.set('npc', id, 'desc', data.desc || '')

        container.set('npc', id, '_label', mp.labels.new(`${name}${data.desc ? `\n~c~${data.desc}` : ''}`, new mp.Vector3(position[0], position[1], position[2]), {
            los: false,
            font: 0,
            drawDistance: 4,
            dimension: position[4]
        }))
        container.set('npc', id, '_colshape', mp.colshapes.newCircle(position[0], position[1], 2.5, position[4])).setVariable('npcID', id)
        if (data.blip) container.set('npc', id, '_blip', mp.blips.new(data.blipType || data.blip, new mp.Vector3(position[0], position[1], position[2]), {
            name: data.blipName || "Персонаж: " + name,
            color: data.blipColor || 53,
            shortRange: true
        }))
    }

    sys_npc.isState = id => {
        return container.get('npc', id, 'state')
    }
    sys_npc.nearPlayer = (player, id = -1) => {
        if (!user.isLogged(player)) return -1

        if (id === -1) id = user.getNears(player).npc
        if (!sys_npc.isState(id)) {
            if (id === user.getNears(player).npc) user.removeNear(player, 'npc')
            return -1
        }

        if (func.distance2D(player.position, new mp.Vector3(sys_npc.getPosition(id).x, sys_npc.getPosition(id).y, sys_npc.getPosition(id).z)) >= 3.5
            || player.dimension !== sys_npc.getPosition(id).vw) {
            if (id === user.getNears(player).npc) user.removeNear(player, 'npc')
            return -1
        }

        return id
    }

    sys_npc.getName = id => {
        if (!sys_npc.isState(id)) return 'None'
        return container.get('npc', id, 'name')
    }
    sys_npc.getDesc = id => {
        if (!sys_npc.isState(id)) return 'None'
        return container.get('npc', id, 'desc')
    }

    sys_npc.getHash = id => {
        if (!sys_npc.isState(id)) return '-'
        return container.get('npc', id, 'hash')
    }
    sys_npc.getPosition = id => {
        if (!sys_npc.isState(id)) return {}
        return container.get('npc', id, 'position')
    }

    sys_npc.setCamera = (player, id) => {
        if (!user.isLogged(player)
            || !sys_npc.isState(id)) return
        if (sys_npc.nearPlayer(player, id) !== id) return

        const cameraPosition = func.getCameraOffset(new mp.Vector3(sys_npc.getPosition(id).x, sys_npc.getPosition(id).y, sys_npc.getPosition(id).z + 0.5), sys_npc.getPosition(id).a + 90, 1.3)
        user.setCamera(player, cameraPosition, [sys_npc.getPosition(id).x, sys_npc.getPosition(id).y, sys_npc.getPosition(id).z + 0.5], {
            ease: 1000
        })
    }


    // Events
    sys_npc.enterColshape = (player, shape) => {
        const id = shape.getVariable('npcID')
        if (!sys_npc.isState(id)) return

        if (sys_npc.nearPlayer(player, id) === id) user.setNear(player, 'npc', id)
        else return

        user.toggleActionText(player, true, 'E', `Нажмите, чтобы повогорить с ${sys_npc.getName(id)}`)
    }
    sys_npc.exitColshape = (player, shape) => {
        const id = shape.getVariable('npcID')
        if (!sys_npc.isState(id)) return

        user.removeNear(player, 'npc')
        user.toggleActionText(player, false)
    }

    sys_npc.action = player => {
        const id = sys_npc.nearPlayer(player)
        if (id === -1) return

        switch (sys_npc.getHash(id)) {
            case 'testnpc':
                {
                    sys_npc.setCamera(player, id)
                    user.npcdialogShow(player, 'testnpc', 'Джордж', 'Тестовый NPC', 'Привет, я тестовый NPC, показываю систему NPC и диалогов с ними. Ты что-то хотел от меня?', ['Да', 'Нет'])

                    player._npcDialogCallback = (id, btn) => {
                        if (btn === 0) {
                            user.npcdialogShow(player, 'testnpc', 'Джордж', 'Тестовый NPC', 'Хорошо, что тебе нужно?', ['Дай деняк', 'Дай админку', 'Уже ничего'])
                            player._npcDialogCallback = (id, btn) => {
                                if (btn === 0) {
                                    user.giveCash(player, 10000000)
                                    user.npcdialogShow(player, 'testnpc', 'Джордж', 'Тестовый NPC', 'Сюриесли? Ну ладно, могу дать не много')
                                }
                                else if (btn === 1) {
                                    if (user.isAdmin(player)) user.npcdialogShow(player, 'testnpc', 'Джордж', 'Тестовый NPC', 'Но у тебя же уже есть админка... Больше я тебе не дам')
                                    else {
                                        container.set('user', player.id, 'user_admin', 1)
                                        user.save(player)

                                        user.npcdialogShow(player, 'testnpc', 'Джордж', 'Тестовый NPC', 'Ладно, держи. Только не балуйся с ней :)')
                                    }
                                }
                                else if (btn === 2) user.npcdialogShow(player, 'testnpc', 'Джордж', 'Тестовый NPC', 'Ну, тогда еще увидемся')

                                setTimeout(() => {
                                    user.npcdialogHide(player)
                                    user.destroyCamera(player, { ease: 1000 })
                                }, 3000)
                            }
                        }
                        else {
                            user.npcdialogHide(player)
                            user.destroyCamera(player, { ease: 1000 })
                        }
                    }
                    break
                }
            case 'motoBike':
                {
                    sys_npc.setCamera(player, id)
                    user.npcdialogShow(player, 'motoBike', 'Андрей', 'NPC дает в аренду мопеды', 'Привет, я могу предложить тебе взять в аренду мотоцикл.', ['Да', 'Нет'])

                    player._npcDialogCallback = (id, btn) => {
                        if (btn === 0) {
                            user.npcdialogShow(player, 'motoBike', 'Андрей', 'NPC дает в аренду мопеды', 'Какой мопед ты хочешь взять в аренду', ['За 100$', 'За 200$'])
                            player._npcDialogCallback = (id, btn) => {
                                if (btn === 0) {
                                    user.removeCash(player, 100)
                                    sys_vehicle.createRent(player, "oppressor", [player.position.x + 10, player.position.y + 10, player.position.z])
                                    user.npcdialogShow(player, 'motoBike', 'Андрей', 'NPC дает в аренду мопеды', 'Вот твой мопед за 100$')
                                    user.npcdialogHide(player)
                                    user.destroyCamera(player, { ease: 1000 })

                                }
                                else if (btn === 1) {
                                    user.removeCash(player, 100)
                                    sys_vehicle.createRent(player, "oppressor2", [player.position.x + 10, player.position.y + 10, player.position.z])
                                    user.npcdialogShow(player, 'motoBike', 'Андрей', 'NPC дает в аренду мопеды', 'Вот твой мопед за 200$')
                                    user.npcdialogHide(player)
                                    user.destroyCamera(player, { ease: 1000 })

                                }


                                setTimeout(() => {
                                    user.npcdialogHide(player)
                                    user.destroyCamera(player, { ease: 1000 })
                                }, 3000)
                            }
                        }
                        else {
                            user.npcdialogHide(player)
                            user.destroyCamera(player, { ease: 1000 })
                        }
                    }
                    break
                }
            case 'portnpc':
                {
                    const workId = 0
                    const npcId = 'portnpc'
                    const npcName = 'Derec'
                    const npcDesc = 'NPC устраивает вас на работу в порту'
                    sys_npc.setCamera(player, id)

                    sys_works_port.isWorking(player)
                    if (sys_works_port.isWorking(player) && sys_works_port.isWorkingOnIdWork(player, workId)) {

                        user.npcdialogShow(player, npcId, npcName, 'NPC устраивает вас на работу в порту', 'Снова привет, хочешь закончить смену?', ['Да', 'Нет'])
                        player._npcDialogCallback = (id, btn) => {
                            if (btn === 0) {
                                user.updateClothes(player)
                                container.clear('user', player.id, "work")

                                // setTimeout(() => {
                                user.npcdialogHide(player)
                                user.destroyCamera(player, { ease: 1000 })
                                // }, 3000)
                            }
                            else {
                                user.npcdialogHide(player)
                                user.destroyCamera(player, { ease: 1000 })
                            }
                        }
                    } else {
                        user.npcdialogShow(player, npcId, npcName, 'NPC устраивает вас на работу в порту', 'Привет, хочешь устроиться на работу в порту?', ['Да', 'Нет'])

                        player._npcDialogCallback = (id, btn) => {
                            if (btn === 0) {
                                if (container.has('user', player.id, "work") === true) {
                                    user.notify(player, `Сначала увольтесь с прошлой работы`, 'error')
                                    user.npcdialogHide(player)
                                    user.destroyCamera(player, { ease: 1000 })
                                    return
                                }

                                player.call('server::user:setMarker', [-374.61431884765625, -2809.68994140625, 3.000308513641357, 0, 'Точка приема', true, 77, 371])
                                container.set('user', player.id, "work", [workId, 1])
                                user.setClothes(player, 'work', false)







                                // setTimeout(() => {
                                user.npcdialogHide(player)
                                user.destroyCamera(player, { ease: 1000 })
                                // }, 3000)
                            }
                            else {
                                user.npcdialogHide(player)
                                user.destroyCamera(player, { ease: 1000 })
                            }
                        }
                    }
                    break
                }
            case 'farmnpc': {
                const workId = 1
                const npcId = 'farmnpc'
                const npcName = 'Andrew'
                const npcDesc = 'NPC устраивает вас на ферму'
                sys_npc.setCamera(player, id)


                if (sys_works_farm.isWorking(player) && sys_works_farm.isWorkingOnIdWork(player, workId)) {

                    user.npcdialogShow(player, npcId, npcName, npcDesc, 'Снова привет, что хочешь делать?', ['Закончить смену', 'Купить семена', 'Пойти дальше'])
                    player._npcDialogCallback = (id, btn) => {
                        if (btn === 0) {
                            user.updateClothes(player)
                            container.clear('user', player.id, "work")

                            // setTimeout(() => {
                            user.npcdialogHide(player)
                            user.destroyCamera(player, { ease: 1000 })
                            // }, 3000)
                        }
                        else if (btn === 1) {
                            user.addInventory(player, 10)
                            user.npcdialogHide(player)
                            user.destroyCamera(player, { ease: 1000 })
                        }
                        else {
                            user.npcdialogHide(player)
                            user.destroyCamera(player, { ease: 1000 })
                        }
                    }
                } else {
                    user.npcdialogShow(player, npcId, npcName, npcDesc, 'Привет, хочешь устроиться на ферму?', ['Да', 'Нет'])

                    player._npcDialogCallback = (id, btn) => {
                        if (btn === 0) {
                            if (container.has('user', player.id, "work") === true) {
                                user.notify(player, `Сначала увольтесь с прошлой работы`, 'error')
                                user.npcdialogHide(player)
                                user.destroyCamera(player, { ease: 1000 })
                                return
                            }
                            container.set('user', player.id, "work", [workId, 1])
                            user.setClothes(player, 'work', false)
                            user.notify(player, 'Теперь иди на поле и сажай семена.')
                            // setTimeout(() => {
                            user.npcdialogHide(player)
                            user.destroyCamera(player, { ease: 1000 })
                            // }, 3000)
                        }
                        else {
                            user.npcdialogHide(player)
                            user.destroyCamera(player, { ease: 1000 })
                        }
                    }
                }
                break
            }
            case 'farmnpcbuy': {
                const workId = 1
                const npcId = 'farmnpcbuy'
                const npcName = 'Michael'
                const npcDesc = 'NPC покапает у вас растения'
                sys_npc.setCamera(player, id)



                user.npcdialogShow(player, npcId, npcName, npcDesc, 'Привет, хочешь продать все что насобирал?', ['Продать', 'Я пойду дальше'])

                player._npcDialogCallback = (id, btn) => {
                    if (btn === 0) {
                        user.removeInventory(player, 11)
                        user.giveCash(player, 500)
                        // // setTimeout(() => {
                        // user.npcdialogHide(player)
                        // user.destroyCamera(player, { ease: 1000 })
                        // // }, 3000)
                    }
                    else {
                        user.npcdialogHide(player)
                        user.destroyCamera(player, { ease: 1000 })
                    }

                }
                break
            }
            case 'cabnpc': {
                const workId = 2
                const npcId = 'cabnpc'
                const npcName = 'Frederico'
                const npcDesc = 'NPC устраивает вас на работу в такси'
                sys_npc.setCamera(player, id)

                sys_works_cab.isWorking(player)
                if (sys_works_cab.isWorking(player) && sys_works_cab.isWorkingOnIdWork(player, workId)) {

                    user.npcdialogShow(player, npcId, npcName, npcDesc, 'Снова привет, хочешь закончить смену?', ['Да', 'Нет'])
                    player._npcDialogCallback = (id, btn) => {
                        if (btn === 0) {
                            container.set('work', workId, 'online', container.get('work', workId, 'online') - 1)
                            user.updateClothes(player)
                            container.clear('user', player.id, "work")
                            if (container.get('user', player.id, 'rentVehicle') !== null) {
                                // container.get('user', player.id, 'rentVehicle').vehicle
                                container.get('vehicles', container.get('user', player.id, 'rentVehicle').vehicle.id, 'owner').cab

                                sys_works_cab.respawnCar(player, container.get('user', player.id, 'rentVehicle').vehicle.numberPlate.split(' ')[1])
                                sys_vehicle.destroy(container.get('user', player.id, 'rentVehicle').vehicle.id)
                            }



                            // setTimeout(() => {
                            user.npcdialogHide(player)
                            user.destroyCamera(player, { ease: 1000 })
                            // }, 3000)
                        }
                        else {
                            user.npcdialogHide(player)
                            user.destroyCamera(player, { ease: 1000 })
                        }
                    }
                } else {
                    user.npcdialogShow(player, npcId, npcName, npcDesc, 'Привет, хочешь устроиться на работу в такси?', ['Да', 'Нет'])

                    player._npcDialogCallback = (id, btn) => {
                        if (btn === 0) {
                            if (container.has('user', player.id, "work") === true) {
                                user.notify(player, `Сначала увольтесь с прошлой работы`, 'error')
                                user.npcdialogHide(player)
                                user.destroyCamera(player, { ease: 1000 })
                                return
                            }
                            container.set('work', workId, 'online', container.get('work', workId, 'online') + 1)
                            container.set('user', player.id, "work", [workId, 1])
                            user.setClothes(player, 'work', false)

                            // setTimeout(() => {
                            user.npcdialogHide(player)
                            user.destroyCamera(player, { ease: 1000 })
                            // }, 3000)
                        }
                        else {
                            user.npcdialogHide(player)
                            user.destroyCamera(player, { ease: 1000 })
                        }
                    }
                }

                break
            }
            case 'garbagenpc': {
                const workId = 3
                const npcId = 'garbagenpc'
                const npcName = 'Andreas'
                const npcDesc = 'NPC устраивает вас на работу мусоровозом'
                sys_npc.setCamera(player, id)
                if (sys_works_garbage.isWorkingOnIdWork(player, workId)) {

                    user.npcdialogShow(player, npcId, npcName, npcDesc, 'Снова привет, хочешь закончить смену?', ['Да', 'Нет'])
                    player._npcDialogCallback = (id, btn) => {
                        if (btn === 0) {
                            container.set('work', workId, 'online', container.get('work', workId, 'online') - 1)
                            user.updateClothes(player)
                            container.clear('user', player.id, "work")
                            if (container.get('user', player.id, 'rentVehicle') !== null) {
                                // container.get('user', player.id, 'rentVehicle').vehicle
                                container.get('vehicles', container.get('user', player.id, 'rentVehicle').vehicle.id, 'owner').garbage

                                sys_works_garbage.respawnCar(player, container.get('user', player.id, 'rentVehicle').vehicle.numberPlate.split(' ')[1])
                                sys_vehicle.destroy(container.get('user', player.id, 'rentVehicle').vehicle.id)
                            }
                            player.call('server::user:destroyMarker')
                            player.call('server::user:destroyColshape')


                            // setTimeout(() => {
                            user.npcdialogHide(player)
                            user.destroyCamera(player, { ease: 1000 })
                            // }, 3000)
                        }
                        else {
                            user.npcdialogHide(player)
                            user.destroyCamera(player, { ease: 1000 })
                        }
                    }
                } else {
                    user.npcdialogShow(player, npcId, npcName, npcDesc, 'Привет, хочешь устроиться на работу мусоровозом?', ['Да', 'Нет'])

                    player._npcDialogCallback = (id, btn) => {

                        if (btn === 0) {
                            if (container.has('user', player.id, "work") === true) {
                                user.notify(player, `Сначала увольтесь с прошлой работы`, 'error')
                                user.npcdialogHide(player)
                                user.destroyCamera(player, { ease: 1000 })
                                return
                            }
                            container.set('work', workId, 'online', container.get('work', workId, 'online') + 1)
                            container.set('user', player.id, "work", [workId, 1])
                            user.setClothes(player, 'work', false)

                            // setTimeout(() => {
                            user.npcdialogHide(player)
                            user.destroyCamera(player, { ease: 1000 })
                            // }, 3000)
                        }
                        else {
                            user.npcdialogHide(player)
                            user.destroyCamera(player, { ease: 1000 })
                        }
                    }
                }

                break
            }
            case 'leafletsnpc': {
                const workId = 4
                const npcId = 'leafletsnpc'
                const npcName = 'Garcia'
                const npcDesc = 'NPC устраивает вас на работу по раздаче листовок'
                sys_npc.setCamera(player, id)
                if (sys_works_leaflets.isWorkingOnIdWork(player, workId)) {

                    user.npcdialogShow(player, npcId, npcName, npcDesc, 'Снова привет, хочешь закончить смену?', ['Да', 'Нет'])
                    player._npcDialogCallback = (id, btn) => {
                        if (btn === 0) {
                            container.set('work', workId, 'online', container.get('work', workId, 'online') - 1)
                            user.updateClothes(player)
                            container.clear('user', player.id, "work")
                            if (container.get('user', player.id, 'rentVehicle') !== null) {
                                // container.get('user', player.id, 'rentVehicle').vehicle
                                container.get('vehicles', container.get('user', player.id, 'rentVehicle').vehicle.id, 'owner').leaflets

                                sys_works_leaflets.respawnCar(player, container.get('user', player.id, 'rentVehicle').vehicle.numberPlate.split(' ')[1])
                                sys_vehicle.destroy(container.get('user', player.id, 'rentVehicle').vehicle.id)
                            }
                            player.call('server::user:destroyMarker')
                            player.call('server::user:destroyColshape')


                            // setTimeout(() => {
                            user.npcdialogHide(player)
                            user.destroyCamera(player, { ease: 1000 })
                            // }, 3000)
                        }
                        else {
                            user.npcdialogHide(player)
                            user.destroyCamera(player, { ease: 1000 })
                        }
                    }
                } else {
                    user.npcdialogShow(player, npcId, npcName, npcDesc, 'Привет, хочешь устроиться на работу по раздаче листовок?', ['Да', 'Нет'])

                    player._npcDialogCallback = (id, btn) => {

                        if (btn === 0) {
                            if (container.has('user', player.id, "work") === true) {
                                user.notify(player, `Сначала увольтесь с прошлой работы`, 'error')
                                user.npcdialogHide(player)
                                user.destroyCamera(player, { ease: 1000 })
                                return
                            }
                            container.set('work', workId, 'online', container.get('work', workId, 'online') + 1)
                            container.set('user', player.id, "work", [workId, 1])
                            user.setClothes(player, 'work', false)

                            // setTimeout(() => {
                            user.npcdialogHide(player)
                            user.destroyCamera(player, { ease: 1000 })
                            // }, 3000)
                        }
                        else {
                            user.npcdialogHide(player)
                            user.destroyCamera(player, { ease: 1000 })
                        }
                    }
                }

                break
            }
            case 'fractionlspdnpc': {
                let fractionId = 2
                const npcId = 'fractionlspdnpc'
                const npcName = 'Andreas'
                const npcDesc = 'NPC Выдает оружие'
                sys_npc.setCamera(player, id)
                if (user.isWorkingAtIdFraction(player, fractionId)) {

                    user.npcdialogShow(player, npcId, npcName, npcDesc, 'Снова привет, хочешь сдать все оружие?', ['Да', 'Нет'])
                    player._npcDialogCallback = (id, btn) => {
                        if (btn === 0) {



                            // setTimeout(() => {
                            user.npcdialogHide(player)
                            user.destroyCamera(player, { ease: 1000 })
                            // }, 3000)
                        }
                        else {
                            user.npcdialogHide(player)
                            user.destroyCamera(player, { ease: 1000 })
                        }
                    }
                } else {
                    user.npcdialogShow(player, npcId, npcName, npcDesc, 'Привет, хочешь получить оружие?', ['Да', 'Нет'])

                    player._npcDialogCallback = (id, btn) => {

                        if (btn === 0) {

                            SHARED_FRACTIONS_DATA[--player.character.fractionId][--player.character.fractionRank].weapons.map(el => {
                                player.giveWeapon(mp.joaat(el), 1000);
                            })


                            // setTimeout(() => {
                            user.npcdialogHide(player)
                            user.destroyCamera(player, { ease: 1000 })
                            // }, 3000)
                        }
                        else {
                            user.npcdialogHide(player)
                            user.destroyCamera(player, { ease: 1000 })
                        }
                    }
                }

                break
            }
        }
    }

    module.exports = sys_npc
}
catch (e) {
    logger.error('systems/npc')
}