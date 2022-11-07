const logger = require('../modules/logger')
try
{
    const chat = require('../chat')

    mp.events.add({
        "chat::user:say": (player, text, color) =>
    	{
    		chat.local(player, text, color)
    	},
        "chat::admin:say": (text, color) =>
    	{
    		chat.admin(color, text, 'adm')
        },
        "chat::fraction:ems": (text,id = 1) => {
            chat.ems(id,text)
        },
        "chat::fraction:lspd": (text, id = 2) => {
            chat.lspd(id, text)
        }
    })
}
catch(e)
{
    logger.error('events/chat.js', e)
}
