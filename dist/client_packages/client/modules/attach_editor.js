
let stateName = ['Position', 'Rotation'];

let editObject = null;
let player = mp.players.local;

mp.events.add('attachObject', (object, bodyPart) => {



    editObject = mp.objects.new(object, player.position, {
        rotation: new mp.Vector3(0, 0, 0),
        alpha: 255,
        dimension: player.dimension
    });





    setTimeout(function () {

        editObject.attachTo(player.handle, player.getBoneIndex(bodyPart), 0.0, 0.0, -0.3, 270, 50, 0.0, true, false, false, false, 2, true);

    }, 200);
});
mp.events.add('removeAttachedObject', () => {
    editObject.destroy();
});

