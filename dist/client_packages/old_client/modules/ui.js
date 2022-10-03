const logger = require('./client/modules/logger')
try {
    let browser = null
    let cefActive = false

    exports = {
        start: () => {
            browser = mp.browsers.new('package://ui/index.html')
            mp.events.add('browserDomReady', () => {
                cefActive = true
                logger.log('UI started')

                mp.events.callRemote('client::user:join')
            })
        },
        send: (eventname, cmd, data = {}, log = true) => {
            if (!cefActive) return logger.error('cefActive is false')

            browser.execute(`window.eventTrigger('${eventname}', '${cmd}', '${JSON.stringify(data)}')`)
            // if(log) logger.log(`window.eventTrigger('${eventname}', '${cmd}', '${JSON.stringify(data)}')`)
            if (log) logger.debug('cef send', {
                eventname,
                cmd,
                data
            })
        }
    }
}
catch (e) {
    logger.error('modules/ui', e)
}
