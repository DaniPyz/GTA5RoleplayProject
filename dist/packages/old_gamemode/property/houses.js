const logger = require('../modules/logger')
try {
    const mysql = require('../plugins/mysql')

    const enums = require('../modules/enums')
    const container = require('../modules/container')
    const func = require('../modules/func')

    const user = require('../user')

    const houses = {}

    houses.load = () => {
        mysql.query('select * from houses', [], (err, res) => {
            if (err) return logger.error('houses.load', err)

            container.deleteAll('houses')
            res.map((elem, i) => {
                try {

                    enums.housesVariables.forEach(item => {
                        container.set('houses', i, item, func.isJSON(elem[item]) ? JSON.parse(elem[item]) : elem[item])
                    })

                    container.set('houses', i, 'id', elem.id)
                    container.set('houses', i, 'state', true)

                    houses.refresh(parseInt(i))
                } catch (error) {
                    console.log(error)

                }
            })

            logger.mysqlLog(`Домов загружено: ${res.length}`)
        })
    }
    houses.refresh = (id) => {
        if (!houses.isState(id)) return

        if (container.get('houses', id, '_marker')) container.get('houses', id, '_marker').destroy()
        if (container.get('houses', id, '_colshape')) container.get('houses', id, '_colshape').destroy()
        if (container.get('houses', id, '_label')) container.get('houses', id, '_label').destroy()
        if (container.get('houses', id, '_blip')) {
            container.get('houses', id, '_blip').destroy()
            container.clear('houses', id, '_blip')
        }

        if (container.get('houses', id, '_markerExit')) {
            container.get('houses', id, '_markerExit').destroy()
            container.clear('houses', id, '_markerExit')
        }
        if (container.get('houses', id, '_colshapeExit')) {
            container.get('houses', id, '_colshapeExit').destroy()
            container.clear('houses', id, '_colshapeExit')
        }

        if (container.get('houses', id, '_markerHouseGarage')) {
            container.get('houses', id, '_markerHouseGarage').destroy()
            container.clear('houses', id, '_markerHouseGarage')
        }
        if (container.get('houses', id, '_colshapeHouseGarage')) {
            container.get('houses', id, '_colshapeHouseGarage').destroy()
            container.clear('houses', id, '_colshapeHouseGarage')
        }

        if (container.get('houses', id, '_colshapeGarage')) {
            container.get('houses', id, '_colshapeGarage').destroy()
            container.clear('houses', id, '_colshapeGarage')
        }
        if (container.get('houses', id, '_labelGarage')) {
            container.get('houses', id, '_labelGarage').destroy()
            container.clear('houses', id, '_labelGarage')
        }
        if (container.get('houses', id, '_markerGarage')) {
            container.get('houses', id, '_markerGarage').destroy()
            container.clear('houses', id, '_markerGarage')
        }
        if (container.get('houses', id, '_colshapeGarageExit')) {
            container.get('houses', id, '_colshapeGarageExit').destroy()
            container.clear('houses', id, '_colshapeGarageExit')
        }

        if (container.get('houses', id, '_markerCharacterGarage')) {
            container.get('houses', id, '_markerCharacterGarage').destroy()
            container.clear('houses', id, '_markerCharacterGarage')
        }
        if (container.get('houses', id, '_colshapeCharacterGarage')) {
            container.get('houses', id, '_colshapeCharacterGarage').destroy()
            container.clear('houses', id, '_colshapeCharacterGarage')
        }

        container.set('houses', id, '_marker', mp.markers.new(1, new mp.Vector3(container.get('houses', id, 'position').x, container.get('houses', id, 'position').y, container.get('houses', id, 'position').z), 1.2, {
            color: houses.getOwner(id).id ? [255, 0, 0, 70] : [127, 255, 0, 70],
            dimension: container.get('houses', id, 'dimension')
        }))

        container.set('houses', id, '_colshape', mp.colshapes.newCircle(container.get('houses', id, 'position').x, container.get('houses', id, 'position').y, 1.2, container.get('houses', id, 'dimension'))).setVariable('houseID', id)



        const labelText = `${enums.housesType[houses.getType(id)]} #${houses.getID(id)}\n`

        container.set('houses', id, '_label', mp.labels.new(labelText, new mp.Vector3(container.get('houses', id, 'position').x, container.get('houses', id, 'position').y, container.get('houses', id, 'position').z + 1), {
            font: 0,
            drawDistance: 4,
            dimension: container.get('houses', id, 'dimension')
        }))
        if (houses.getOwner(id).id === 0) {
            container.set('houses', id, '_blip', mp.blips.new(40, new mp.Vector3(container.get('houses', id, 'position').x, container.get('houses', id, 'position').y, container.get('houses', id, 'position').z), {
                name: "Дом на продаже",
                color: 35,
                shortRange: true
            }))
        } else {
            container.set('houses', id, '_blip', mp.blips.new(40, new mp.Vector3(container.get('houses', id, 'position').x, container.get('houses', id, 'position').y, container.get('houses', id, 'position').z),
                {
                    name: 'Дом',
                    color: 1,
                    shortRange: false
                }))
        }

        if (parseInt(container.get('houses', id, 'interior').x) !== 0 && parseInt(container.get('houses', id, 'interior').y) !== 0 && parseInt(container.get('houses', id, 'interior').z) !== 0) {

            container.set('houses', id, '_markerExit', mp.markers.new(1, new mp.Vector3(parseInt(container.get('houses', id, 'interior').x), parseInt(container.get('houses', id, 'interior').y), parseInt(container.get('houses', id, 'interior').z)), 1, {
                color: [255, 255, 255, 155],
                dimension: houses.getID(id) + 50
            }))
            container.set('houses', id, '_colshapeExit', mp.colshapes.newCircle(parseInt(container.get('houses', id, 'interior').x), parseInt(container.get('houses', id, 'interior').y), 1.2, houses.getID(id) + 50)).setVariable('houseID', id)
        }




        if (parseInt(container.get('houses', id, 'garage').position.x) !== 0
            && parseInt(container.get('houses', id, 'garage').position.y) !== 0
            && parseInt(container.get('houses', id, 'garage').position.z) !== 0) {
            
            
            container.set('houses', id, '_markerHouseGarage', mp.markers.new(1, new mp.Vector3(parseInt(container.get('houses', id, 'garage').house.x), parseInt(container.get('houses', id, 'garage').house.y), parseInt(container.get('houses', id, 'garage').house.z) - 1.0), 1, {
                color: [255, 255, 255, 100],
                dimension: houses.getID(id) + 50
            }))
            container.set('houses', id, '_colshapeHouseGarage', mp.colshapes.newCircle(parseInt(container.get('houses', id, 'garage').house.x), parseInt(container.get('houses', id, 'garage').house.y), 1.0, houses.getID(id) + 50)).setVariable('houseID', id)

            container.set('houses', id, '_colshapeGarage', mp.colshapes.newCircle(parseInt(container.get('houses', id, 'garage').position.x), parseInt(container.get('houses', id, 'garage').position.y), 4.0, container.get('houses', id, 'dimension'))).setVariable('houseID', id)
            
            container.set('houses', id, '_markerGarage', mp.markers.new(36, new mp.Vector3(parseInt(container.get('houses', id, 'garage').position.x), parseInt(container.get('houses', id, 'garage').position.y), parseInt(container.get('houses', id, 'garage').position.z)), 2.0, {
                color: [255, 255, 255, 100],
                dimension: container.get('houses', id, 'dimension')
            }))
            container.set('houses', id, '_labelGarage', mp.labels.new(`Гараж дома #${houses.getID(id)}${houses.getLocked(id) ? "\n\n~r~Закрыт" : ""}`, new mp.Vector3(parseInt(container.get('houses', id, 'garage').position.x), parseInt(container.get('houses', id, 'garage').position.y), parseInt(container.get('houses', id, 'garage').position.y) + 1), {
                font: 0,
                drawDistance: 4,
                dimension: container.get('houses', id, 'dimension')
            }))

            container.set('houses', id, '_colshapeGarageExit', mp.colshapes.newCircle(parseInt(container.get('houses', id, 'garage').vehicle.x), parseInt(container.get('houses', id, 'garage').vehicle.y), 4.0, houses.getID(id) + 50)).setVariable('houseID', id)

            container.set('houses', id, '_markerCharacterGarage', mp.markers.new(1, new mp.Vector3(parseInt(container.get('houses', id, 'garage').character.x), parseInt(container.get('houses', id, 'garage').character.y), parseInt(container.get('houses', id, 'garage').character.z) - 1.0), 1, {
                color: [255, 255, 255, 100],
                dimension: houses.getID(id) + 50
            }))
            container.set('houses', id, '_colshapeCharacterGarage', mp.colshapes.newCircle(parseInt(container.get('houses', id, 'garage').character.x), parseInt(container.get('houses', id, 'garage').character.y), 1.0, houses.getID(id) + 50)).setVariable('houseID', id)

        }
    }

    houses.isState = id => {
        return container.get('houses', id, 'state')
    }


    houses.getOwner = id => {
        if (!houses.isState(id)
            || container.get('houses', id, 'owner').id < 1) return { id: 0, name: 'Неимеется' }
        return container.get('houses', id, 'owner')
    }
    houses.getType = id => {
        if (!houses.isState(id)) return 'none'
        return container.get('houses', id, 'type')
    }
    houses.getClass = id => {
        if (!houses.isState(id)) return 'none'
        return container.get('houses', id, 'class')
    }
    houses.getID = id => {
        if (!houses.isState(id)) return -1
        return container.get('houses', id, 'id')
    }
    houses.getServerID = houseID => {
        const allHouses = container.all('houses')
        let id = -1

        for (var key in allHouses) {
            if (allHouses[key].id === houseID) id = parseInt(key)
        }
        return id
    }
    houses.getLocked = id => {
        if (!houses.isState(id)) return false
        return container.get('houses', id, 'locked')
    }

    houses.create = (type, classes, position, data = {}, callback) => {
        if (type < 0 || type >= enums.housesType.length
            || classes < 0 || classes >= enums.housesClass.length) return callback(false)

        let randomInterior = func.random(0, enums.housesDefaultSettings[type][classes].interiors.length)
        if (randomInterior >= enums.housesDefaultSettings[type][classes].interiors.length) randomInterior = enums.housesDefaultSettings[type][classes].interiors.length - 1

        let garage = JSON.stringify({
            house: {
                x: 0.0,
                y: 0.0,
                z: 0.0,
                a: 0.0
            },
            vehicle: {
                x: 0.0,
                y: 0.0,
                z: 0.0,
                a: 0.0
            },
            character: {
                x: 0.0,
                y: 0.0,
                z: 0.0,
                a: 0.0
            },
            position: {
                x: 0,
                y: 0,
                z: 0,
                a: 0
            }
        })

        if (type == 0) {
            let randomInteriorGarage = func.random(0, enums.housesDefaultSettings[type][classes].garages.length)
            console.log(randomInteriorGarage, enums.housesDefaultSettings[type][classes].garages.length)

            if (randomInteriorGarage >= enums.housesDefaultSettings[type][classes].garages.length) randomInteriorGarage = enums.housesDefaultSettings[type][classes].garages.length - 1

            garage = JSON.stringify({
                house: {
                    x: enums.housesDefaultSettings[type][classes].garages[randomInteriorGarage][0],
                    y: enums.housesDefaultSettings[type][classes].garages[randomInteriorGarage][1],
                    z: enums.housesDefaultSettings[type][classes].garages[randomInteriorGarage][2],
                    a: enums.housesDefaultSettings[type][classes].garages[randomInteriorGarage][3]
                },
                vehicle: {
                    x: enums.housesDefaultSettings[type][classes].garages[randomInteriorGarage][4],
                    y: enums.housesDefaultSettings[type][classes].garages[randomInteriorGarage][5],
                    z: enums.housesDefaultSettings[type][classes].garages[randomInteriorGarage][6],
                    a: enums.housesDefaultSettings[type][classes].garages[randomInteriorGarage][7]
                },
                character: {
                    x: enums.housesDefaultSettings[type][classes].garages[randomInteriorGarage][8],
                    y: enums.housesDefaultSettings[type][classes].garages[randomInteriorGarage][9],
                    z: enums.housesDefaultSettings[type][classes].garages[randomInteriorGarage][10],
                    a: enums.housesDefaultSettings[type][classes].garages[randomInteriorGarage][11]
                },
                position: {
                    x: 0,
                    y: 0,
                    z: 0,
                    a: 0
                }
            })
        }

        mysql.query(`insert into houses (type, class, position, dimension, interior, price, owner, garage) values (?, ?, ?, ?, ?, ?, '{ "id": 0, "name": "Неимеется" }', ?)`, [
            type,
            classes,
            JSON.stringify({
                x: position[0],
                y: position[1],
                z: position[2],
                a: position[3]
            }),
            data.dimension === undefined ? 0 : data.dimension,
            JSON.stringify({
                x: enums.housesDefaultSettings[type][classes].interiors[randomInterior][0],
                y: enums.housesDefaultSettings[type][classes].interiors[randomInterior][1],
                z: enums.housesDefaultSettings[type][classes].interiors[randomInterior][2],
                a: enums.housesDefaultSettings[type][classes].interiors[randomInterior][3]
            }),
            !data.price ? enums.housesDefaultSettings[type][classes].price : data.price,
            garage
        ], (err, res) => {
            if (err) {
                callback(false)
                return logger.error('houses.create', err)
            }

            mysql.query('select * from houses where id = ?', [res.insertId], (err, res) => {
                if (err) {
                    callback(false)
                    return logger.error('houses.create', err)
                }

                const id = container.free('houses')
                if (houses.isState(id)) return callback(false)

                enums.housesVariables.forEach(item => {
                    container.set('houses', id, item, func.isJSON(res[0][item]) ? JSON.parse(res[0][item]) : res[0][item])
                })

                container.set('houses', id, 'id', res[0]['id'])


                houses.refresh(id)
                return callback(id)
            })
        })
    }
    houses.delete = id => {
        if (!houses.isState(id)) return

        if (container.get('houses', id, '_marker')) container.get('houses', id, '_marker').destroy()
        if (container.get('houses', id, '_colshape')) container.get('houses', id, '_colshape').destroy()
        if (container.get('houses', id, '_label')) container.get('houses', id, '_label').destroy()
        if (container.get('houses', id, '_blip')) {
            container.get('houses', id, '_blip').destroy()
            container.clear('houses', id, '_blip')
        }

        if (container.get('houses', id, '_markerExit')) {
            container.get('houses', id, '_markerExit').destroy()
            container.clear('houses', id, '_markerExit')
        }
        if (container.get('houses', id, '_colshapeExit')) {
            container.get('houses', id, '_colshapeExit').destroy()
            container.clear('houses', id, '_colshapeExit')
        }

        if (container.get('houses', id, '_markerHouseGarage')) {
            container.get('houses', id, '_markerHouseGarage').destroy()
            container.clear('houses', id, '_markerHouseGarage')
        }
        if (container.get('houses', id, '_colshapeHouseGarage')) {
            container.get('houses', id, '_colshapeHouseGarage').destroy()
            container.clear('houses', id, '_colshapeHouseGarage')
        }

        if (container.get('houses', id, '_colshapeGarage')) {
            container.get('houses', id, '_colshapeGarage').destroy()
            container.clear('houses', id, '_colshapeGarage')
        }
        if (container.get('houses', id, '_labelGarage')) {
            container.get('houses', id, '_labelGarage').destroy()
            container.clear('houses', id, '_labelGarage')
        }
        if (container.get('houses', id, '_markerGarage')) {
            container.get('houses', id, '_markerGarage').destroy()
            container.clear('houses', id, '_markerGarage')
        }
        if (container.get('houses', id, '_colshapeGarageExit')) {
            container.get('houses', id, '_colshapeGarageExit').destroy()
            container.clear('houses', id, '_colshapeGarageExit')
        }

        if (container.get('houses', id, '_markerCharacterGarage')) {
            container.get('houses', id, '_markerCharacterGarage').destroy()
            container.clear('houses', id, '_markerCharacterGarage')
        }
        if (container.get('houses', id, '_colshapeCharacterGarage')) {
            container.get('houses', id, '_colshapeCharacterGarage').destroy()
            container.clear('houses', id, '_colshapeCharacterGarage')
        }

        mysql.query('delete from houses where id = ?', [container.get('houses', id, 'id')])
        container.delete('houses', id)
    }
    houses.save = id => {
        if (!houses.isState(id)) return

        mysql.query('update houses set owner = ?, position = ?, dimension = ?, interior = ?, price = ?, garage = ?, locked = ? where id = ?', [
            JSON.stringify(houses.getOwner(id)),
            JSON.stringify(container.get('houses', id, 'position')),
            container.get('houses', id, 'dimension'),
            JSON.stringify(container.get('houses', id, 'interior')),
            container.get('houses', id, 'price'),
            JSON.stringify(container.get('houses', id, 'garage')),
            container.get('houses', id, 'locked'),

            container.get('houses', id, 'id')
        ])
    }

    houses.nearPlayer = (player, id = -1) => {
        if (!user.isLogged(player)) return -1

        if (id == -1) id = user.getNears(player).house
        if (id === undefined) return -1

        if (!houses.isState(id)) {
            if (user.getNears(player).house === id) user.removeNear(player, 'house')
            return -1
        }
        if (func.distance2D(player.position, new mp.Vector3(container.get('houses', id, 'position').x, container.get('houses', id, 'position').y, container.get('houses', id, 'position').z)) > 2.0
            || player.dimension !== container.get('houses', id, 'dimension')) {
            if (user.getNears(player).house === id) user.removeNear(player, 'house')
            return -1
        }

        return id
    }
    houses.nearPlayerInterior = (player, id = -1) => {
        if (id === -1) id = user.getNears(player).houseInterior
        if (id === undefined) return -1

        if (!houses.isState(id)) {
            if (user.getNears(player).houseInterior === id) user.removeNear(player, 'houseInterior')
            return -1
        }
        if (func.distance2D(player.position, new mp.Vector3(container.get('houses', id, 'interior').x, container.get('houses', id, 'interior').y, container.get('houses', id, 'interior').z)) > 200
            || player.dimension !== houses.getID(id) + 50) {
            if (user.getNears(player).houseInterior === id) user.removeNear(player, 'houseInterior')
            return -1
        }

        return id
    }
    houses.nearPlayerGarage = (player, id = -1) => {
        if (id === -1) id = user.getNears(player).houseGarage
        if (id === undefined) return -1

        if (!houses.isState(id)) {
            if (user.getNears(player).houseGarage === id) user.removeNear(player, 'houseGarage')
            return -1
        }

        if (func.distance2D(player.position, new mp.Vector3(container.get('houses', id, 'garage').position.x, container.get('houses', id, 'garage').position.y, container.get('houses', id, 'garage').position.z)) > 8.0
            || player.dimension !== container.get('houses', id, 'dimension')) {
            if (user.getNears(player).houseGarage === id) user.removeNear(player, 'houseGarage')
            return -1
        }

        return id
    }
    houses.nearPlayerGarageInterior = (player, id = -1) => {
        if (id === -1) id = user.getNears(player).houseGarageInterior
        if (id === undefined) return -1

        if (!houses.isState(id)) {
            if (user.getNears(player).houseGarageInterior === id) user.removeNear(player, 'houseGarageInterior')
            return -1
        }
        if ((func.distance2D(player.position, new mp.Vector3(container.get('houses', id, 'garage').vehicle.x, container.get('houses', id, 'garage').vehicle.y, container.get('houses', id, 'garage').vehicle.z)) > 8.0
            && func.distance2D(player.position, new mp.Vector3(container.get('houses', id, 'garage').character.x, container.get('houses', id, 'garage').character.y, container.get('houses', id, 'garage').character.z)) > 2.0
            && func.distance2D(player.position, new mp.Vector3(container.get('houses', id, 'garage').house.x, container.get('houses', id, 'garage').house.y, container.get('houses', id, 'garage').house.z)) > 2.0)
            || player.dimension !== houses.getID(id) + 50) {
            if (user.getNears(player).houseGarageInterior === id) user.removeNear(player, 'houseGarageInterior')
            return -1
        }

        return id
    }

    houses.tp = (player, id) => {
        if (!houses.isState(id)
            || !user.isLogged(player)) return

        user.setPos(player,
            container.get('houses', id, 'position').x,
            container.get('houses', id, 'position').y,
            container.get('houses', id, 'position').z,
            container.get('houses', id, 'position').a,
            container.get('houses', id, 'dimension'))
    }
    houses.tpInterior = (player, id, admin = false) => {
        if (!houses.isState(id)
            || !user.isLogged(player)) return


        if (houses.getLocked(id) && houses.getOwner(id).id !== user.getID(player)) {
            return user.notify(player, 'Двери закрыты', 'error')
        }

        if (container.get('houses', id, 'interior').x === 0
            && container.get('houses', id, 'interior').y === 0
            && container.get('houses', id, 'interior').z === 0) return

        user.setPos(player,
            container.get('houses', id, 'interior').x,
            container.get('houses', id, 'interior').y,
            container.get('houses', id, 'interior').z,
            container.get('houses', id, 'interior').a,
            houses.getID(id) + 50)
    }
    houses.tpGarage = (player, id) => {
        if (!houses.isState(id)
            || !user.isLogged(player)) return

        if (houses.getLocked(id)) return user.notify(player, 'Гараж закрыт', 'error')
        if (player.vehicle) {
            if (player.seat !== 0) return
            if (houses.nonGarageVehicles(container.get('vehicles', player.vehicle.id, 'model'))) return user.notify(player, 'Данный транспорт нельзя загнать в гараж', 'error')

            user.setPos(player, container.get('houses', id, 'garage').vehicle.x, container.get('houses', id, 'garage').vehicle.y, container.get('houses', id, 'garage').vehicle.z, container.get('houses', id, 'garage').vehicle.a, houses.getID(id) + 50)
        }
        else user.setPos(player, container.get('houses', id, 'garage').character.x, container.get('houses', id, 'garage').character.y, container.get('houses', id, 'garage').character.z, container.get('houses', id, 'garage').character.a, houses.getID(id) + 50)
    }
    houses.tpOnGarage = (player, id, vehicle = false) => {
        if (!houses.isState(id)
            || !user.isLogged(player)) return

        if (container.get('houses', id, 'garage').position.x === 0
            && container.get('houses', id, 'garage').position.y === 0
            && container.get('houses', id, 'garage').position.z === 0) return

        user.setPos(player, container.get('houses', id, 'garage').position.x, container.get('houses', id, 'garage').position.y, container.get('houses', id, 'garage').position.z, container.get('houses', id, 'garage').position.a, container.get('houses', id, 'dimension'))
    }


    houses.nonGarageVehicles = model => {
        if (!enums.vehiclesData[model]
            || !enums.vehiclesData[model].type) return true

            ['boat', 'commercial', 'helicopter', 'industrial', 'plane', 'service', 'trailer', 'trains'].forEach(item => {
                if (enums.vehiclesData[model].type === item) return true
            })

        return false
    }


    houses.buy = (id, player) => {
        if (!houses.isState(id)) return
        user.removeCash(player, container.get('houses', id, 'price'))
        container.set('houses', id, 'owner', {
            id: user.getID(player),
            name: user.getCharName(player)
        })
        container.set('houses', id, 'locked', 0)

        houses.refresh(id)
        houses.save(id)

    }
    houses.sell = id => {
        if (!houses.isState(id)) return
        // console.log(container.getAll('houses', id))

        container.set('houses', id, 'owner', {
            id: 0,
            name: "Неимеется"
        })
        container.set('houses', id, 'locked', 0)

        houses.refresh(id)
        houses.save(id)
        console.log(container.getAll('houses', id))
    }


    // Events
    houses.enterColshape = (player, shape) => {

        const id = shape.getVariable('houseID')
        if (!houses.isState(id)) return

        if (houses.nearPlayer(player, id) === id) user.setNear(player, 'house', id)
        else if (houses.nearPlayerInterior(player, id) === id) user.setNear(player, 'houseInterior', id)
        else if (houses.nearPlayerGarage(player, id) === id) user.setNear(player, 'houseGarage', id)
        else if (houses.nearPlayerGarageInterior(player, id) === id) user.setNear(player, 'houseGarageInterior', id)
        else {
            user.removeNear(player, 'house')
            user.removeNear(player, 'houseInterior')
            user.removeNear(player, 'houseGarage')
            user.removeNear(player, 'houseGarageInterior')

            return
        }

        if (func.distance2D(player.position, new mp.Vector3(container.get('houses', id, 'garage').vehicle.x, container.get('houses', id, 'garage').vehicle.y, container.get('houses', id, 'garage').vehicle.z)) < 8.0
            && !player.vehicle
            && player.seat !== 0) return

        user.toggleActionText(player, true)
    }
    houses.exitColshape = (player, shape) => {
        const id = shape.getVariable('houseID')
        if (!houses.isState(id)) return

        user.removeNear(player, 'house')
        user.removeNear(player, 'houseInterior')
        user.removeNear(player, 'houseGarage')
        user.removeNear(player, 'houseGarageInterior')

        user.toggleActionText(player, false)
    }

    houses.action = player => {
        let id = -1,
            interior = false,
            garage = false

        if (houses.nearPlayer(player) !== -1
            && houses.isState(houses.nearPlayer(player))) id = houses.nearPlayer(player)
        if (houses.nearPlayerInterior(player) !== -1
            && houses.isState(houses.nearPlayerInterior(player))) {
            id = houses.nearPlayerInterior(player)
            interior = true
        }
        if (houses.nearPlayerGarage(player) !== -1
            && houses.isState(houses.nearPlayerGarage(player))) {
            id = houses.nearPlayerGarage(player)
            garage = true
        }
        if (houses.nearPlayerGarageInterior(player) !== -1
            && houses.isState(houses.nearPlayerGarageInterior(player))) {
            id = houses.nearPlayerGarageInterior(player)

            interior = true
            garage = true
        }
        if (id === -1) return

        if (garage) {
            if (interior) {
                console.log('Нет я в интерьнрн')

                if (func.distance2D(player.position, new mp.Vector3(container.get('houses', id, 'garage').vehicle.x, container.get('houses', id, 'garage').vehicle.y, container.get('houses', id, 'garage').vehicle.z)) <= 5.0
                    && player.vehicle
                    && player.seat === 0) houses.tpOnGarage(player, id)
                else if (func.distance2D(player.position, new mp.Vector3(container.get('houses', id, 'garage').character.x, container.get('houses', id, 'garage').character.y, container.get('houses', id, 'garage').character.z)) <= 2.0
                    && !player.vehicle) houses.tpOnGarage(player, id)
                else if (func.distance2D(player.position, new mp.Vector3(container.get('houses', id, 'garage').house.x, container.get('houses', id, 'garage').house.y, container.get('houses', id, 'garage').house.z)) <= 2.0
                    && !player.vehicle) houses.tpInterior(player, id)
            }
            else {
               
                houses.tpGarage(player, id)
            }
            return
        }

        if (!interior) {

            if (houses.getOwner(id).id === 0) {
                user.showHouseDialog(player, 'buy', 'Квартира', id, "Люкс", 10, houses.getOwner(id).name, container.get('houses', id, 'price'), 70, ['Войти', 'Купить', 'Выйти'], 1000)


                user.addOpened(player, 'housedialog')
                user.toggleHud(player, false)
                user.cursor(player, true, false)

                player._onClickDialog = (player, btn, type) => {

                    switch (type) {
                        case 'buy':
                            if (btn === 0) {
                                houses.tpInterior(player, id)

                            } else if (btn === 1) {
                                houses.buy(id, player)
                                user.notify(player, 'Вы типа купили.', 'error')
                                user.hideHouseDialog(player)
                            }
                            user.toggleHud(player, true)
                            user.cursor(player, false, true)
                            user.hideHouseDialog(player)
                            user.removeOpened(player, 'housedialog')
                        default:
                            break;
                    }

                }
            } else if (!houses.getLocked(id) || houses.getOwner(id).id == user.getID(player)) {
                houses.tpInterior(player, id)

            }



        } else {
           
            houses.tp(player, id)
        }
    }

    module.exports = houses
}
catch (e) {
    logger.error('property/houses.js', e)
}
