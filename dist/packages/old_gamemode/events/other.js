const logger = require('../modules/logger')
const sys_works_cab = require('../systems/works/cab')
const sys_works_garbage = require('../systems/works/garbage')
const sys_works_leaflets = require('../systems/works/leaflets')
const sys_works_port = require('../systems/works/port')
try {
    const fs = require('fs')

    const sys_adminchat = require('../systems/adminchat')

    const user = require('../user')

    mp.events.add({
        "other::adminchat:addMessageSystem": (text, color) => {
            sys_adminchat.addMessageSystem(text, color)
        },
        "animationEvent": (player, toggle, dirt, name, flag) => {
            if (!toggle) player.stopAnimation()
            else player.playAnimation(dirt.toString(), name.toString(), 2, flag)
        },

        "client::noclip:saveCamCoords": (player, position, pointAtCoord, name = 'No name') => {
            const pos = JSON.parse(position);
            const point = JSON.parse(pointAtCoord);

            fs.appendFile('saved/savedposcam.txt', `Username: ${user.getUserName(player)} | Position: ${pos.x}, ${pos.y}, ${pos.z} | pointAtCoord: ${point.position.x}, ${point.position.y}, ${point.position.z} | entity: ${point.entity} - ${name}\r\n`, (err) => {
                if (err) user.notify(player, `SaveCamPos Error: ${err.message}`);
                else user.notify(player, `PositionCam saved. (${name})`);
            });
        },
        "client::port": (player) => {
            sys_works_port.createCaptcha(player)
            player.call('server::user:destroyMarker')
            player.call('server::user:destroyColshape')
            player.stopAnimation()



        },
        "client::captcha:verify": (player, value) => {
            const result = sys_works_port.verifyCaptcha(player, value)

            switch (result) {
                case true:
                    player.call("removeAttachedObject")
                    sys_works_port.closeCaptcha(player)
                    sys_works_port.pay(player)

                    break;

                case false:

                    break;
            }
        },
        "client::garbage": (player, veh, pos) => {
            // sys_works_garbage.selectTrash(player)
            player.playAnimation('anim@heists@box_carry@', 'idle', 1, 49)

            player.call("attachObject", ['prop_rub_binbag_sd_02', 57005]);
            player.call('server::user:setMarker', [pos.x, pos.y, pos.z - 0.5, 0, 'Мусор', false, 77])
            player.call('server::user:setColshape', [pos.x, pos.y, pos.z - 0.5, 0, 'garbageLast', veh, true])
            // user.giveCash(player, 500)
        },
        "client::garbage:success": (player, veh) => {
            player.stopAnimation()

            player.call("removeAttachedObject");
            sys_works_garbage.selectTrash(player, veh)
            user.giveCash(player, 500)
        },
        "client::leaflets": (player, veh) => {
            // player.playAnimation('pickup_object', 'putdown_low', 1, 49)
            sys_works_leaflets.selectHouse(player, veh)
            user.giveCash(player, 600)

        },
        "client::user:biz:openMenu": (player, id) => {
            
          
            switch (id) {
                
                case 'main':
                    {
                        user.uiSend(player, 'client::biz', 'changeMenu', {
                            type: 'main'
                        })
                        break
                    }
                case 'stats':
                    {
                        user.uiSend(player, 'client::biz', 'changeMenu', {
                            type: 'stats'
                        })
                        break
                    }
                case 'settings':
                    {
                        user.uiSend(player, 'client::biz', 'changeMenu', {
                            type: 'settings'
                        })
                        break
                    }
            }
        },
    })
}
catch (e) {
    logger.error('events/other.js', e)
}
