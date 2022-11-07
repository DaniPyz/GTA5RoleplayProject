const logger = require('./client/modules/logger')
try
{
    const ui = require('./client/modules/ui')
    const user = require('./client/user')

    mp.events.add({
        'server::other:createPeds': npc =>
        {
            for(var key in npc)
            {
                mp.peds.new(mp.game.joaat(npc[key].model),
                    new mp.Vector3(npc[key].position.x, npc[key].position.y, npc[key].position.z),
                    npc[key].position.a,
                    npc[key].position.vw)
            }
        },
        'server::other:createWaypoint': (x,y) => {
            mp.game.ui.setNewWaypoint(x, y);
        },
        'other:writeChat': (message) => {
            chat
        }
    })
    // mp.keys.bind(0x4B, true, function (player) {

    //     mp.events.call('client::lspd:keyPressed', player, mp.players.getClosestInDimension(player.position, 0, 2)[0]);
    // });
}
catch(e)
{
    logger.error('events/other', e)
}