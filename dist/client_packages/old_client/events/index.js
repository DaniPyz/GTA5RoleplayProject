require('./client/events/user')
require('./client/events/ui')
require('./client/events/other')
require("./client/events/ui/autosalon")

require('./client/events/ui/reg')
require('./client/events/ui/choicechar')
require('./client/events/ui/createchar')
require('./client/events/ui/keypressed')
require('./client/events/ui/hud')
require('./client/events/ui/menu')
require('./client/events/ui/admin')
require('./client/events/ui/npcdialog')
require('./client/events/ui/inventory')
require('./client/events/ui/dialog')
require('./client/events/ui/death')
require('./client/events/ui/phone')
require('./client/events/ui/fraction')


const user = require('./client/user')

const ui = require('./client/modules/ui')
const logger = require('./client/modules/logger')

// const mysql = require('../../../packages/gamemode/plugins/mysql')
mp.nametags.enabled = false;

let player = mp.players.local
mp.events.add({
	"playerJoin": player => {
		// let cityId = cities.find(city => city.name === searchTerm).id
		logger.log("New player: " + player.id);
		// mysql.query('select users from fraction where id = ?', [], (err, res) => {
	},
	'playerQuit': player => {
		if (player.isListening) {
			const id = user.voiceListener.indexOf(player)
			if (id !== -1) user.voiceListener.splice(id, 1)

			player.isListening = false
			mp.events.callRemote("client::user:removeVoiceListener", player)
		}
	},

	'playerCreateWaypoint': position => {
		let getGroundZ = mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, 90, parseFloat(0), false);
		logger.log('CreateWaypoint', getGroundZ)
		if (player.vehicle !== null && player.vehicle.model === mp.game.joaat('taxi')) {
			let getGroundZ = mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, 90, parseFloat(0), false);
			mp.events.callRemote("client::playerCreateWaypoint", position.x, position.y, getGroundZ);

		}

	},
	// "playerEnterColshape": (player, shape) => {
	// 	if (shape.getVariable('cabID') ===) {

	// 	}

	// },


	'render': (nametags) => {

		mp.game.audio.setRadioToStationName("OFF");

		mp.game.vehicle.defaultEngineBehaviour = false
		mp.players.local.setConfigFlag(429, true)
		if (mp.players.local.vehicle) {
			const speed = mp.players.local.vehicle.getSpeed() * 3.6
			// if (speed > 0) { // СДЕЛАТЬ ПРОВЕРКУ НА СКОРОСТЬ ЧТОБЫ НЕ ВЫЗЫВАТЬ ЛИШНИЕ РЕНДЕРЫ
			if (mp.players.local.vehicle.getPedInSeat(-1) === mp.players.local.handle) {
				ui.send('client::hud', 'speedometr', {
					speedometrSpeed: parseInt(speed) > 1 ? parseInt(speed) : 0
				}, false)
			}
			// } else {

			// }

			user.vehicleMileage += speed / 25 / 3000
			if (user.vehicleMileage >= 1) {
				user.vehicleMileage = 0.0
				mp.events.callRemote('client::vehicles:giveMileage', JSON.stringify({
					mileage: 1,
					vehicle: mp.players.local.vehicle
				}))
			}
		}

		if (user.escStatus === false) mp.game.controls.disableControlAction(32, 200, true)

		const controls = mp.game.controls;

		controls.enableControlAction(0, 23, true);
		controls.disableControlAction(0, 58, true);

		if (controls.isDisabledControlJustPressed(0, 58)) {
			let position = mp.players.local.position;
			let vehHandle = mp.game.vehicle.getClosestVehicle(position.x, position.y, position.z, 5, 0, 70);

			let vehicle = mp.vehicles.atHandle(vehHandle);

			if (vehicle
				&& vehicle.isAnySeatEmpty()
				&& vehicle.getSpeed() < 5) {
				mp.players.local.taskEnterVehicle(vehicle.handle, 5000, 0, 2, 1, 0);
			}
		}


		// if (typeof nametags === 'object') {
		// 	nametags.forEach(nametag => {
		// 		try {
		// 			let [player, x, y, distance] = nametag
		// 			let ray = mp.raycasting.testPointToPoint(player.position, player.position, mp.players.local, 1)

		// 			if (ray) {
		// 				if (distance <= 25 * 25) {
		// 					let modifyText = `${player.getVariable('charName')} (${player.remoteId})\n<< ${player.getVariable('charID')} >>`
		// 					if (parseInt(player.getVariable('charName')) > 0) modifyText = `${player.getVariable('userName')} (${player.remoteId})\n<< ${player.getVariable('userID')} >>`

		// 					mp.game.graphics.drawText(modifyText, [x, y], {
		// 						font: 4,
		// 						color: [255, 255, 255, 255],
		// 						scale: [0.3, 0.3],
		// 						outline: false
		// 					})
		// 				}
		// 			}
		// 		}
		// 		catch (e) {
		// 			logger.error('render', e)
		// 		}
		// 	})
		// }
	}
})
