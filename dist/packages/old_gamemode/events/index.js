require('./logger')
require('./user')
require('./chat')
require('./newServer')
require('./other')
require('./vehicle')
require('./autosalon')

const mysql = require('../plugins/mysql')

const logger = require('../modules/logger')
const user = require('../user')
const container = require('../modules/container')

const sys_report = require('../systems/report')
const sys_npc = require('../systems/npc')
const sys_vehicle = require('../systems/vehicle')

const houses = require('../property/houses')

const logs = require('../modules/logs')

const { keys } = require('../modules/keys')
const sys_interaction = require('../systems/interactionmenu')
const sys_works_port = require('../systems/works/port')
const sys_works_farm = require('../systems/works/farm')
const sys_works_cab = require('../systems/works/cab')
const sys_works_garbage = require('../systems/works/garbage')
const sys_works_leaflets = require('../systems/works/leaflets')
const biz = require('../property/biz')

mp.events.add('client::key', (player, data) => {
    data = JSON.parse(data)
    for (var key in container.get('user', player.id, 'user_keysSettings')) {
        if (container.get('user', player.id, 'user_keysSettings')[key].keyCode === data.keyCode
            || container.get('user', player.id, 'user_keysSettings')[key].keyCode === data.keyCode[0]
            || (typeof container.get('user', player.id, 'user_keysSettings')[key].keyCode === 'object'
                && container.get('user', player.id, 'user_keysSettings')[key].keyCode.length >= 2
                && container.get('user', player.id, 'user_keysSettings')[key].keyCode[0] === data.keyCode[0]
                && container.get('user', player.id, 'user_keysSettings')[key].keyCode[1] === data.keyCode[1])
            || (typeof data.keyCode === 'object'
                && data.keyCode.indexOf(container.get('user', player.id, 'user_keysSettings')[key].keyCode) !== -1)) keys[key].func(player, data.up)
    }
})

mp.events.add({
    'playerQuit': (player, exitType, reason) => {
        mp.players.forEach(pl => {
            user.updateHud(pl)
        })

        if (user.isLogged(player)) {
            if (container.get('user', player.id, '_roulleteGo') === true) {
                container.get('user', player.id, '_roulleteGo', false)
                user.giveDonate(player, 350)
            }

            for (var key in container.all('reports')) {
                if (container.all('reports')[key].creator_uid === user.getCharID(player)) container.set('reports', key, 'creator', undefined)
            }
            mp.players.forEach(pl => {
                if (user.isOpened(pl, 'adminmenu')) user.uiSend(pl, 'client::admin', 'updateReports', sys_report.getForAdmin())
            })

            mysql.query('update users set online = -1, onlineChar = -1 where id = ?', [user.getID(player)], err => {
                if (err) return logger.error('playerQuit', err)
            })

            logs.send('user', user.getID(player), `Вышел с сервера. Персонаж: ${user.getCharName(player)}. IP: ${player.ip};`, {
                charid: user.charID(player),
                ip: player.ip
            })

            user.save(player)
        }

        container.delete('user', player.id)
    },

    'playerEnterColshape': (player, shape) => {
        
        sys_npc.enterColshape(player, shape)
        // sys_interaction.enterColshape(player, shape)
        sys_works_farm.enterColshape(player, shape)
        houses.enterColshape(player, shape)
        sys_works_port.enterColshape(player, shape)
        biz.enterColshape(player, shape)
      
    },
    'playerExitColshape': (player, shape) => {
        sys_npc.exitColshape(player, shape)
        // sys_interaction.exitColshape(player, shape)
        sys_works_port.exitColshape(player, shape)
        sys_works_farm.exitColshape(player, shape)
        houses.exitColshape(player, shape)
        biz.exitColshape(player, shape)
    },

    'playerDeath': (player, reason, killer) => {
        if (!user.isLogged(player)) return user.kick(player)
        // player.setToRagdoll(1000, 1000, 0, true, true, true);

        user.uiSend(player, 'client::death', 'death', {
            timer: 30000
        })
        
        user.toggleHud(player, false)
        user.cursor(player, true)

        container.set('user', player.id, '_death', true)
        container.set('user', player.id, '_deathPos', {
            x: player.position.x,
            y: player.position.y,
            z: player.position.z,
            a: player.position.heading,
            vw: player.dimension
        })
        
        player._death = true  
        // mp.colshapes.newSphere(player.position.x, player.position.y, player.position.z, 1, 0).setVariable('deathPlayerID', player.id)
        // user.freeze(player, true)
    },

    'playerEnterVehicle': (player, vech, seat) => {
        const veh = sys_vehicle.getVehicle(vech.id)

        if (veh.model == 3338918751) {
            sys_works_cab.enterCar(player, vech, seat)

        } else if (veh.model == 1917016601) {

            sys_works_garbage.enterCar(player, vech, seat)


        } else if (veh.model == 3117103977) {

            sys_works_leaflets.enterCar(player, vech, seat)


        } else {
            sys_vehicle.onEnter(player, vech, seat)
        }

    },
    'playerExitVehicle': (player, vech) => {
        const veh = sys_vehicle.getVehicle(vech.id)

        if (veh.model == 3338918751) {
            sys_works_cab.exitCar(player, vech)

        } else if (veh.model == 1917016601) {

            sys_works_garbage.exitCar(player, vech)


        } else if (veh.model == 3117103977) {

            sys_works_leaflets.exitCar(player, vech)


        }
        sys_vehicle.onExit(player, vech)


    }
})