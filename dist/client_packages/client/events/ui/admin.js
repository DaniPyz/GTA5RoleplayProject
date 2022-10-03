const logger = require('./client/modules/logger')
try
{
    const user = require('./client/user')
    const ui = require('./client/modules/ui')

    mp.events.add({
        "ui::admin:openMenu": data =>
        {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:admin:openMenu', data.id)
        },
        "ui::admin:reportSendMessage": data =>
        {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:admin:reportSendMessage', data.id, data.text)
        },
        "ui::admin:reportSendEvent": data =>
        {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:admin:reportSendEvent', data.id, data.eventname)
        },

        "ui::admin:tp": data =>
        {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:admin:tp', data.id)
        },
        "ui::admin:setLider": data =>
        {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:admin:setLider', data.fracId, data.liderID)
        },
        "ui::admin:invitems": data =>
        {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:admin:invitems', data.id, data.charname)
        },

        "ui::admin:chatSend": data =>
        {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:admin:chatSend', data.text)
        },
        "ui::admin:chatView": data =>
        {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:admin:chatView', data.id)
        },

        "ui::admin:login": data =>
        {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:admin:login', data.password)
        },
        "ui::admin:login:new": data =>
        {
            data = JSON.parse(data)

            if(data.password !== data.passwordre)return user.notify('Введенные пароли не совпадают', 'error')
            if(data.password.length < 10)return user.notify('Длина пароля должна быть не менее 10ти символов', 'error')
            if(data.password.search(/[0-9]/) < 0)return user.notify('Ваш пароль должен содержать минимум одну цифру', 'error')
            // if(data.password.search(/[A-Z]/i) < 0)return user.notify('Ваш пароль должен содержать минимум одну заглавную букву', 'error')

            mp.events.callRemote('client::user:admin:login:new', data.password)
        },
        "ui::admin:out": () =>
        {
            mp.events.callRemote('client::user:admin:out')
        },

        "ui::admin:addAdmin": () =>
        {
            ui.send('client::admin', 'dialog', {
                status: true,
                title: 'Постановление администратора',
                text: 'Введите ник аккаунта, которого хотите поставить на админку:',
                type: 'input',
                btn: [ 'Поставить', 'Отмена' ]
            })
            mp.players.local._adminDialogCallback = (btn, input) =>
            {
                if(btn === 1) ui.send('client::admin', 'dialog', {
                    status: false,
                    title: 'Постановление администратора',
                    text: 'Введите ник аккаунта, которого хотите поставить на админку:',
                    type: 'input',
                    btn: [ 'Поставить', 'Отмена' ]
                })
                else mp.events.callRemote('client::user:admin:addAdmin', input)
            }
        },
        "ui::admin:adminEdit": data =>
        {
            data = JSON.parse(data)
            mp.events.callRemote('client::user:admin:adminEdit', data.id, data.type)
        },

        "ui::admin:dialogEnter": data =>
        {
            data = JSON.parse(data)

            if(!data.server) mp.players.local._adminDialogCallback(data.btn, data.input)
            else mp.events.callRemote('client::user:admin:dialogEnter', data.btn, data.input)
        }
    })
}
catch(e)
{
    logger.error('events/ui/admin', e)
}
