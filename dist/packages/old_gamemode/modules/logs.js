const logger = require('./logger')
try
{
    const mysql = require('../plugins/mysql')

    const logs = {}

    logs.send = (type, id, text, data = {}) =>
    {
        mysql.query('insert into logs (type, logid, text, data) values (?, ?, ?, ?)', [ type, id, text, JSON.stringify(data) ], (err, res) =>
        {
            if(err)return logger.error('logs.send', err)
        })
    }

    module.exports = logs
}
catch(e)
{
    logger.error('modules/logs', e)
}
