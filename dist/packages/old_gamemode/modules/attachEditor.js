const fs = require('fs');



mp.events.add('finishAttach', (player, object) => {

	let objectJSON = JSON.parse(object);
	let text = `{ ${objectJSON.object}, ${objectJSON.body}, ${objectJSON.x.toFixed(4)}, ${objectJSON.y.toFixed(4)}, ${objectJSON.z.toFixed(4)}, ${objectJSON.rx.toFixed(4)}, ${objectJSON.ry.toFixed(4)}, ${objectJSON.rz.toFixed(4)} },\r\n`;
	
	player.outputChatBox(text);

	fs.appendFile('./attachments.txt', text, err => {

		if (err) {
		  console.error(err)
		  return
		}
	});
});