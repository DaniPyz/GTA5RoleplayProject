const logger = require('./logger')
try
{
    const commands = {}
    function addCommand(cmdName, func)
    {
        if(typeof cmdName === 'object')
        {
            for(var i in cmdName) commands[i] = cmdName[i]
        }
        else commands[cmdName] = func
    }

    module.exports = { addCommand, commands }
}
catch(e)
{
    logger.error('modules/commands', e)
}
