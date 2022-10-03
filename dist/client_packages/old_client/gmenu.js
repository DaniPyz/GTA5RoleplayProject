const maxDistance = 10 * 25;
const width = 0.03;
const height = 0.0065;
const border = 0.001;
const color = [255, 255, 255, 255];

mp.events.add('render', () => {
  const localPlayer = mp.players.local


// forEach был обычный 
  mp.players.forEachInStreamRange(pl => {
    if (pl !== localPlayer) {




      var playerPos = mp.players.local.position

      var playerDist = mp.game.gameplay.getDistanceBetweenCoords(playerPos.x, playerPos.y, playerPos.z, pl.position.x, pl.position.y, pl.position.z, true)
      if (playerDist > 5) return // если дистанция > 15 то он не будет рендерить
      // if (playerDist = 0) return
      mp.game.graphics.drawText(`G`,
        [pl.position.x, pl.position.y, pl.position.z], {
        font: 4,
        color: [255, 255, 255, 185],
        scale: [0.5, 0.5]
      });
    }
  })
})
