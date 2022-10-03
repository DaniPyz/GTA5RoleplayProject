const logger = require('../../modules/logger')
try {
    const sha256 = require('js-sha256')
    const func = require('../../modules/func')
    const user = require('../../user')
    const mysql = require('../../plugins/mysql')
    const container = require('../../modules/container')
    const chat = require('../../chat')
    const logs = require('../../modules/logs')

    const sys_report = require('../../systems/report')
    const sys_adminchat = require('../../systems/adminchat')
    const sys_npc = require('../../systems/npc')

    const { addKey } = require('../../modules/keys')
    const { commands, addCommand } = require('../../modules/commands')

    const CONFIG_UIFAQ = require('../../configs/CONFIG_UIFAQ.json')
    const CONFIG_ADMCMD = require('../../configs/CONFIG_ADMCMD.json')
    const CONFIG_ADMTP = require('../../configs/CONFIG_ADMTP.json')
    const CONFIG_ADM = require('../../configs/CONFIG_ADM.json')
    const CONFIG_ENUMS = require('../../configs/CONFIG_ENUMS.json')
    const CONFIG_INVENTORY = require('../../configs/CONFIG_INVENTORY.json')
    class Node {
        constructor(value) {
            this.value = value;
            this.next = null;
        }
    }

    class Queue {
        constructor() {
            this.head = null;
            this.tail = null;
            this.length = 0;
        }

        enqueue(value) {
            const node = new Node(value);

            if (this.head) {
                this.tail.next = node;
                this.tail = node;
            } else {
                this.head = node;
                this.tail = node
            }

            this.length++;
        }

        dequeue() {
            const current = this.head;
            this.head = this.head.next;
            this.length--;

            return current.value;
        }

        isEmpty() {
            return this.length === 0;
        }

        getHead() {
            return this.head.value;
        }

        getLength() {
            return this.length;
        }

        print() {
            let current = this.head;

            while (current) {
                console.log(current.value);
                current = current.next;
            }
        }
    }
    const queue = new Queue();
    mp.events.add({
        "client::user:fraction:openMenu": (player, id) => {
            if (!user.isFractionUser(player)) {
                user.toggleHud(player, true)
                user.cursor(player, false, true)

                user.uiSend(player, 'client::fraction', 'toggle', {
                    status: false
                })

                user.removeOpened(player, 'fraction')

                return
            }



            const fraction = user.getFraction(player)

            switch (id) {
                case 'staff':
                    {


                        mysql.query('select id, name, leader, leaderId, maxRank, users from fraction where id = ?', [fraction[0]], (err, res) => {
                            if (err) return logger.err(err)

                            const newArr = []

                            res.forEach(resData => {
                                console.log(resData)

                                newArr.push({
                                    id: parseInt(resData.id),
                                    name: resData.name,
                                    leader: resData.leader,
                                    leaderId: resData.leaderId,
                                    maxRank: resData.maxRank,
                                    users: JSON.parse(resData.users)
                                })
                            })

                            // user.uiSend(player, 'client::fraction', 'setFractionData', )
                            user.uiSend(player, 'client::fraction', 'openMenu', {
                                menu: 'staff',
                                data: newArr
                            })

                        })


                        break


                    }
                case 'main':
                    {

                        user.uiSend(player, 'client::fraction', 'openMenu', {
                            menu: 'main'
                        })
                        break


                    }
                case 'balance':
                    {
                        mysql.query('select balance users from fraction where id = ?', [fraction[0]], (err, res) => {


                            user.uiSend(player, 'client::fraction', 'openMenu', {
                                menu: 'balance',
                                data: res[0].users
                            })



                        })
                        break
                    }
                case 'stock':
                    {
                        mysql.query('select stock from fraction where id = ?', [fraction[0]], (err, res) => {


                            user.uiSend(player, 'client::fraction', 'openMenu', {
                                menu: 'stock',
                                data: res[0].stock
                            })



                        })
                        break
                    }
                case 'walkie-tolkie':
                    {



                        const startDate = func.convertToMoscowDate(new Date())

                        let hours = startDate.getHours();
                        let minutes = startDate.getMinutes();
                        if (hours < 10) hours = "0" + hours;
                        if (minutes < 10) minutes = "0" + minutes;

                        user.uiSend(player, 'client::fraction', 'walkieTalkieError', {
                            error: {
                                hour: hours.toString(),
                                minute: minutes.toString(),

                            }
                        })
                        user.uiSend(player, 'client::fraction', 'openMenu', {
                            menu: 'walkie-tolkie',
                            data: {

                                hour: hours.toString(),
                                minute: minutes.toString(),

                            }
                        })




                        break
                    }
            }

        },
        "client::user:fraction:employeePromotion": (player, id) => {
            if (!user.isFractionUser(player)) {
                user.toggleHud(player, true)
                user.cursor(player, false, true)

                user.uiSend(player, 'client::fraction', 'toggle', {
                    status: false
                })

                user.removeOpened(player, 'fraction')

                return
            }
            const pl = user.getPlayerForCharID(id)

            const plFraction = user.getFraction(pl)
            const playerFraction = user.getFraction(player)


            if (playerFraction[2] < 8) return
            if (playerFraction[0] !== plFraction[0]) return
            if (playerFraction[2] < plFraction[2]) return
            if (plFraction[2] === 12) return

            const newRank = parseInt(plFraction[2]) + 1


            user.setFraction(pl, plFraction[0], plFraction[1], newRank)

            mysql.query(`select users from fraction where id = ?`, [plFraction[0]], (err, res) => {
                if (err) return logger.error(err)



                let newArr = JSON.parse(res[0]["users"])
                const newRankQuerry = parseInt(plFraction[2]) + 1
                console.log(newArr, newRankQuerry)

                let obj = newArr.findIndex(o => o.id === parseInt(id));

                newArr[obj].rank = newRankQuerry.toString()
                console.log(newArr)




                mysql.query(`update fraction set users = ? where id = ?`, [JSON.stringify(newArr), plFraction[0]])

            })



        },

        "client::user:fraction:employeeDemontion": (player, id) => {
            if (!user.isFractionUser(player)) {
                user.toggleHud(player, true)
                user.cursor(player, false, true)

                user.uiSend(player, 'client::fraction', 'toggle', {
                    status: false
                })

                user.removeOpened(player, 'fraction')

                return
            }
            const pl = user.getPlayerForCharID(id)

            const plFraction = user.getFraction(pl)
            const playerFraction = user.getFraction(player)


            if (playerFraction[2] < 8) return
            if (playerFraction[0] !== plFraction[0]) return
            if (playerFraction[2] < plFraction[2]) return
            if (plFraction[2] === 1) return

            const newRank = parseInt(plFraction[2]) - 1


            user.setFraction(pl, plFraction[0], plFraction[1], newRank)

            mysql.query(`select users from fraction where id = ?`, [plFraction[0]], (err, res) => {
                if (err) return logger.error(err)



                let newArr = JSON.parse(res[0]["users"])
                const newRankQuerry = parseInt(plFraction[2]) - 1
                console.log(newArr, newRankQuerry)

                let obj = newArr.findIndex(o => o.id === parseInt(id));

                newArr[obj].rank = newRankQuerry.toString()
                console.log(newArr)




                mysql.query(`update fraction set users = ? where id = ?`, [JSON.stringify(newArr), plFraction[0]])

            })
        },
        "client::user:fraction:employeeDismissal": (player, id) => {
            if (!user.isFractionUser(player)) {
                user.toggleHud(player, true)
                user.cursor(player, false, true)

                user.uiSend(player, 'client::fraction', 'toggle', {
                    status: false
                })

                user.removeOpened(player, 'fraction')

                return
            }
            const pl = user.getPlayerForCharID(id)

            const plFraction = user.getFraction(pl)
            const playerFraction = user.getFraction(player)


            if (playerFraction[2] < 8) return
            if (playerFraction[0] !== plFraction[0]) return
            if (playerFraction[2] < plFraction[2]) return




            user.removeFraction(pl)

            mysql.query(`select users from fraction where id = ?`, [plFraction[0]], (err, res) => {
                if (err) return logger.error(err)



                let newArr = JSON.parse(res[0]["users"])

                let obj = newArr.findIndex(o => o.id === parseInt(id));

                newArr.splice(obj, 1)
                console.log(newArr)




                mysql.query(`update fraction set users = ? where id = ?`, [JSON.stringify(newArr), plFraction[0]])


            })
            user.toggleHud(player, true)
            user.cursor(player, false, true)

            user.uiSend(player, 'client::fraction', 'toggle', {
                status: false
            })

            user.removeOpened(player, 'fraction')

            return
        },
        "client::user:fraction:walkieTalkieChangetime": (player, id, hour, minute) => {
            console.log(id, hour, minute)

            switch (id) {
                case 0:

                    const newHourD = parseInt(hour) + 1

                    user.uiSend(player, 'client::fraction', 'openMenu', {
                        menu: 'walkie-tolkie',
                        data: {

                            hour: newHourD < 10 ? '0' + newHourD.toString() : newHourD.toString(),
                            minute: minute,


                        }
                    })
                    break;
                case 1:
                    const newHourI = parseInt(hour) - 1


                    user.uiSend(player, 'client::fraction', 'openMenu', {
                        menu: 'walkie-tolkie',
                        data: {

                            hour: newHourI < 10 ? '0' + newHourI.toString() : newHourI.toString(),
                            minute: minute,


                        }
                    })
                    break;
                case 2:
                    const newMinuteI = parseInt(minute) + 1

                    user.uiSend(player, 'client::fraction', 'openMenu', {
                        menu: 'walkie-tolkie',
                        data: {
                            hour: hour,
                            minute: newMinuteI < 10 ? '0' + newMinuteI.toString() : newMinuteI.toString(),

                        }
                    })
                    break;
                case 3:
                    const newMinuteD = parseInt(minute) - 1

                    user.uiSend(player, 'client::fraction', 'openMenu', {
                        menu: 'walkie-tolkie',
                        data: {
                            hour: hour,
                            minute: newMinuteD < 10 ? '0' + newMinuteD.toString() : newMinuteD.toString(),

                        }
                    })
                    break;

                default:
                    break;
            }
        },
        "client::user:fraction:walkieTalkieSubmit": (player, message, hour, minute) => {

            if (queue.isEmpty()) {
                queue.enqueue({ text: message, hour: hour, minute: minute })
                console.log("Он пустой", queue)

                return
            }

            console.log('Начало', parseInt(queue.tail.value.hour) <= hour, parseInt(queue.tail.value.minute) <= minute)

            if (parseInt(queue.tail.value.hour) <= hour && parseInt(queue.tail.value.minute) <= minute) {
                queue.enqueue({ text: message, hour: parseInt(hour), minute: parseInt(minute) })
                // console.log('Успешно сработал блок if', queue)

                
            }
            else {
                const newMinuteI = parseInt(minute) + 5
                // console.log('Успешно сработал блок else', queue)

                return user.uiSend(player, 'client::fraction', 'openMenu', {
                    menu: 'walkie-tolkie',
                    data: {
                        hour: hour,
                        minute: newMinuteI < 10 ? '0' + newMinuteI.toString() : newMinuteI.toString(),

                    }
                })
                
                
            }





        }
    })

}
catch (e) {
    logger.erorr('events/user/fraction', e)
}
