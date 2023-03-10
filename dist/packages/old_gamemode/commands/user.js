const func = require('../modules/func')
const logger = require('../modules/logger')
const houses = require('../property/houses')
const sys_works_cab = require('../systems/works/cab')
try {
    const { addCommand } = require('../modules/commands')

    const user = require('../user')
    const chat = require('../chat')
    const container = require('../modules/container')
    const mysql = require('../plugins/mysql')
    addCommand({
        'b': (player, str, args) => {
            if (!str.length) return chat.cmd(player, '/b [text]')
            chat.radius(player, `(( ${user.getCharName(player)}[${player.id}]: ${str} ))`, 'white')
        },
        'invite': (player, str, args) => {
            const candidate = args[0]
            const rank = args[1]
            if (candidate === undefined || rank === undefined || !candidate.length || !rank.length) return chat.cmd(player, '/invite [id] (rank)')

            const pl = user.getPlayerForID(parseInt(candidate))
            const employerFraction = user.getFraction(player)
            const plFraction = user.getFraction(pl)
            if (employerFraction == false) return chat.cmd(player, 'Вы не являетесь работником фракции.')
            if (employerFraction[2] < 8) return chat.cmd(player, 'Вы не можете приглашать игроков в этой фракции.')

            // if (plFraction !== false) return chat.cmd(player, 'Вы состоите в другой фракции.')

            user.setFraction(pl, employerFraction[0], employerFraction[1], rank)
            mysql.query(`select users from fraction where id = ?`, [employerFraction[0]], (err, res) => {
                if (err) return logger.error(err)

                let userBluePrint = {
                    id: user.charID(pl),
                    name: user.getCharName(pl),
                    rank: rank,
                    status: 1
                }
                let newArr = JSON.parse(res[0]["users"])

                newArr.push(userBluePrint)






                mysql.query(`update fraction set users = ? where id = ?`, [JSON.stringify(newArr), employerFraction[0]])

            })

            chat.success(player, `Вы успешно добавили ${user.getCharName(pl)} в ${employerFraction[1]} .`)
        },
        'getPlayers': (player, str, args) => {
            console.log(container.all('user'))
        },
        'accept': (player, str, args) => {
            if (!str.length) return chat.cmd(player, '/accept [id]')
            if (sys_works_cab.isWorking(player) && sys_works_cab.isWorkingOnIdWork(player, 2)) {
                const id = parseInt(args[0])
                const caller = user.getPlayerForID(id)
                if (caller === undefined || sys_works_cab.playerOrderedCab(caller) === false) return chat.cmd(player, '/accept [id]')
                if (player.id == id) return chat.error(player, 'Вы не можете принимать свойже заказ.')
                sys_works_cab.removePlayerOrder(caller)
                player.call('server::user:setMarker', [caller.position.x, caller.position.y, caller.position.z, 0, 'Клиент', true, 77])
                player.call('server::user:setColshape', [caller.position.x, caller.position.y, caller.position.z, 0, 'cabDeparture']);


            } else return

        },
        'houseinfo': (player, str, args) => {
            let id = player.dimension - 50

            let ServerId = houses.getServerID(id)
            console.log(id, ServerId)
            if (houses.getOwner(ServerId).id === user.getID(player) && houses.getOwner(ServerId).id !== 0) {
                user.toggleHud(player, false)
                user.showHouseDialog(player, 'info', 'Квартира', id, "Люкс", 10, houses.getOwner(id).name, 20, 70, [`${houses.getLocked(ServerId) ? 'Открыть' : 'Закрыть'}`, 'Мебель', 'Открыть шкаф', 'Продать'], 1000)


                user.addOpened(player, 'housedialog')

                user.cursor(player, true, false)

                player._onClickDialog = (player, btn, type) => {

                    switch (type) {
                        case 'info':


                            if (btn === 0) {

                                if (houses.getLocked(ServerId)) {
                                    container.set('houses', ServerId, 'locked', 0)
                                } else {
                                    container.set('houses', ServerId, 'locked', 1)
                                }
                                houses.refresh(ServerId)
                                houses.save(ServerId)
                            } else if (btn === 1) {
                                user.notify(player, 'Разработка.', 'warning')
                            } else if (btn === 2) {

                                user.notify(player, 'Разработка.', 'warning')
                            } else if (btn === 3) {

                                houses.sell(ServerId)
                                user.giveCash(player, container.get('houses', ServerId, 'price'))
                                houses.tp(player, ServerId)

                            }
                            user.toggleHud(player, true)
                            user.cursor(player, false, true)
                            user.hideHouseDialog(player)
                            user.removeOpened(player, 'housedialog')



                        default:
                            break;
                    }


                }
            }
        }
    })
}
catch (e) {
    logger.error('commands/dev', e)
}
