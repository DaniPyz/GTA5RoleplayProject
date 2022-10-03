const func = {}

func.random = (min, max) =>
{
    if(min === 0 && max === 0)return 0

    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}
func.convertToMoscowDate = date => {
    var offsetMs = date.getTimezoneOffset() * 60 * 1000;
    var moscowOffsetMs = 3 * 60 * 60 * 1000;
    return new Date(date.getTime() + offsetMs + moscowOffsetMs);
}

func.isJSON = str =>
{
    if (typeof str !== 'string') return false;
    try {
        const result = JSON.parse(str);
        const type = Object.prototype.toString.call(result);
        return type === '[object Object]'
            || type === '[object Array]';
    } catch (err) {
        return false;
    }
}

func.distance = (pos1, pos2) =>
{
    return Math.abs(Math.sqrt(Math.pow((pos2.x - pos1.x),2) + Math.pow((pos2.y - pos1.y),2) + Math.pow((pos2.z - pos1.z),2)))
}
func.distance2D = (pos1, pos2) =>
{
    return Math.abs(Math.sqrt(Math.pow((pos2.x - pos1.x),2) + Math.pow((pos2.y - pos1.y),2)))
}

func.getSubnet = ip =>
{
    let status = false
    for(var i in ip)
    {
        if(ip[i] === '.')
        {
            if(!status) status = true
            else
            {
                return ip.substring(0, i)
            }
        }
    }
    return false
}

func.getCameraOffset = (pos, angle, dist) =>
{
    angle = angle * 0.0174533;

    pos.y = pos.y + dist * Math.sin(angle);
    pos.x = pos.x + dist * Math.cos(angle);

    return pos;
}


module.exports = func
