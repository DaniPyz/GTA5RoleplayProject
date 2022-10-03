window.eventManager = {}
window.eventTrigger = (eventname, cmd, params = '{}') =>
{
    console.log('Ивент', eventname, 'С параметрами', params)
    if(typeof params !== 'object') params = JSON.parse(params)

    if(window.eventManager[eventname]) window.eventManager[eventname](cmd, params)
    else console.error(`event ${eventname} notfound`)

    console.log(`event trigger: ${eventname} - cmd: ${cmd}`, params)
}

let sendTime = 0
const ragemp ={
    eventCreate: (eventname, callback) =>
    {
        window.eventManager[eventname] = callback
    },
    send: (eventname, params = {}) =>
    {
        // if(sendTime > +new Date())return

        if(global.mp) global.mp.trigger(eventname, JSON.stringify(params))
        console.log(`event send: ${eventname}`, params)

        sendTime = +new Date() + 2000
    }
}

export default ragemp
