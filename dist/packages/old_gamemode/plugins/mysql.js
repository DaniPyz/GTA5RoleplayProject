const logger = require('../modules/logger')
try
{
    let dbhandle = null

    const CONFIG_MYSQL = require('../configs/CONFIG_MYSQL.json')
    const mysql2 = require('mysql2')

    module.exports = {
        connect: async (callback) =>
        {
            try
            {
                dbhandle = await mysql2.createPool(CONFIG_MYSQL)
                // dbhandle.connect((err, res) =>
                // {
                //     if(err)return logger.error('error', err)
                //
                //     dbhandle.query(`use ${CONFIG_MYSQL.base}`, [])
                //     dbhandle.query('set global wait_timeout=172800', [], (err, res) =>
                //     {
                //         if(err)return logger.error('mysql.connect', err)
                //
                //         callback()
                //         logger.log('MySQL connection: OK!')
                //     })
                // })

                // logger.log(`use ${CONFIG_MYSQL.base}`)
                // dbhandle.query(`use ${CONFIG_MYSQL.base}`, [], (err, res) =>
                // {
                //     if(err)return logger.error('mysql.connect', err)
                // })

                callback()
                logger.log('MySQL connection: OK!')
                // dbhandle.query('set global wait_timeout=172800', [], (err, res) =>
                // {
                //     if(err)return logger.error('mysql.connect', err)
                //
                //     callback()
                //     logger.log('MySQL connection: OK!')
                // })
            }
            catch(e)
            {
                logger.error('MySQL connection: error', e)
            }
        },
        query: (query, args = [], callback = null) =>
        {
            dbhandle.query(query, args, callback)
        }
    }
}
catch(e)
{
    logger.error('mysql.js', e)
}
