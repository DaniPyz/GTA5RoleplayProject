const logger = require('./logger')
try
{
    const keys = {}
    function addKey(keyName, keyCode, func)
    {
        if(typeof keyName === 'object')
        {
            for(var i in keyName) keys[i] = keyName[i]
        }
        else keys[keyName] = { keyCode, func }
    }

    module.exports = { addKey, keys }
}
catch(e)
{
    logger.error('modules/keys', e)
}
