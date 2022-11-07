const logger = require('./client/modules/logger')
try {
    const ui = require('./client/modules/ui')
    const user = require('./client/user')

    require('./client/events/index')
    require('./client/customtag.js');
    require('./client/gmenu.js');
    require('./client/modules/_noclip')
    require('./client/modules/_animLibrary')
    require('./client/modules/attach_editor')

    //For new Client 
    mp.game.object.doorControl(631614199, 461.8065, -994.4086, 25.06443, true, 0.0, 0.0, 0.0);
    mp.game.object.doorControl(631614199, 461.8065, -997.6583, 25.06443, true, 0.0, 0.0, 0.0);
    mp.game.object.doorControl(631614199, 461.8065, -1001.302, 25.06443, true, 0.0, 0.0, 0.0);
    // 


    
    mp.gui.chat.show(false)
    mp.game.ui.displayCash(false)
    mp.game.ui.displayAmmoThisFrame(false)
    mp.game.ui.displayHud(false)
    mp.game.gameplay.setFadeOutAfterDeath(false)
    mp.game.gameplay.setFadeOutAfterArrest(false)
    mp.game.gameplay.setFadeInAfterDeathArrest(false)
    mp.game.gameplay.setFadeInAfterLoad(false)
    mp.game.audio.startAudioScene("CHARACTER_CHANGE_IN_SKY_SCENE")
    mp.game.audio.setRadioToStationName("OFF");
    mp.game.vehicle.defaultEngineBehaviour = false
    mp.players.local.setConfigFlag(429, true)

    mp.nametags.enabled = false;



    user.toggleHud(false)
    // user.cursor(false)
    logger.log(mp.players.local.id)
    user.setVW(mp.players.local.id + 1)
    user.freeze(true)

    user.setPos(-406.1335144042969, 6321.80126953125, 29.122058868408203, 0.0, mp.players.local.id + 1, false)
    user.setCamera(new mp.Vector3(-433.9073181152344, 6206.02587890625, 125.67748260498047), [-177.31312561035156, 6252.0205078125, 35.86330795288086])

    logger.log('Client started is Successful')
    ui.start()
       
}
catch (e) {
    logger.error('Client started Error:', e)
}
