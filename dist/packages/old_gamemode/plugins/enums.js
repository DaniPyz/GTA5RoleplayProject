const enums = {}

const mysql = require('./mysql')
const logger = require('../modules/logger')

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
enums.loadVehiclesData = () =>
{
    mysql.query('select vehiclesData from settings', [], (err, res) =>
    {
        if(err)return logger.error('enums.loadVehicleData', err)

        enums.vehiclesData = JSON.parse(res[0]['vehiclesData'])
        logger.mysqlLog(`Настройки транспорта загружены. Всего: ${Object.keys(enums.vehiclesData).length} транспорта`)
    })
}
enums.addVehiclesData = vehicleName =>
{
    if(enums.vehiclesData[vehicleName])return enums.vehiclesData[vehicleName]

    enums.vehiclesData[vehicleName] = {
        maxSpeed: 120,

        maxFuel: 10,
        expensFuel: 5,

        price: 1,

        type: 'vehicle',
        typeName: "Транспорт"
    }
    mysql.query('update settings set vehiclesData = ?', [ JSON.stringify(enums.vehiclesData) ], (err, res) =>
    {
        if(err)return logger.error('enums.addVehiclesData', err)
    })

    return enums.vehiclesData[vehicleName]
}

module.exports = enums
