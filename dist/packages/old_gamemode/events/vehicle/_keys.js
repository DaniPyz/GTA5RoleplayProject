const func = require('../../modules/func')
const logger = require('../../modules/logger')
try
{
    const user = require('../../user')
    const chat = require('../../chat')

    const container = require('../../modules/container')

    const sys_vehicle = require('../../systems/vehicle')
    const { addKey } = require('../../modules/keys')

    addKey({
        'vehicle_engine': {
            keyCode: 78,
            func: (player, up) =>
            {
                if(up)return
                if(!player.vehicle || !user.isOnFoot(player))return

                if(!sys_vehicle.isRights(player.vehicle.id, player))return user.notify(player, 'У Вас нет ключей от данного транспорта', 'error')
                sys_vehicle.setEngine(player.vehicle.id, !sys_vehicle.getEngine(player.vehicle.id))
            }
        },
        'vehicle_locked': {
            keyCode: 76,
            func: (player, up) =>
            {
                if(up)return
                if(!user.isOnFoot(player))return
                if (!player.vehicle) {
                    
                    mp.vehicles.forEach(veh =>
                    {
                        if(func.distance2D(player.position, veh.position) < 2.0)
                        {
                            if(!sys_vehicle.isRights(veh.id, player)) return user.notify(player, 'У Вас нет ключей от данного транспорта', 'error')
                            sys_vehicle.setLocked(veh.id, !sys_vehicle.getLocked(veh.id), player)
                        }
                    })
                    return
                }

                if(!sys_vehicle.isRights(player.vehicle.id, player))return user.notify(player, 'У Вас нет ключей от данного транспорта', 'error')
                sys_vehicle.setLocked(player.vehicle.id, !sys_vehicle.getLocked(player.vehicle.id))
            }
        },
        'vehicle_belt': {
            keyCode: 74,
            func: (player, up) =>
            {
                if(up)return
                if(!user.isOnFoot(player)
                    || !player.vehicle)return

                container.set('user', player.id, '_vehBelt', !container.get('user', player.id, '_vehBelt'))
                sys_vehicle.updatePlayerData(player, player.vehicle)

                chat.me(player, `${!container.get('user', player.id, '_vehBelt') ? 'отстегнул(а)' : 'пристегнул(а)'} ремень безопастности`)
                player.call('server::user:setVehBelt', [ container.get('user', player.id, '_vehBelt') ])
            }
        }
    })
}
catch(e)
{
    logger.error('events/vehicle/_keys', e)
}
