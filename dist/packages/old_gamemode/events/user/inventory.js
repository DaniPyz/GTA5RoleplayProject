const logger = require('../../modules/logger')
const sys_works_farm = require('../../systems/works/farm')
try {
    const sha256 = require('js-sha256')

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

    mp.events.add({
        "client::user:inventory:useItem": (player, id, type, indexInSection) => {
            let itemData = null
            let invData = null
            if (type === 'backpack') {
                invData = container.get('user', player.id, 'char_backpack')[id]
                itemData = CONFIG_INVENTORY[invData.id]
            }
            else if (type === 'inventory') {
                invData = container.get('user', player.id, 'char_inventory')[id]
                itemData = CONFIG_INVENTORY[invData.id]
            }
            if (!itemData) return user.notify(player, 'Предмет не найден', 'error')

            switch (itemData.type) {
                case 'backpack':
                    {
                        if (container.get('user', player.id, 'char_backpackStatus') === invData.id) return user.notify(player, 'У Вас уже надета данная сумка', 'error')
                        if (container.get('user', player.id, 'char_backpackStatus') !== 0) {
                            if (!user.addInventory(player, container.get('user', player.id, 'char_backpackStatus'), 1, {}, true)) return user.notify(player, 'У Вас нет места в инвентаре, чтобы добавить сумку', 'error')
                        }
                        console.log(invData.id, indexInSection)
                        user.removeInventory(player, invData.id, 1, false, indexInSection)

                        container.set('user', player.id, 'char_backpackStatus', invData.id)
                        user.save(player)

                        user.updateUIInventory(player)
                        user.updateClothes(player)
                        break
                    }
                case 'seed':
                    {
                        sys_works_farm.plantingSeed(player)
                        console.log(invData.id, itemData.type, indexInSection)

                        user.removeInventory(player, invData.id, 1, false, indexInSection)

                        break
                    }
                default:
                    {
                        user.notify(player, 'Данный предмет пока нельзя использовать', 'warning')
                        break
                    }
            }
        },
        "client::user:inventory:dropItem": (player, id, type, indexInSection) => {
            let itemData = null
            let invData = null

            if (type === 'backpack') {
                invData = container.get('user', player.id, 'char_backpack')[id]
                itemData = CONFIG_INVENTORY[invData.id]
            }
            else if (type === 'inventory') {
                invData = container.get('user', player.id, 'char_inventory')[id]
                itemData = CONFIG_INVENTORY[invData.id]
            }
            if (!itemData) return user.notify(player, 'Предмет не найден', 'error')
            if (player.vehicle) return
            let pos = player.position;
            pos.z -= 1;
            if (itemData.drop) {
                mp.objects.new(itemData.drop, pos, {
                    dimension: 0
                });
            }


            user.removeInventory(player, invData.id, 1, false, indexInSection)


            user.save(player)

            user.updateUIInventory(player)





        },
        "client::user:inventory:splitItem": (player, id, type, indexInSection) => {
            let itemData = null
            let invData = null

            if (type === 'backpack') {
                invData = container.get('user', player.id, 'char_backpack')[id]
                itemData = CONFIG_INVENTORY[invData.id]
            }
            else if (type === 'inventory') {
                invData = container.get('user', player.id, 'char_inventory')[id]
                itemData = CONFIG_INVENTORY[invData.id]
            }
            if (!itemData) return user.notify(player, 'Предмет не найден', 'error')

            function isEven(value) {
                return !(value % 2)
            }
            let value
            let removeValue
            if (isEven(invData.count) === true) {
                removeValue = invData.count / 2
                value = invData.count / 2
            } else {
                removeValue = ((invData.count % 2) ? invData.count / 2 + .5 : invData.count / 2) + 1;
                value = (invData.count % 2) ? invData.count / 2 - .5 : invData.count / 2;
            }
            console.log(value, removeValue)
            user.removeInventory(player, invData.id, removeValue, false, indexInSection)
            user.addInventory(player, invData.id, value, {}, false, 0, false)

            user.save(player)






        },
        "client::user:inventory:tradeItem": (player, data) => {
            data = JSON.parse(data)

            let tempInv = null
            let tempInvTrade = null

            if (data.insertType === 'inventory') tempInvTrade = container.get('user', player.id, 'char_inventory')
            else if (data.insertType === 'backpack') tempInvTrade = container.get('user', player.id, 'char_backpack')

            if (data.tradeType === 'inventory') tempInv = container.get('user', player.id, 'char_inventory')
            else if (data.tradeType === 'backpack') tempInv = container.get('user', player.id, 'char_backpack')
            else if (data.tradeType === 'user') {
                switch (data.tradeID) {
                    case 'backpack':
                        {
                            if (tempInvTrade[data.insertID].type !== 'backpack') return user.notify(player, 'Сюда поместить можно только сумку', 'error')

                            if (container.get('user', player.id, 'char_backpackStatus') === tempInvTrade[data.insertID].id) return user.notify(player, 'У Вас уже надета данная сумка', 'error')
                            if (container.get('user', player.id, 'char_backpackStatus') !== 0) {
                                if (!user.addInventory(player, container.get('user', player.id, 'char_backpackStatus'), 1, {}, true)) return user.notify(player, 'У Вас нет места в инвентаре, чтобы добавить сумку', 'error')
                            }

                            container.set('user', player.id, 'char_backpackStatus', tempInvTrade[data.insertID].id)
                            user.removeInventory(player, tempInvTrade[data.insertID].id)

                            user.save(player)

                            user.updateUIInventory(player)
                            user.updateClothes(player)

                            break
                        }
                }
                return
            }
            else return

            const temp = tempInv[data.tradeID]

            tempInv[data.tradeID] = tempInvTrade[data.insertID]
            tempInvTrade[data.insertID] = temp

            if (data.tradeType === 'inventory') container.set('user', player.id, 'char_inventory', tempInv)
            else if (data.tradeType === 'backpack') container.set('user', player.id, 'char_backpack', tempInv)

            if (data.insertType === 'inventory') container.set('user', player.id, 'char_inventory', tempInvTrade)
            else if (data.insertType === 'backpack') container.get('user', player.id, 'char_backpack', tempInvTrade)

            user.save(player)
            user.updateUIInventory(player)
        },
        "client::user:inventory:setItem": (player, data) => {
            data = JSON.parse(data)

            let tempInv = null
            let tempInvTrade = null

            if (data.type === 'inventory') tempInv = container.get('user', player.id, 'char_inventory')
            else if (data.type === 'backpack') tempInv = container.get('user', player.id, 'char_backpack')

            if (data.insertType === 'inventory') tempInvTrade = container.get('user', player.id, 'char_inventory')
            else if (data.insertType === 'backpack') tempInvTrade = container.get('user', player.id, 'char_backpack')
            else if (data.insertType === 'user') {
                switch (data.insertID) {
                    case 'backpack':
                        {
                            if (tempInv[data.id].type !== 'backpack') return user.notify(player, 'Сюда поместить можно только сумку', 'error')

                            container.set('user', player.id, 'char_backpackStatus', tempInv[data.id].id)
                            user.removeInventory(player, tempInv[data.id].id)

                            user.save(player)

                            user.updateUIInventory(player)
                            user.updateClothes(player)

                            break
                        }
                }
                return
            }
            else return

            tempInvTrade[data.insertID] = tempInv[data.id]
            tempInv[data.id] = 0

            if (data.type === 'inventory') container.set('user', player.id, 'char_inventory', tempInv)
            else if (data.type === 'backpack') container.set('user', player.id, 'char_backpack', tempInv)

            if (data.insertType === 'inventory') container.set('user', player.id, 'char_inventory', tempInvTrade)
            else if (data.insertType === 'backpack') container.get('user', player.id, 'char_backpack', tempInvTrade)

            user.save(player)
            user.updateUIInventory(player)
        },
        "client::user:inventory:takeoff": (player, id, type, indexInSection) => {
            if (type === 'user') {
                if (id === 'backpack' && container.get('user', player.id, 'char_backpackStatus') > 0 && container.get('user', player.id, 'char_backpackStatus') < 10) {
                    // console.log(container.get('user', player.id, 'char_backpack'))
                    if (!user.addInventory(player, container.get('user', player.id, 'char_backpackStatus'), 1, {}, true, user.getBackpackWeight(player))) return user.notify(player, 'У Вас нет места в инвентаре, чтобы добавить сумку', 'error')


                    container.set('user', player.id, 'char_backpackStatus', 0)
                    user.save(player)

                    user.updateUIInventory(player)
                    user.updateClothes(player)
                }
            }
        }
    })
}
catch (e) {
    logger.error('events/user/inventory', e)
}
