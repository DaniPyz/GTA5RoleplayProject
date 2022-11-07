const logger = require('./modules/logger')
const svgCaptcha = require('svg-captcha');
const biz = require('./property/biz');

try {
    // mp.events.add('packagesLoaded', () =>
    // {
    //     logger.log('Все было загружено')
    // })

    require('./events/index')
    require('./commands/index')
    require('./modules/attachEditor')
    // require('./static-attachments/index')

    logger.log('Mode started...')
    const mysql = require('./plugins/mysql')
    mysql.connect(async () => {
        mysql.query('update users set online -1, onlineChar = -1')
        const houses = require('./property/houses');

        const sys_npc = require('./systems/npc')
        const sys_vehicle = require('./systems/vehicle')

        const sys_works_cab = require('./systems/works/cab');
        const sys_works_farm = require('./systems/works/farm')
        const sys_works_port = require('./systems/works/port')
        const sys_works_garbage = require('./systems/works/garbage')
        const sys_works_leaflets = require('./systems/works/leaflets');
        houses.load()
        biz.load()
        sys_vehicle.load()

        sys_npc.create([-1688.9957275390625, -1051.9530029296875, 13.075207710266113, -132.7080535888672, 0], 'testnpc', 'Джордж', 'g_m_m_armboss_01', {
            desc: 'Тестовый NPC'
        })
        sys_npc.create([-1659.001708984375, -948.0562744140625, 7.717373371124268, -178.52748107910156, 0], 'motoBike', 'Андрей', 'g_m_m_casrn_01', {
            desc: 'NPC дает в аренду мопеды',
            blip: true
        })
        sys_npc.create([-332.51690673828125, -2792.82080078125, 5.000238418579102, 87.87495422363281, 0], 'portnpc', 'Derek', 'g_m_m_casrn_01', {
            desc: 'NPC устраивает вас на работу в порту',
            blip: true,
            blipType: 371,
            blipColor: 32,
            blipName: 'Порт'
        })
        // farm
        sys_npc.create([2030.1015625, 4980.18701171875, 42.098289489746094, -54.32744598388672, 0], 'farmnpc', 'Andrew', 'a_m_m_farmer_01', {
            desc: 'NPC устраивает вас на ферму',
            blip: true,
            blipType: 85,
            blipColor: 28,
            blipName: 'Ферма'
        })
        sys_npc.create([2243.39501953125, 5154.2314453125, 57.88713836669922, 98.67520141601562, 0], 'farmnpcbuy', 'Michael', 'cs_terry', {
            desc: 'NPC покапает у вас растения',
            blip: false,

        })
        // cab
        sys_npc.create([895.45263671875, -179.43385314941406, 74.70026397705078, -64.90423583984375, 0], 'cabnpc', 'Frederico', 'ig_mrk', {
            desc: 'NPC устраивает вас на работу в такси',
            blip: true,
            blipType: 56,
            blipColor: 60,
            blipName: 'Такси'

        })

        //garbage
        sys_npc.create([-431.0563659667969, -1725.743896484375, 18.951231002807617, 27.685733795166016, 0], 'garbagenpc', 'Andreas', 's_m_y_airworker', {
            desc: 'NPC устраивает вас на работу мусоровозом',
            blip: true,
            blipType: 67,
            blipColor: 28,
            blipName: 'Мусоровоз'

        })
        // leaflets
        sys_npc.create([-581.3276977539062, 182.5081787109375, 71.10066986083984, 88.71720123291016, 0], 'leafletsnpc', 'Garcia', 's_m_y_airworker', {
            desc: 'NPC устраивает вас на работу по раздаче листовок',
            blip: true,
            blipType: 67,
            blipColor: 28,
            blipName: 'Листовки'

        })










        sys_works_farm.init()
        sys_works_port.init()
        sys_works_cab.init()
        sys_works_garbage.init()
        sys_works_leaflets.init()
        setInterval(() => {
            sys_vehicle.timer()
        }, 1000)

        logger.log('Mode started is Successful')
    })
}
catch (e) {
    logger.error('Mode started Error', e)
}
