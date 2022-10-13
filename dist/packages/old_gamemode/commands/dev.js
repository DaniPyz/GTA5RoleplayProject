const logger = require('../modules/logger')
const biz = require('../property/biz')
const houses = require('../property/houses')
try {
    const fs = require('fs')
    const path = require('path')

    const { addCommand } = require('../modules/commands')

    const user = require('../user')
    const chat = require('../chat')
    const container = require('../modules/container')


    addCommand({
        // тп в автосалон
        'tpa': (player) => {
            if (!user.isAdmin(player, 12)) return
            player.position = new mp.Vector3(
                -43.113731384277344,
                -1104.1728515625,
                26.42234230041504
            );
        },

        'savepos': (player, str, args) => {
            // if (!user.isAdminLoggedText(player, 12)) return
            if (!str.length) return chat.cmd(player, '/savepos [name]')

            const pos = player.position
            fs.appendFile('./savepos.txt', `Position: ${player.position.x}, ${player.position.y}, ${player.position.z}, ${player.heading} - ${str}\r\n`, err => {
                if (err) user.notify(player, `Не удалось сохранить: ${err}`, 'error')
                else user.notify(player, `Позиция сохранена (${str})`)
            });
        },
        'testquest': (player, str, args) => {
            const quests = user.getQuests(player, 'testquest')

            if (!quests) return user.notify(player, "Вы не выполняете квест: Тестовый квест", 'error')
            if (quests.tasks[0].count[0] !== 0) return user.notify(player, "Вы уже выполнили данное задание", 'error')

            user.updateQuests(player, 'testquest', 0, 1)
        },

        "unadmban": player => {
            if (!user.isAdmin(player)) return
            if (container.get('user', player.id, 'user_adminBan') === 0) return

            container.set('user', player.id, 'user_adminBan', 0)
            user.save(player)

            if (user.isOpened(player, 'adminmenu')) mp.events.call('client::user:admin:openMenu', player, 'login')
            else user.notify(player, 'Success')
        },

        "getvw": player => {
            if (!user.isAdminLoggedText(player, 12)) return
            return chat.local(player, `Dimension: ${player.dimension}`)
        },

        "death": player => {
            if (!user.isOnFoot(player)) return
            player.health = 0
        },

        "animplayer": (player, str, args) => {
            if (!user.isAdminLoggedText(player, 12)) return

            if (args[0] != undefined && args[0].length && args[0].match(/^[-\+]?\d+/) !== null) {
                let name = (args[1] != undefined && args[1].match(/^[-\+]?\d+/) !== null) ? parseInt(args[1]) : false
                player.call('findAnim', [parseInt(args[0]), name])
            }
            else player.call('createAnimList', [args[0]])
        },
        "animflag": (player, str, args) => {
            if (!user.isAdminLoggedText(player, 12)) return

            if (args[0].match(/^[-\+]?\d+/) !== null) player.call('animFlag', [parseInt(args[0])])
            else if (args[0] == 'up' || args[0] == 'down') player.call('animFlag', [args[0]])
            else chat.cmd(player, "/animflag [up/down]")
        },
        'giveme': (player) => {
            user.addInventory(player, 10, 4, {}, false, 0, true)
        }
        ,
        'house': (player, str, args) => {

     
            const
                type = args[0],
                classes = args[1],
                x = player.position.x,
                y = player.position.y,
                z = player.position.z-1

            let postion = [x, y, z]
            console.log(type, classes, postion)
            if (!type || !classes) return chat.cmd(player, '/house [type] (classes) [position] (data) [callback]')

            houses.create(type, classes, postion)
        },
        'biz': (player, str, args) => {


            const
                type = args[0],
                x = player.position.x,
                y = player.position.y,
                z = player.position.z - 1

            let postion = [x, y, z]
        
            if (!type ) return chat.cmd(player, '/biz [type] (classes) [position] (data) [callback]')

            biz.create(type, postion)
        }
    })
}
catch (e) {
    logger.error('commands/dev', e)
}
