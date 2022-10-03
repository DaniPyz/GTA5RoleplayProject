const logger = require('../modules/logger')
try {
    const enums = require('../plugins/enums')
    const mysql = require('../plugins/mysql')

    const user = require('../user')
    const chat = require('../chat')

    const func = require('../modules/func')
    const container = require('../modules/container')


    const sys_vehicle = {}

    sys_vehicle.load = () => {
        mysql.query('select * from vehicles', [], (err, res) => {
            if (err) return logger.error('sys_vehicle.load', err)

            let veh
            let count = 0

            res.forEach(item => {
                veh = sys_vehicle.create(item.model, [JSON.parse(item.position).x, JSON.parse(item.position).y, JSON.parse(item.position).z], {
                    number: item.number,
                    color: JSON.parse(item.color),
                    locked: item.locked,
                    heading: item.heading,
                    mileage: item.mileage,
                    fuel: item.fuel,
                    owner: JSON.parse(item.owner),
                    dimension: item.dimension
                })

                if (veh) {
                    count++

                    container.set('vehicles', veh.id, 'id', item.id)
                    container.set('vehicles', veh.id, 'save', true)
                }
            })

            logger.mysqlLog(`Транспорта загружено: ${res.length}, из них ${count} создано`)
        })
    }
    sys_vehicle.create = (model, position, data = {}) => {
        if (!enums.vehiclesData[model]) enums.addVehiclesData(model)

        const settingsVeh = {}

        settingsVeh.numberPlate = data.number || 'NONE'
        if (data.color === undefined) data.color = [[255, 255, 255], [255, 255, 255]]

        if (data.alpha) settingsVeh.alpha = data.alpha
        settingsVeh.locked = data.locked === undefined ? false : data.locked
        settingsVeh.engine = data.engine === undefined ? false : data.engine
        if (data.heading) settingsVeh.heading = data.heading
        if (data.dimension) settingsVeh.dimension = data.dimension

        const veh = mp.vehicles.new(mp.joaat(model), new mp.Vector3(position[0], position[1], position[2]), settingsVeh)
        container.delete('vehicles', veh.id)

        veh.setColorRGB(data.color[0][0], data.color[0][1], data.color[0][2], data.color[1][0], data.color[1][1], data.color[1][2])

        container.set('vehicles', veh.id, 'model', model)

        container.set('vehicles', veh.id, 'engine', settingsVeh.engine)
        container.set('vehicles', veh.id, 'locked', settingsVeh.locked)

        container.set('vehicles', veh.id, 'number', settingsVeh.numberPlate)
        container.set('vehicles', veh.id, 'color', data.color)

        container.set('vehicles', veh.id, 'mileage', data.mileage || 0.0)
        container.set('vehicles', veh.id, 'fuel', data.fuel || enums.vehiclesData[model].maxFuel)

        container.set('vehicles', veh.id, 'position', {
            x: position[0],
            y: position[1],
            z: position[2]
        })
        container.set('vehicles', veh.id, 'heading', data.heading || 0)
        container.set('vehicles', veh.id, 'dimension', data.dimension || 0)

        container.set('vehicles', veh.id, 'owner', data.owner || {})
        container.set('vehicles', veh.id, 'save', data.save === undefined ? false : true)

        if (data.save === true) {
            mysql.query('insert into vehicles (model, position, heading, dimension, owner, locked, number, color, fuel) values (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                model,
                JSON.stringify(container.get('vehicles', veh.id, 'position')),
                container.get('vehicles', veh.id, 'heading'),
                container.get('vehicles', veh.id, 'dimension'),
                JSON.stringify(container.get('vehicles', veh.id, 'owner')),
                container.get('vehicles', veh.id, 'locked'),
                container.get('vehicles', veh.id, 'number'),
                JSON.stringify(container.get('vehicles', veh.id, 'color')),
                container.get('vehicles', veh.id, 'fuel')
            ], (err, res) => {
                if (err) return logger.error('sys_vehicle.create', err)
                container.set('vehicles', veh.id, 'id', res.insertId)
            })
        }

        return veh
    }
    sys_vehicle.destroy = vehid => {
        const veh = sys_vehicle.getVehicle(vehid)
        if (!veh) return

        mp.vehicles.forEach(item => {
            if (item.id === vehid) item.destroy()
        })

        if (container.get('vehicles', vehid, 'save')) mysql.query('delete from vehicles where id = ?', [container.get('vehicles', vehid, 'id')])
        container.delete('vehicles', vehid)
    }
    sys_vehicle.save = vehid => {
        const veh = sys_vehicle.getVehicle(vehid)
        if (!veh) return

        if (!container.get('vehicles', veh.id, 'save')) return
        mysql.query('update vehicles set position = ?, heading = ?, dimension = ?, owner = ?, locked = ?, number = ?, color = ?, mileage = ?, fuel = ? where id = ?', [
            JSON.stringify(container.get('vehicles', veh.id, 'position')),
            container.get('vehicles', veh.id, 'heading'),
            container.get('vehicles', veh.id, 'dimension'),
            JSON.stringify(container.get('vehicles', veh.id, 'owner')),
            container.get('vehicles', veh.id, 'locked'),
            container.get('vehicles', veh.id, 'number'),
            JSON.stringify(container.get('vehicles', veh.id, 'color')),
            container.get('vehicles', veh.id, 'mileage'),
            container.get('vehicles', veh.id, 'fuel'),

            container.get('vehicles', veh.id, 'id')
        ])
    }

    sys_vehicle.createRent = (player, model, position) => {
        logger.log('Аренда', player, container.get('user', player.id, 'id'), position)
        const veh = sys_vehicle.create(model, [position[0], position[1], position[2]], {
            number: "RENT",
            heading: position[3],
            dimension: player.dimension,
            owner: {
                rent: container.get('user', player.id, 'id')
            }
        })

        container.set('user', player.id, 'rentVehicle', {
            vehicle: veh,
            timer: 0,
            onFoot: false
        })

        if (veh) setTimeout(() => player.putIntoVehicle(veh, 0), 500)
        return veh
    }
    sys_vehicle.createRentForWork = (player, veh, owner = 'cab') => {
        switch (owner) {
            case 'cab':
                container.set('vehicles', veh.id, 'owner', { cab: container.get('user', player.id, 'id') })

                break;
            case 'garbage':
                container.set('vehicles', veh.id, 'owner', { garbage: container.get('user', player.id, 'id') })

                break;
            case 'leaflets':
                container.set('vehicles', veh.id, 'owner', { leaflets: container.get('user', player.id, 'id') })

                break;

            default:
                break;
        }
        container.set('user', player.id, 'rentVehicle', {
            vehicle: veh,
            timer: 0,
            onFoot: false
        })

        // if (veh) setTimeout(() => player.putIntoVehicle(veh, 0), 500)
        return veh
    }

    sys_vehicle.isRights = (vehid, player) => {
        const veh = sys_vehicle.getVehicle(vehid)
        if (!veh || !user.isLogged(player)) return false

        // if(container.get('vehicles', veh.id, 'owner').player
        //     && container.get('vehicles', veh.id, 'owner').player !== container.get('user', player.id, 'id'))return false
        let owner = container.get('vehicles', veh.id, 'owner')
        if (owner.rent !== undefined && container.get('vehicles', veh.id, 'owner').rent === container.get('user', player.id, 'id')) {
            return true
        } else if (owner.cab !== undefined && container.get('vehicles', veh.id, 'owner').cab === container.get('user', player.id, 'id')) {
            return true
        } else if (owner.garbage !== undefined && container.get('vehicles', veh.id, 'owner').garbage === container.get('user', player.id, 'id')) {
            return true
        } else if (owner.leaflets !== undefined && container.get('vehicles', veh.id, 'owner').leaflets === container.get('user', player.id, 'id')) {
            return true
        } else if (owner.plveh !== undefined && container.get('vehicles', veh.id, 'owner').plveh === container.get('user', player.id, 'id')) {
            return true
        } else {
            return false
        }



        // if(container.get('vehicles', veh.id, 'owner').trailer
        //     && container.get('vehicles', veh.id, 'owner').trailer !== player.id)return false

    }

    sys_vehicle.getVehicle = vehid => {
        let veh
        mp.vehicles.forEach(item => {
            if (item.id === vehid) veh = item
        })
        return veh
    }

    sys_vehicle.getServerID = vehID => {
        const allVehicles = container.all('vehicles')
        let id = -1

        for (var key in allVehicles) {
            if (allVehicles[key].id === vehID) id = parseInt(key)
        }
        return id
    }
    sys_vehicle.getID = id => {
        if (!sys_vehicle.getVehicle(id)) return -1
        return container.get('vehicles', id, 'id')
    }

    sys_vehicle.getEngine = vehid => {
        if (!sys_vehicle.getVehicle(vehid)) return false
        return container.get('vehicles', vehid, 'engine')
    }
    sys_vehicle.getLocked = vehid => {
        if (!sys_vehicle.getVehicle(vehid)) return false
        return container.get('vehicles', vehid, 'locked')
    }
    sys_vehicle.getFuel = vehid => {
        if (!sys_vehicle.getVehicle(vehid)) return false
        return container.get('vehicles', vehid, 'fuel')
    }

    sys_vehicle.getModel = vehid => {
        if (!sys_vehicle.getVehicle(vehid)) return false
        return container.get('vehicles', vehid, 'model')
    }
    sys_vehicle.getTypeName = vehid => {
        if (!sys_vehicle.getVehicle(vehid)) return false

        const type = container.get('vehicles', vehid, 'owner')

        // if(type.player)return 'Игрока'
        // if(type.rent)return 'Аренда'

        return 'Ничей'
    }

    sys_vehicle.getOwner = vehid => {
        if (!sys_vehicle.getVehicle(vehid)) return false
        return container.get('vehicles', vehid, 'owner')
    }

    sys_vehicle.setEngine = (vehid, status, error = false) => {
        const veh = sys_vehicle.getVehicle(vehid)
        if (!veh) return false

        let returns = 0

        if (container.get('vehicles', vehid, 'fuel') <= 0
            && status) returns = 1

        if (veh.engineHealth < 300
            && status) returns = 2

        if (!returns) {
            container.set('vehicles', vehid, 'engine', status)
            veh.engine = status
        }

        mp.players.forEach(pl => {
            if (pl.vehicle === veh
                && pl.seat === 0) {
                if (returns === 1) user.notify(pl, 'В данном транспорте нет топлива. Вызовите механика для заправки', 'error')
                if (returns === 2) user.notify(pl, 'В данном транспорте сломан двигатель. Вызовите механика для его починки', 'error')

                if (error) user.notify(pl, 'В данном транспорте сломался двигатель. Вызовите механика для его починки', 'error')
                if (!returns) sys_vehicle.updatePlayerData(pl, veh)
            }
        })
    }
    sys_vehicle.setLocked = (vehid, status, player = null) => {
        const veh = sys_vehicle.getVehicle(vehid)
        if (!veh) return false

        container.set('vehicles', vehid, 'locked', status)
        veh.locked = status

        if (player !== null
            && user.isLogged(player)) user.notify(player, `Транспорт ${!status ? "открыт" : "закрыт"}`, 'warning')
        mp.players.forEach(pl => {
            if (user.isLogged(pl)
                && pl.vehicle === veh
                && pl.seat === 0) {
                user.notify(pl, `Транспорт ${!status ? "открыт" : "закрыт"}`, 'warning')
                sys_vehicle.updatePlayerData(pl, veh)
            }
        })
    }
    sys_vehicle.setMileage = (vehid, mileage) => {
        const veh = sys_vehicle.getVehicle(vehid)
        if (!veh) return false

        container.set('vehicles', vehid, 'mileage', mileage)

        mp.players.forEach(pl => {
            if (pl.vehicle === veh
                && pl.seat === 0) sys_vehicle.updatePlayerData(pl, veh)
        })
    }
    sys_vehicle.setFuel = (vehid, fuel) => {
        const veh = sys_vehicle.getVehicle(vehid)
        if (!veh) return false

        let error = false

        container.set('vehicles', vehid, 'fuel', fuel)
        if (container.get('vehicles', vehid, 'fuel') <= 0) {
            container.set('vehicles', vehid, 'fuel', 0.0)
            sys_vehicle.setEngine(vehid, false)

            error = true
        }

        mp.players.forEach(pl => {
            if (pl.vehicle === veh
                && pl.seat === 0) {
                sys_vehicle.updatePlayerData(pl, veh)
                // pl.call('server::user:fuelSpeedometer', [ container.get('vehicles', vehid, 'fuel'), enums.vehiclesData[sys_vehicle.getModel(pl.vehicle.id)].maxFuel ])
                if (error) user.notify(pl, 'В данном транспорте закончилось топливо. Вызовите механика для заправки', 'error')
            }
        })
    }

    sys_vehicle.updatePlayerData = (player, vehicle) => {
        // let lights = vehicle.getLightsState(1, 1)
        user.uiSend(player, 'client::hud', 'speedometr', {
            speedometrData:
            {
                fuel: sys_vehicle.getFuel(vehicle.id),

                belt: container.get('user', player.id, '_vehBelt'),
                engine: sys_vehicle.getEngine(vehicle.id),
                lights: false,
                doors: sys_vehicle.getLocked(vehicle.id)
            }
        })
    }

    sys_vehicle.getDriver = veh => {
        let ret = -1
        mp.players.forEach(pl => {
            if (user.isLogged(pl) && pl.vehicle === veh && pl.seat == 0) ret = pl
        })
        return ret
    }


    // Events
    sys_vehicle.onEnter = (player, vehicle, seat) => {
        const veh = sys_vehicle.getVehicle(vehicle.id)
        if (!veh) return vehicle.destroy()
        if (sys_vehicle.getLocked(vehicle.id) === true) return player.removeFromVehicle()

        player.call('server::user:setVehBelt', [false])
        container.set('user', player.id, '_vehBelt', false)

        if (seat === 0) {
            vehicle.engine = sys_vehicle.getEngine(vehicle.id)

            sys_vehicle.updatePlayerData(player, vehicle)
            user.uiSend(player, 'client::hud', 'speedometr', {
                speedometrSpeed: 0
            })
            user.uiSend(player, 'client::hud', 'speedometrToggle', {
                status: true
            })


        }

        if (container.get('user', player.id, 'rentVehicle')
            && container.get('user', player.id, 'rentVehicle').vehicle.id === vehicle.id) {
            container.get('user', player.id, 'rentVehicle').onFoot = false
            container.get('user', player.id, 'rentVehicle').timer = 0
        }

    }
    sys_vehicle.onExit = (player, vehicle) => {
        user.uiSend(player, 'client::hud', 'speedometrToggle', {
            status: false
        })
        if (container.get('user', player.id, 'rentVehicle')
            && container.get('user', player.id, 'rentVehicle').vehicle.id === vehicle.id) {
            user.notify(player, 'У Вас есть 15 минут, чтобы вернуться в транспорт', 'warning')


            container.get('user', player.id, 'rentVehicle').timer = 100
            container.get('user', player.id, 'rentVehicle').onFoot = true
        }

        if (container.get('user', player.id, '_plveh')) {
            sys_vehicle.destroy(container.get('user', player.id, '_plveh').id)
            container.clear('user', player.id, '_plveh')
        }

        if (container.get('user', player.id, '_vehBelt') === true) {
            chat.me(player, `отстегнул(а) ремень безопастности`)
            player.call('server::user:setVehBelt', [false])
        }
    }

    sys_vehicle.timer = () => {
        mp.vehicles.forEach(veh => {
            if (!sys_vehicle.getVehicle(veh.id)) return veh.destroy()
            if (veh.engineHealth < 300) sys_vehicle.setEngine(veh.id, false, true)
        })
        // mp.players.forEach(pl =>
        // {
        //     if(pl.vehicle
        //         && pl.seat === 0) sys_vehicle.updatePlayerData(pl, pl.vehicle)
        // })
    }

    // sys_vehicle.trailerAttached = (veh, trailer) =>
    // {
    //     // logger.log('', veh, trailer, veh.trailer)
    //
    //     if(!sys_vehicle.getVehicle(veh))return veh.destroy()
    //     if(!trailer.getVehicle(trailer))return veh.destroy()
    //
    //     const driver = sys_vehicle.getDriver(veh)
    //     if(driver === -1)return veh.trailer = 0
    //
    //     if(container.get('vehicles', trailer.id, 'owner').trailer
    //         && container.get('vehicles', trailer.id, 'owner').trailer !== driver.id)
    //     {
    //         veh.trailer = 0
    //         return user.notify(driver, 'Вы не можете прицепить данный трейлер', 'error')
    //     }
    // }

    module.exports = sys_vehicle
}
catch (e) {
    logger.error('systems/vehicle', e)
}
