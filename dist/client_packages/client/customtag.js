const maxDistance = 10 * 25;
const width = 0.03;
const height = 0.0065;
const border = 0.001;
const color = [255, 255, 255, 255];

mp.nametags.enabled = false;

mp.events.add('render', (nametags) => {
  const graphics = mp.game.graphics;
  const screenRes = graphics.getScreenResolution(0, 0);

  
  nametags.forEach(nametag => {
    console.log(nametag);
    let [player, x, y, distance] = nametag;

    if (distance <= maxDistance) {
      let modifyText = `${player.getVariable('charName')} (${player.remoteId})`
      if (parseInt(player.getVariable('charName')) > 0) modifyText = `${player.getVariable('userName')} (${player.remoteId})`

      mp.game.graphics.drawText(modifyText, [x, y, ], {
        font: 4,
        color: [255, 255, 255, 255],
        scale: [0.4, 0.4],
        outline: false
      })
      mp.game.graphics.drawText('G', [x, y, 0.1], {
        font: 4,
        color: [255, 255, 255, 255],
        scale: [0.4, 0.4],
        outline: false
      })
      
      // if (mp.game.player.isFreeAimingAtEntity(player.handle)) {
      //   let y2 = y + 0.042;

      //   if (armour > 0) {
      //     let x2 = x - width / 2 - border / 2;

      //     graphics.drawRect(x2, y2, width + border * 2, 0.0085, 0, 0, 0, 200);
      //     graphics.drawRect(x2, y2, width, height, 150, 150, 150, 255);
      //     graphics.drawRect(x2 - width / 2 * (1 - health), y2, width * health, height, 255, 255, 255, 200);

      //     x2 = x + width / 2 + border / 2;

      //     graphics.drawRect(x2, y2, width + border * 2, height + border * 2, 0, 0, 0, 200);
      //     graphics.drawRect(x2, y2, width, height, 41, 66, 78, 255);
      //     graphics.drawRect(x2 - width / 2 * (1 - armour), y2, width * armour, height, 48, 108, 135, 200);
      //   }
      //   else {
      //     graphics.drawRect(x, y2, width + border * 2, height + border * 2, 0, 0, 0, 200);
      //     graphics.drawRect(x, y2, width, height, 150, 150, 150, 255);
      //     graphics.drawRect(x - width / 2 * (1 - health), y2, width * health, height, 255, 255, 255, 200);
      //   }
      // }
    }
 
  })
})