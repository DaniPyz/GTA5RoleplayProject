// user.addInventory = (player, id, count = 1, data = {}, onlyInv = false, customWeight = 0, canStack = false) => {
//   if (!CONFIG_INVENTORY[id]) return false

//   if (!onlyInv) {
//     if (user.getInventoryWeight(player) + CONFIG_INVENTORY[id].weight > CONFIG_ENUMS.invMaxWeight
//       && user.getBackpackWeight(player) + CONFIG_INVENTORY[id].weight > user.getBackpackMaxWeight(player)) return false
//   }
//   else {
//     if (user.getInventoryWeight(player) + CONFIG_INVENTORY[id].weight > CONFIG_ENUMS.invMaxWeight) return false
//   }

//   const invItem = CONFIG_INVENTORY[id]
//   if ((user.getInventoryWeight(player) + CONFIG_INVENTORY[id].weight > CONFIG_ENUMS.invMaxWeight
//     || !onlyInv) && user.getBackpackMaxWeight(player) !== 0.0) {
//     const tempInv = container.get('user', player.id, 'char_backpack')

//     let status = false


//     if (canStack === true) {
//       const found = tempInv.some((el, i) => {
//         if (el && el.id === id) {
//           status = true
//           tempInv[i].count = tempInv[i].count + count
//         }
//       });
//       if (!found) {
//         tempInv.map((item, i) => {


//           if (!item && !status) {
//             status = true

//             tempInv[i] = invItem
//             if (customWeight !== 0) tempInv[i].weight = customWeight

//             tempInv[i].id = id
//             tempInv[i].data = data
//             tempInv[i].data.personalId = id.toString() + count.toString()
//             tempInv[i].count = count
//             tempInv[i].status = 4
//           }
//         })
//       }
//     } else {
//       tempInv.map((item, i) => {


//         if (!item && !status) {
//           status = true

//           tempInv[i] = invItem
//           if (customWeight !== 0) tempInv[i].weight = customWeight

//           tempInv[i].id = id
//           tempInv[i].data = data
//           tempInv[i].data.personalId = id.toString() + count.toString()
//           tempInv[i].count = count
//           tempInv[i].status = 4
//         }
//       })
//     }









//     if (!status) return false
//     container.set('user', player.id, 'char_backpack', tempInv)
//   }
//   else {
//     const tempInv = container.get('user', player.id, 'char_inventory')

//     let status = false

//     if (canStack === true) {
//       const found = tempInv.some((el, i) => {
//         if (el && el.id === id) {
//           status = true
//           tempInv[i].count = tempInv[i].count + count
//         }
//       });
//       if (!found) {
//         tempInv.map((item, i) => {


//           if (!item && !status) {
//             status = true

//             tempInv[i] = invItem
//             if (customWeight !== 0) tempInv[i].weight = customWeight

//             tempInv[i].id = id
//             tempInv[i].data = data
//             tempInv[i].data.personalId = id.toString() + count.toString()
//             tempInv[i].count = count
//             tempInv[i].status = 4
//           }
//         })
//       }
//     } else {
//       tempInv.map((item, i) => {


//         if (!item && !status) {
//           status = true

//           tempInv[i] = invItem
//           if (customWeight !== 0) tempInv[i].weight = customWeight

//           tempInv[i].id = id
//           tempInv[i].data = data
//           tempInv[i].data.personalId = id.toString() + count.toString()
//           tempInv[i].count = count
//           tempInv[i].status = 4
//         }
//       })
//     }


//     if (!status) return false
//     container.set('user', player.id, 'char_inventory', tempInv)
//   }
//   let user_backpack = CONFIG_INVENTORY[container.get('user', player.id, 'char_backpackStatus')]
//   user_backpack.id = container.get('user', player.id, 'char_backpackStatus')

//   user.save(player)
//   if (user.isOpened(player, 'inventory')) user.updateUIInventory(player)

//   user.notify(player, `В Ваш инвентарь был добавлен новый предмет: ${CONFIG_INVENTORY[id].name} [${count} шт.]`)
//   logs.send('user', user.charID(player), `В инвентарь был добавлен предмет: ${CONFIG_INVENTORY[id].name} [${count} шт.]`)

//   return true
}
user.removeInventory = (player, id, count = 1, notify = false, indexInSection) => {
  if (!CONFIG_INVENTORY[id]) return false

  let tempInv = container.get('user', player.id, 'char_inventory')
  console.log(tempInv, indexInSection)
  tempInv.forEach((item, i) => {
    if (item && item.id === id && count > 0) {

      if (tempInv[i].count >= count) {
        tempInv[i].count -= count
        count = 0

        if (tempInv[i].count <= 0) tempInv[i] = null
        user.updateUIInventory(player)

      }
      else {
        count -= tempInv[i].count
        tempInv[i] = 0
      }
    }
  })
  container.set('user', player.id, 'char_inventory', tempInv)

  if (count > 0) {
    let tempInv = container.get('user', player.id, 'char_backpack')
    tempInv.forEach((item, i) => {
      if (item
        && item.id === id
        && count > 0) {
        if (tempInv[i].count >= count) {
          tempInv[i].count -= count
          count = 0

          if (tempInv[i].count <= 0) tempInv[i] = null
          user.updateUIInventory(player)
        }
        else {
          count -= tempInv[i].count
          tempInv[i] = 0
        }
      }
    })
    container.set('user', player.id, 'char_backpack', tempInv)
  }

  user.save(player)
  if (count > 0) return user.removeInventory(player, id, count, notify)

  if (notify) user.notify(player, `Из Вашего инвентаря был удален предмет: ${CONFIG_INVENTORY[id].name}`)
  logs.send('user', user.charID(player), `Из инвентаря был удален предмет: ${CONFIG_INVENTORY[id].name}`)
}











// Использовать если не работает 


// if (!CONFIG_INVENTORY[id]) return false

// let tempInv = container.get('user', player.id, 'char_inventory')

// if (!indexInSection) return
// let status = false
// if (tempInv[indexInSection] && tempInv[indexInSection].id === id && count > 0 && !status) {

//   if (tempInv[indexInSection].count >= count) {
//     tempInv[indexInSection].count -= count
//     count = 0

//     if (tempInv[indexInSection].count <= 0) tempInv[indexInSection] = null
//     status = true
//   }
//   else {
//     user.notify(player, 'Вы хотите удилить больше чем у вас есть.', 'error')
//     tempInv[indexInSection] = null
//   }

//   container.set('user', player.id, 'char_inventory', tempInv)
//   if (!status) return false
// }

// tempInv = container.get('user', player.id, 'char_backpack')
// console.log(tempInv.indexOf(tempInv[indexInSection]))
// if (indexInSection == tempInv.indexOf(tempInv[indexInSection]) && tempInv[indexInSection].id === id && count > 0 && !status) {

//   if (tempInv[indexInSection].count >= count) {
//     tempInv[indexInSection].count -= count
//     count = 0
//     if (tempInv[indexInSection].count <= 0) tempInv[indexInSection] = null
//     status = true
//   }
//   else {
//     user.notify(player, 'Вы хотите удилить больше чем у вас есть.', 'error')
//     tempInv[indexInSection] = null
//   }

//   container.set('user', player.id, 'char_backpack', tempInv)

//   if (!status) return false
// }