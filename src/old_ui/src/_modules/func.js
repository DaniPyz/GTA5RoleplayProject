const func = {}

func.random = (min, max) =>
{
    if(min === 0 && max === 0)return 0

    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}
func.randomFloat = (min, max) =>
{
    return Math.random() * (max - min) + min;
}

func.rgbToHex = (r, g, b) =>
{
    function componentToHex(c)
    {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
func.hexToRgb = (hex) =>
{
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}


export default func
