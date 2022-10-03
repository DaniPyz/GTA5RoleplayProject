const logger = require('../../modules/logger')
const sys_works_cab = require('../../systems/works/cab')
try
{
    const sha256 = require('js-sha256')

    const user = require('../../user')
    const mysql = require('../../plugins/mysql')
    const container = require('../../modules/container')
    const chat = require('../../chat')
    const logs = require('../../modules/logs')
    const func = require('../../modules/func')

    const sys_report = require('../../systems/report')
    const sys_adminchat = require('../../systems/adminchat')
    const sys_npc = require('../../systems/npc')

    const CONFIG_GPS = require('../../configs/CONFIG_GPS.json')

    mp.events.add({
        "client::user:phone:openApp": (player, id, currentID) =>
        {
            switch(id)
            {
                case 'none':
                {
                    user.uiSend(player, 'client::phone', 'openApp', {
                        app: 'none'
                    })
                    break
                }
                case 'call':
                {
                    user.uiSend(player, 'client::phone', 'openApp', {
                        app: 'call'
                    })
                    break
                }
                case 'call-recents':
                {
                    user.uiSend(player, 'client::phone', 'openApp', {
                        app: 'call-recents',
                        data: []
                    })
                    break
                }
                case 'call-favorites':
                {
                    user.uiSend(player, 'client::phone', 'openApp', {
                        app: 'call-favorites',
                        data: []
                    })
                    break
                }
                case 'gps':
                {
                    const returnGPS = CONFIG_GPS
                    returnGPS.forEach((item, i) =>
                    {
                        item.elems.forEach((elem, d) =>
                        {
                            returnGPS[i].elems[d].distance = func.distance2D(player.position, new mp.Vector3(elem.position.x, elem.position.y, elem.position.z))
                            logger.log('', returnGPS[i].elems[d].distance)
                        })
                    })

                    user.uiSend(player, 'client::phone', 'openApp', {
                        app: 'gps',
                        data: returnGPS,
                        gpsStatus: false
                    })
                    break
                }
                case 'contacts':
                {
                    user.uiSend(player, 'client::phone', 'openApp', {
                        app: 'contacts',
                        data: []
                    })
                    break
                }
                case 'sms':
                {
                    user.uiSend(player, 'client::phone', 'openApp', {
                        app: 'sms',
                        data: []
                    })
                    break
                }
                case 'sms-open':
                {
                    user.uiSend(player, 'client::phone', 'openApp', {
                        app: 'sms-open',
                        data: { title: '!SERVER!', img: 'https://i.imgur.com/GPUAXdH.jpeg', blocked: true, sms: [] }
                    })
                    break
                }
                case 'vehicles':
                {
                    user.uiSend(player, 'client::phone', 'openApp', {
                        app: 'vehicles'
                    })
                    break
                }
                case 'business':
                {
                    user.uiSend(player, 'client::phone', 'openApp', {
                        app: 'business'
                    })
                    break
                }
                case 'houses':
                {
                    user.uiSend(player, 'client::phone', 'openApp', {
                        app: 'houses'
                    })
                    break
                }
            }
        },
        "client::user:phone:call": (player, phone) => {
            console.log(typeof phone, phone)
            switch (phone) {
                case '44':
                    sys_works_cab.callCab(player)
                    break;
            
                default:
                    break;
            }
        }
    })
}
catch(e)
{
    logger.error('events/user/phone', e)
}
