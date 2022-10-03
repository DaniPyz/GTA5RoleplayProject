const logger = require('../modules/logger')
try
{
    require('./vehicle/_keys')

    const sys_vehicle = require('../systems/vehicle')

    const container = require('../modules/container')
    const func = require('../modules/func')

    const enums = require('../plugins/enums')

    const user = require('../user')

    mp.events.add({
        'client::vehicles:giveMileage': (player, data) =>
        {
            data = JSON.parse(data)

            sys_vehicle.setMileage(data.vehicle.id, container.get('vehicles', data.vehicle.id, 'mileage') + data.mileage)
            sys_vehicle.setFuel(data.vehicle.id, container.get('vehicles', data.vehicle.id, 'fuel') - ((enums.vehiclesData[sys_vehicle.getModel(data.vehicle.id)].expensFuel / 100) * data.mileage))
        }

        // 'rentVehicle.vehicle.id': (player, vehid) =>
        // {
        //     sys_vehicle.destroy(vehid)
        // }
    })
}
catch(e)
{
    logger.error('events/vehicle.js', e)
}
