const logger = require('../modules/logger')
try
{
    mp.events.add({
        "client::logger:log": (player, text, args) =>
    	{
    		if(args) logger.clientLog(text, JSON.parse(args))
    		else logger.clientLog(text)
    	},
    	"client::logger:error": (player, text, args) =>
    	{
    		if(args) logger.clientError(text, JSON.parse(args))
    		else logger.clientError(text)
    	},
    	"client::logger:debug": (player, text, args) =>
    	{
    		if(args) logger.clientDebug(text, JSON.parse(args))
    		else logger.clientDebug(text)
    	}
    })
}
catch(e)
{
    logger.error('events/logger.js', e)
}
