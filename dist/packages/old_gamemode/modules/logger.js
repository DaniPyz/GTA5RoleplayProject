const debugEnabled = true

module.exports =
{
	log: (text, ...args) =>
	{
		if(args.length) console.log(`\x1b[32m[ logger ]\x1b[0m ${text}`, args)
		else console.log(`\x1b[32m[ logger ]\x1b[0m ${text}`)
	},
	error: (text, ...args) =>
	{
		if(args.length) console.log(`\e[31m[ ERROR ]\x1b[0m ${text}`, args)
		else console.log(`\e[31m[ ERROR ]\x1b[0m ${text}`)
	},
	debug: (text, ...args) =>
	{
		if(debugEnabled === false)return

		if(args.length) console.log(`[ debug ] ${text}`, args)
		else console.log(`[ debug ] ${text}`)
	},

	mysqlLog: (text, ...args) =>
	{
		if(args.length) console.log(`[ MySQL logger ] ${text}`, args)
		else console.log(`[ MySQL logger ] ${text}`)
	},
	playerLog: (player, text, ...args) =>
	{
		if(args.length) console.log(`[ Player logger ] ${player.getName()}: ${text}`, args)
		else console.log(`[ Player logger ] ${player.getName()}: ${text}`)
	},

	clientLog: (text, args) =>
	{
		if(args) console.log(`\x1b[32m[ client logger ]\x1b[0m ${text}`, args)
		else console.log(`\x1b[32m[ client logger ]\x1b[0m ${text}`)
	},
	clientError: (text, args) =>
	{
		if(args) console.log(`\x1b[31m[ CLIENT ERROR ]\x1b[0m ${text}`, args)
		else console.log(`\x1b[31m[ CLIENT ERROR ]\x1b[0m ${text}`)
	},
	clientDebug: (text, args) =>
	{
		if(debugEnabled === false)return

		if(args) console.log(`[ client debug ] ${text}`, args)
		else console.log(`[ client debug ] ${text}`)
	},
}
