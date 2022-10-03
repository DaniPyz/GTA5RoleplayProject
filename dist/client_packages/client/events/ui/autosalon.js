const Camera = require('./client/modules/camera');
const player = mp.players.local;

let cam = null;

mp.events.add("autosalon::enter", (_autosalon) => {
  let autosalon = JSON.parse(_autosalon);

  const vehicle = mp.vehicles.new(
    "windsor",
    new mp.Vector3(
      autosalon.vehiclePos.x,
      autosalon.vehiclePos.y,
      autosalon.vehiclePos.z
    ),
    {
      dimension: player.dimension,
      heading: autosalon.vehicleHeading,
      locked: true,
      engine: false,
      numberPlate: "SALON",
    }
  );

  cam = new Camera(vehicle, 0, 3, 6);
});
