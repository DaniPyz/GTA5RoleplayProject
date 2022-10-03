const logger = {}

logger.log = (text, ...args) =>
{
	if(args.length) mp.events.callRemote('client::logger:log', text, JSON.stringify(args))
	else mp.events.callRemote('client::logger:log', text)
}
logger.error = (text, ...args) =>
{
	if(args.length) mp.events.callRemote('client::logger:error', text, JSON.stringify(args))
	else mp.events.callRemote('client::logger:error', text)
}
logger.debug = (text, ...args) =>
{
	if(args.length) mp.events.callRemote('client::logger:debug', text, JSON.stringify(args))
	else mp.events.callRemote('client::logger:debug', text)
}

exports = logger
