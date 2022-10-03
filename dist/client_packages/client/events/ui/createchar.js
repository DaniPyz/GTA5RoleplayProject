const logger = require('./client/modules/logger')
try
{
    const user = require('./client/user')
    const ui = require('./client/modules/ui')

    mp.events.add({
        "ui::createchar": data =>
        {
            data = JSON.parse(data)

            const gender = data.gender
            const clothes = data.clothes

            delete data.gender
            delete data.clothes

            user.resetSkin(data, gender)
            clothes.forEach((item, i) =>
            {
                if(item < 0) clothes[i] = 0
            })

            mp.events.callRemote('client::user:createchar:updategender', gender)

            user.setClothes(`createchar_top_${clothes[0]}`)
            user.setClothes(`createchar_bottom_${clothes[1]}`)
            user.setClothes(`createchar_shoes_${clothes[2]}`)
        },
        "server::ui:createchar:hide": () =>
        {
            ui.send('client::createchar', 'toggle', {
                status: false
            })
            user.cursor(false)
        },
        "ui::createchar:changeCam": data =>
        {
            const cam = JSON.parse(data).cam
            switch(cam)
            {
                case 0:
                    user.setCameraToPlayer()
                    break
                case 1:
                    user.setCameraToPlayer({
                        height: -0.3
                    })
                    break
                case 2:
                    user.setCameraToPlayer({
                        height: -0.6
                    })
                    break
            }
        }
    })
}
catch(e)
{
    logger.error('events/ui/choicechar', e)
}
