const logger = require('./logger')
try
{
    const container = {}
    container.data = {
        user: {},
        reports: {},
        adminchat: {},
        npc: {},
        vehicles: {},
        houses: {},
        work: {},
    }

    container.has = (type, id, key) =>
    {
        if(container.data[type][id] === undefined
            || container.data[type][id][key] === undefined)return false

        return true
    }
    //
    container.get = (type, id, key) =>
    {
        if(!container.has(type, id, key))return null
        return container.data[type][id][key]
    }
    container.getAll = (type, id) => {
        if (!container.data[type][id]) return null
        return container.data[type][id]
    }
    container.set = (type, id, key, value) =>
    {
        try
        {
            if(!container.data[type][id]) container.data[type][id] = {}
            container.data[type][id][key] = value

            return container.data[type][id][key]
        }
        catch(e)
        {
            logger.error('container.set', e)
        }

        return true
    }
    container.delete = (type, id) =>
    {
        delete container.data[type][id]
    }
    container.clear = (type, id, key) =>
    {
        if(container.has(type, id, key)) delete container.data[type][id][key]
    }
   
    container.deleteAll = type =>
    {
        container.data[type] = {}
    }
    container.free = type =>
    {
        let freeID
        for(var key in container.all(type))
        {
            if(!container.data[type][parseInt(key) + 1]
                && freeID === undefined) freeID = parseInt(key) + 1
        }

        if(freeID === undefined) freeID = 0
        return freeID
    }
    container.all = type =>
    {
        return container.data[type]
    }

    module.exports = container
}
catch(e)
{
    logger.error('container.js', e)
}
