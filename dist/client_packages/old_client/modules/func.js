const logger = require('./client/modules/logger')
try
{
    const func = {}

    func.getCameraOffset = (pos, angle, dist) =>
    {
        angle = angle * 0.0174533;

        pos.y = pos.y + dist * Math.sin(angle);
        pos.x = pos.x + dist * Math.cos(angle);

        return pos;
    }
    func.getStreetNames = () =>
    {
        const position = mp.players.local.position
        let result = [ 'Неизвестно', '' ]

        if(position.z >= -30)
        {
            const zoneHash = mp.game.zone.getNameOfZone(position.x, position.y, position.z)
            const streetHash = mp.game.pathfind.getStreetNameAtCoord(position.x, position.y, position.z, 0, 0)

            result = [
                mp.game.ui.getLabelText(zoneHash),
                mp.game.ui.getStreetNameFromHashKey(streetHash.streetName)
            ]
        }
        return result
    }

    func.distance = (pos1, pos2) =>
    {
        Math.abs(Math.sqrt(Math.pow((pos2.x - pos1.x), 2) + Math.pow((pos2.y - pos1.y), 2)))
        return Math.abs(Math.sqrt(Math.pow((pos2.x - pos1.x),2) + Math.pow((pos2.y - pos1.y),2) + Math.pow((pos2.z - pos1.z),2)))
    }
    func.distance2D = (pos1, pos2) => {
        return Math.abs(Math.sqrt(Math.pow((pos2.x - pos1.x), 2) + Math.pow((pos2.y - pos1.y), 2)))
    }

    exports = func
}
catch(e)
{
    logger.error('func.js', e)
}
