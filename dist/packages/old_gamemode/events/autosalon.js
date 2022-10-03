const AUTOSALON_LIST = [
  {
    name: "San Andreas",
    pos: new mp.Vector3(
      -43.113731384277344,
      -1104.1728515625,
      26.42234230041504
    ),
    vehiclePos: new mp.Vector3(
      -43.445411682128906,
      -1096.7337646484375,
      26.422353744506836
    ),
    vehicleHeading: 195,
  },
];

const autosalonShapes = new Map();

/**
 * @param {PlayerMp} player
 * @param {ColshapeMp} colshape
 * @return {void}
 */
function enterInAutosalon(player, colshape) {
  const autosalon = autosalonShapes.get(colshape);

  if (autosalon) {
    player.call("autosalon::enter", [JSON.stringify(autosalon)]);
  }
}

for (let autosalon of AUTOSALON_LIST) {
  const autosalonShape = mp.colshapes.newSphere(
    autosalon.pos.x,
    autosalon.pos.y,
    autosalon.pos.z,
    1.5
  );

  autosalonShapes.set(autosalonShape, autosalon);
}

mp.events.add("playerEnterColshape", enterInAutosalon);
