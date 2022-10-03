const enums = {}

const mysql = require('../plugins/mysql')
const logger = require('./logger')

enums.housesVariables = [
    'type',
    'class',

    'owner',

    'position',
    'dimension',

    'interior',
    'price',

    'garage',
    'locked'
]

enums.housesType = {
    '0': 'Дом обычый '
}
enums.housesClass = {
    '0': 'Лакшери'
}
enums.housesDefaultSettings = [
    {
        '0': {
            interiors: [
                [
                    "-775.6890869140625",
                    "324.17706298828125",
                    "211.03253173828125",
                    "-14.100077629089355"
                ]
            ],

            garages: [
                [
                    "237.63723754882812",
                    "-1004.7304077148438",
                    "-99.99995422363281",
                    "117.92084503173828",
                    "228.67868041992188",
                    "-1005.8582153320312",
                    "-99.99995422363281",
                    "0",
                    "228.67868041992188",
                    "-1005.8582153320312",
                    "-99.99995422363281",
                    "0"
                    // "-963.56298828125",
                    // "-1088.1483154296875",
                    // "2.1503119468688965",
                    // "-27.364877700805664"
                ]
            ],
            price: 1000

        }
    }
]
enums.bizVariables = [

    'type',
    'owner',
    'position',
    'dimension',
    'price',
    'locked'
]
enums.bizType = {
    '0': 'Магазин 24/7'
}
enums.bizDefaultSettings = [
    {
        blipSprite: 52,
        price: 1000,
        rentFee: 15000,
        bizFee: 15


    }
]





enums.vehiclesData =
{
    't20': {
        maxSpeed: 500,

        maxFuel: 40,
        expensFuel: 25,

        price: 5000000,

        type: "car",
        typeName: "Супер-кар"
    },
    'faggio': {
        maxSpeed: 120,

        maxFuel: 4,
        expensFuel: 4,

        price: 1,

        type: "motorcycles",
        typeName: "Скутер"
    },
    'blazer2': {
        maxSpeed: 70,

        maxFuel: 3,
        expensFuel: 2,

        price: 1,

        type: 'off-road',
        typeName: 'Квадрацикл'
    },
    'tractor2': {
        maxSpeed: 40,

        maxFuel: 10,
        expensFuel: 5,

        price: 1,

        type: 'utility',
        typeName: "Трактор"
    }
}
enums.loadVehiclesData = () => {
    mysql.query('select vehiclesData from settings', [], (err, res) => {
        if (err) return logger.error('enums.loadVehicleData', err)

        enums.vehiclesData = JSON.parse(res[0]['vehiclesData'])
        logger.mysqlLog(`Настройки транспорта загружены. Всего: ${Object.keys(enums.vehiclesData).length} транспорта`)
    })
}
enums.addVehiclesData = vehicleName => {
    if (enums.vehiclesData[vehicleName]) return enums.vehiclesData[vehicleName]

    enums.vehiclesData[vehicleName] = {
        maxSpeed: 120,

        maxFuel: 10,
        expensFuel: 5,

        price: 1,

        type: 'vehicle',
        typeName: "Транспорт"
    }
    mysql.query('update settings set vehiclesData = ?', [JSON.stringify(enums.vehiclesData)], (err, res) => {
        if (err) return logger.error('enums.addVehiclesData', err)
    })

    return enums.vehiclesData[vehicleName]
}

module.exports = enums
