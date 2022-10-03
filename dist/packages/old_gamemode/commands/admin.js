const logger = require('../modules/logger')
try {
    const { addCommand } = require('../modules/commands')

    const mysql = require('../plugins/mysql')

    const user = require('../user')
    const chat = require('../chat')
    const houses = require('../property/houses')

    const container = require('../modules/container')
    const logs = require('../modules/logs')

    const sys_vehicle = require('../systems/vehicle')
    const sys_adminchat = require('../systems/adminchat')

    addCommand({
        'tpcord': (player, str, args, data) => {
            if (!user.isAdminLoggedText(player)) return

            const
                x = parseFloat(args[0]),
                y = parseFloat(args[1]),
                z = parseFloat(args[2]),
                vw = parseInt(args[3])

            if (x === undefined || y === undefined || z === undefined) return char.cmd(player, '/tpcord [x] [y] [z] (vw)')
            if (vw === undefined) vw = -1

            user.setPos(player, x, y, z, 0.0, vw)
        },

        'givedonate': (player, str, args, data) => {
            if (!user.isAdminLoggedText(player, 12)) return

            let username = args[0]
            const donate = parseInt(args[1])

            if (!str.length
                || !username.length
                || donate === undefined || donate === null || isNaN(donate)) return chat.cmd(player, '/givedonate [username (пробелы заменить на _)] [count]')
            if (username.length) username = username.replace('_', ' ')

            const pl = user.getPlayerForName(username)
            console.log(pl)
            if (pl) {
                logger.log(donate)
                user.giveDonate(pl, donate)
                chat.success(player, `Вы успешно выдали ${donate.toLocaleString()} доната ${username} [${pl.id}].`)

                logs.send('user', user.getID(player), `Выдал ${donate.toLocaleString()} доната ${username}`, {
                    userid: user.getID(pl)
                })
                logs.send('user', user.getID(pl), `Получил ${donate.toLocaleString()} доната от ${user.returnAdminName(player)} ${user.getName(player)}`, {
                    userid: user.getID(player)
                })
            }
            else {

                mysql.query('select id, donate from users where username = ?', [username], (err, res) => {
                    if (err) return logger.error('/givedonate', err)
                    if (!res.length) return chat.error(player, 'Аккаунт с данным ником не найден')

                    let setDonate = res[0]['donate']

                    if (donate < 0) setDonate -= donate
                    else setDonate += donate

                    mysql.query('update users set donate = ? where id = ?', [setDonate, res[0]['id']], (err, res) => {
                        if (err) return logger.error('/givedonate', err)
                    })
                    chat.success(player, `Вы успешно выдали ${donate.toLocaleString()} доната ${username}.`)

                    logs.send('user', user.getID(player), `Выдал ${donate.toLocaleString()} доната ${username}`, {
                        userid: res[0]['id']
                    })
                    logs.send('user', res[0]['id'], `Получил ${donate.toLocaleString()} доната от ${user.returnAdminName(player)} ${user.getName(player)}`, {
                        userid: user.getID(player)
                    })
                })
            }
        },

        'plveh': (player, str, args) => {
            if (!user.isAdminLoggedText(player, 4)) return

            const vehicle = args[0]
            let charname = args[1]

            if (!vehicle) return chat.cmd(player, '/plveh [vehicle name] (charname or playerid)')
            if (charname === undefined) charname = player.id

            if (isNaN(charname)) charname = parseInt(charname)

            const pl = Number.isInteger(charname) ? user.getPlayerForID(charname) : user.getPlayerForCharName(charname)
            if (!pl) return chat.error(player, 'Данный игрок не найден')

            const veh = sys_vehicle.create(vehicle, [pl.position.x, pl.position.y, pl.position.z], {
                heading: pl.heading,
                dimension: pl.dimension,
                owner: {
                    plveh: pl.id
                }
            })
            container.set('user', player.id, '_plveh', veh)
            sys_adminchat.addMessageSystem(`${user.getName(player)} [${player.id}] выдал ${vehicle} ${user.getCharName(pl)} [${pl.id}]`, 'silver')

            setTimeout(() => {
                pl.putIntoVehicle(veh, 0)
            }, 200)
        },
        'createFraction': (player, str, args) => {
            if (!user.isAdminLoggedText(player, 12)) return

            const
                name = args[0],
                description = args[1],
                maxRank = args[2]

            if (!name || !description) return chat.cmd(player, '/createFraction [fraction name] (description)')
            mysql.query('insert into fraction (name, description, maxRank) values (?,?,?) ', [name, description, maxRank], (err, res) => {

                if (err) return logger.error('/createFraction', err)



                chat.success(player, `Вы успешно создали фракцию ${name} c описанием ${description} и максимальным рангом ${maxRank}.`)

                // logs.send('user', user.getID(player), `Создал фракцию ${name} `, {
                //     userid: res[0]['id']
                // })

            })

        },
        'adm': (player, str, args) => {
            if (!user.isAdminLoggedText(player, 12)) return




            if (!str) return chat.cmd(player, '/adm text')
            mp.events.call('chat::admin:say', `${user.getCharName(player)}[${user.getAdminLvl(player)}]: ${str}`, '#FF3535')

        }
    })
}
catch (e) {
    logger.error('commands/dev', e)
}
