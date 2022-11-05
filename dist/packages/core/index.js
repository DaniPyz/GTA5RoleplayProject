'use strict';

var typeorm = require('typeorm');
require('reflect-metadata');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

// @ts-nocheck
var MpTypes;
(function (MpTypes) {
    MpTypes["Blip"] = "b";
    MpTypes["Checkpoint"] = "cp";
    MpTypes["Colshape"] = "c";
    MpTypes["Label"] = "l";
    MpTypes["Marker"] = "m";
    MpTypes["Object"] = "o";
    MpTypes["Pickup"] = "p";
    MpTypes["Player"] = "pl";
    MpTypes["Vehicle"] = "v";
})(MpTypes || (MpTypes = {}));
function isObjectMpType(obj, type) {
    const client = getEnvironment() === 'client';
    if (obj && typeof obj === 'object' && typeof obj.id !== 'undefined') {
        const test = (type, collection, mpType) => (client ? obj.type === type && collection.at(obj.id) === obj : obj instanceof mpType);
        switch (type) {
            case MpTypes.Blip:
                return test('blip', mp.blips, mp.Blip);
            case MpTypes.Checkpoint:
                return test('checkpoint', mp.checkpoints, mp.Checkpoint);
            case MpTypes.Colshape:
                return test('colshape', mp.colshapes, mp.Colshape);
            case MpTypes.Label:
                return test('textlabel', mp.labels, mp.TextLabel);
            case MpTypes.Marker:
                return test('marker', mp.markers, mp.Marker);
            case MpTypes.Object:
                return test('object', mp.objects, mp.Object);
            case MpTypes.Pickup:
                return test('pickup', mp.pickups, mp.Pickup);
            case MpTypes.Player:
                return test('player', mp.players, mp.Player);
            case MpTypes.Vehicle:
                return test('vehicle', mp.vehicles, mp.Vehicle);
        }
    }
    return false;
}
function uid() {
    const first = (Math.random() * 46656) | 0;
    const second = (Math.random() * 46656) | 0;
    const firstPart = ('000' + first.toString(36)).slice(-3);
    const secondPart = ('000' + second.toString(36)).slice(-3);
    return firstPart + secondPart;
}
function getEnvironment() {
    if (mp.joaat)
        return 'server';
    else if (mp.game && mp.game.joaat)
        return 'client';
    else if (mp.trigger)
        return 'cef';
}
function stringifyData(data) {
    const env = getEnvironment();
    return JSON.stringify(data, (_, value) => {
        if (env === 'client' || (env === 'server' && value && typeof value === 'object')) {
            let type;
            if (isObjectMpType(value, MpTypes.Blip))
                type = MpTypes.Blip;
            else if (isObjectMpType(value, MpTypes.Checkpoint))
                type = MpTypes.Checkpoint;
            else if (isObjectMpType(value, MpTypes.Colshape))
                type = MpTypes.Colshape;
            else if (isObjectMpType(value, MpTypes.Marker))
                type = MpTypes.Marker;
            else if (isObjectMpType(value, MpTypes.Object))
                type = MpTypes.Object;
            else if (isObjectMpType(value, MpTypes.Pickup))
                type = MpTypes.Pickup;
            else if (isObjectMpType(value, MpTypes.Player))
                type = MpTypes.Player;
            else if (isObjectMpType(value, MpTypes.Vehicle))
                type = MpTypes.Vehicle;
            if (type)
                return {
                    __t: type,
                    i: typeof value.remoteId === 'number' ? value.remoteId : value.id
                };
        }
        return value;
    });
}
function parseData(data) {
    const env = getEnvironment();
    return JSON.parse(data, (_, value) => {
        if ((env === 'client' || env === 'server') &&
            value &&
            typeof value === 'object' &&
            typeof value['__t'] === 'string' &&
            typeof value.i === 'number' &&
            Object.keys(value).length === 2) {
            const id = value.i;
            const type = value['__t'];
            let collection;
            switch (type) {
                case MpTypes.Blip:
                    collection = mp.blips;
                    break;
                case MpTypes.Checkpoint:
                    collection = mp.checkpoints;
                    break;
                case MpTypes.Colshape:
                    collection = mp.colshapes;
                    break;
                case MpTypes.Label:
                    collection = mp.labels;
                    break;
                case MpTypes.Marker:
                    collection = mp.markers;
                    break;
                case MpTypes.Object:
                    collection = mp.objects;
                    break;
                case MpTypes.Pickup:
                    collection = mp.pickups;
                    break;
                case MpTypes.Player:
                    collection = mp.players;
                    break;
                case MpTypes.Vehicle:
                    collection = mp.vehicles;
                    break;
            }
            if (collection)
                return collection[env === 'client' ? 'atRemoteId' : 'at'](id);
        }
        return value;
    });
}
function promiseResolve(result) {
    return new Promise((resolve) => setTimeout(() => resolve(result), 0));
}
function promiseReject(error) {
    return new Promise((_, reject) => setTimeout(() => reject(error), 0));
}
function promiseTimeout(promise, timeout) {
    if (typeof timeout === 'number') {
        return Promise.race([
            new Promise((_, reject) => {
                setTimeout(() => reject('TIMEOUT'), timeout);
            }),
            promise
        ]);
    }
    else
        return promise;
}
function isBrowserValid(browser) {
    try {
        browser.url;
    }
    catch (e) {
        return false;
    }
    return true;
}

// @ts-nocheck
const environment = getEnvironment();
if (!environment)
    throw 'Unknown RAGE environment';
const ERR_NOT_FOUND = 'PROCEDURE_NOT_FOUND';
const IDENTIFIER = '__rpc:id';
const PROCESS_EVENT = '__rpc:process';
const BROWSER_REGISTER = '__rpc:browserRegister';
const BROWSER_UNREGISTER = '__rpc:browserUnregister';
const TRIGGER_EVENT = '__rpc:triggerEvent';
const TRIGGER_EVENT_BROWSERS = '__rpc:triggerEventBrowsers';
const glob = environment === 'cef' ? window : global;
if (!glob[PROCESS_EVENT]) {
    glob.__rpcListeners = {};
    glob.__rpcPending = {};
    glob.__rpcEvListeners = {};
    glob[PROCESS_EVENT] = (player, rawData) => {
        if (environment !== 'server')
            rawData = player;
        const data = parseData(rawData);
        if (data.req) {
            // someone is trying to remotely call a procedure
            const info = {
                id: data.id,
                environment: data.fenv || data.env
            };
            if (environment === 'server')
                info.player = player;
            const part = {
                ret: 1,
                id: data.id,
                env: environment
            };
            let ret;
            switch (environment) {
                case 'server':
                    ret = (ev) => info.player.call(PROCESS_EVENT, [stringifyData(ev)]);
                    break;
                case 'client': {
                    if (data.env === 'server') {
                        ret = (ev) => mp.events.callRemote(PROCESS_EVENT, stringifyData(ev));
                    }
                    else if (data.env === 'cef') {
                        const browser = data.b && glob.__rpcBrowsers[data.b];
                        info.browser = browser;
                        ret = (ev) => browser && isBrowserValid(browser) && passEventToBrowser(browser, ev, true);
                    }
                    break;
                }
                case 'cef': {
                    ret = (ev) => mp.trigger(PROCESS_EVENT, stringifyData(ev));
                }
            }
            if (ret) {
                const promise = callProcedure(data.name, data.args, info);
                if (!data.noRet)
                    promise.then((res) => ret({ ...part, res })).catch((err) => ret({ ...part, err: err ? err : null }));
            }
        }
        else if (data.ret) {
            // a previously called remote procedure has returned
            const info = glob.__rpcPending[data.id];
            if (environment === 'server' && info.player !== player)
                return;
            if (info) {
                info.resolve(data.hasOwnProperty('err') ? promiseReject(data.err) : promiseResolve(data.res));
                delete glob.__rpcPending[data.id];
            }
        }
    };
    if (environment !== 'cef') {
        mp.events.add(PROCESS_EVENT, glob[PROCESS_EVENT]);
        if (environment === 'client') {
            // set up internal pass-through events
            register('__rpc:callServer', ([name, args, noRet], info) => _callServer(name, args, { fenv: info.environment, noRet }));
            register('__rpc:callBrowsers', ([name, args, noRet], info) => _callBrowsers(null, name, args, { fenv: info.environment, noRet }));
            // set up browser identifiers
            glob.__rpcBrowsers = {};
            const initBrowser = (browser) => {
                const id = uid();
                Object.keys(glob.__rpcBrowsers).forEach((key) => {
                    const b = glob.__rpcBrowsers[key];
                    if (!b || !isBrowserValid(b) || b === browser)
                        delete glob.__rpcBrowsers[key];
                });
                glob.__rpcBrowsers[id] = browser;
                browser.execute(`
                    window.name = '${id}';
                    if(typeof window['${IDENTIFIER}'] === 'undefined'){
                        window['${IDENTIFIER}'] = Promise.resolve(window.name);
                    }else{
                        window['${IDENTIFIER}:resolve'](window.name);
                    }
                `);
            };
            mp.browsers.forEach(initBrowser);
            mp.events.add('browserCreated', initBrowser);
            // set up browser registration map
            glob.__rpcBrowserProcedures = {};
            mp.events.add(BROWSER_REGISTER, (data) => {
                const [browserId, name] = JSON.parse(data);
                glob.__rpcBrowserProcedures[name] = browserId;
            });
            mp.events.add(BROWSER_UNREGISTER, (data) => {
                const [browserId, name] = JSON.parse(data);
                if (glob.__rpcBrowserProcedures[name] === browserId)
                    delete glob.__rpcBrowserProcedures[name];
            });
            register(TRIGGER_EVENT_BROWSERS, ([name, args], info) => {
                Object.values(glob.__rpcBrowsers).forEach((browser) => {
                    _callBrowser(browser, TRIGGER_EVENT, [name, args], {
                        fenv: info.environment,
                        noRet: 1
                    });
                });
            });
        }
    }
    else {
        if (typeof glob[IDENTIFIER] === 'undefined') {
            glob[IDENTIFIER] = new Promise((resolve) => {
                if (window.name) {
                    resolve(window.name);
                }
                else {
                    glob[IDENTIFIER + ':resolve'] = resolve;
                }
            });
        }
    }
    register(TRIGGER_EVENT, ([name, args], info) => callEvent(name, args, info));
}
function passEventToBrowser(browser, data, ignoreNotFound) {
    const raw = stringifyData(data);
    browser.execute(`var process = window["${PROCESS_EVENT}"]; if(process){ process(${JSON.stringify(raw)}); }else{ ${ignoreNotFound ? '' : `mp.trigger("${PROCESS_EVENT}", '{"ret":1,"id":"${data.id}","err":"${ERR_NOT_FOUND}","env":"cef"}');`} }`);
}
function callProcedure(name, args, info) {
    const listener = glob.__rpcListeners[name];
    if (!listener)
        return promiseReject(ERR_NOT_FOUND);
    return promiseResolve(listener(args, info));
}
/**
 * Register a procedure.
 * @param {string} name - The name of the procedure.
 * @param {function} cb - The procedure's callback. The return value will be sent back to the caller.
 * @returns {Function} The function, which unregister the event.
 */
function register(name, cb) {
    if (arguments.length !== 2)
        throw 'register expects 2 arguments: "name" and "cb"';
    if (environment === 'cef')
        glob[IDENTIFIER].then((id) => mp.trigger(BROWSER_REGISTER, JSON.stringify([id, name])));
    glob.__rpcListeners[name] = cb;
    return () => unregister(name);
}
/**
 * Unregister a procedure.
 * @param {string} name - The name of the procedure.
 */
function unregister(name) {
    if (arguments.length !== 1)
        throw 'unregister expects 1 argument: "name"';
    if (environment === 'cef')
        glob[IDENTIFIER].then((id) => mp.trigger(BROWSER_UNREGISTER, JSON.stringify([id, name])));
    glob.__rpcListeners[name] = undefined;
}
/**
 * Calls a local procedure. Only procedures registered in the same context will be resolved.
 *
 * Can be called from any environment.
 *
 * @param name - The name of the locally registered procedure.
 * @param args - Any parameters for the procedure.
 * @param options - Any options.
 * @returns The result from the procedure.
 */
function call(name, args, options = {}) {
    if (arguments.length < 1 || arguments.length > 3)
        return promiseReject('call expects 1 to 3 arguments: "name", optional "args", and optional "options"');
    return promiseTimeout(callProcedure(name, args, { environment }), options.timeout);
}
function _callServer(name, args, extraData = {}) {
    switch (environment) {
        case 'server': {
            return call(name, args);
        }
        case 'client': {
            const id = uid();
            return new Promise((resolve) => {
                if (!extraData.noRet) {
                    glob.__rpcPending[id] = {
                        resolve
                    };
                }
                const event = {
                    req: 1,
                    id,
                    name,
                    env: environment,
                    args,
                    ...extraData
                };
                mp.events.callRemote(PROCESS_EVENT, stringifyData(event));
            });
        }
        case 'cef': {
            return callClient('__rpc:callServer', [name, args, +extraData.noRet]);
        }
    }
}
/**
 * Calls a remote procedure registered on the server.
 *
 * Can be called from any environment.
 *
 * @param name - The name of the registered procedure.
 * @param args - Any parameters for the procedure.
 * @param options - Any options.
 * @returns The result from the procedure.
 */
function callServer(name, args, options = {}) {
    if (arguments.length < 1 || arguments.length > 3)
        return promiseReject('callServer expects 1 to 3 arguments: "name", optional "args", and optional "options"');
    let extraData = {};
    if (options.noRet)
        extraData.noRet = 1;
    return promiseTimeout(_callServer(name, args, extraData), options.timeout);
}
function _callClient(player, name, args, extraData = {}) {
    switch (environment) {
        case 'client': {
            return call(name, args);
        }
        case 'server': {
            const id = uid();
            return new Promise((resolve) => {
                if (!extraData.noRet) {
                    glob.__rpcPending[id] = {
                        resolve,
                        player
                    };
                }
                const event = {
                    req: 1,
                    id,
                    name,
                    env: environment,
                    args,
                    ...extraData
                };
                player.call(PROCESS_EVENT, [stringifyData(event)]);
            });
        }
        case 'cef': {
            const id = uid();
            return glob[IDENTIFIER].then((browserId) => {
                return new Promise((resolve) => {
                    if (!extraData.noRet) {
                        glob.__rpcPending[id] = {
                            resolve
                        };
                    }
                    const event = {
                        b: browserId,
                        req: 1,
                        id,
                        name,
                        env: environment,
                        args,
                        ...extraData
                    };
                    mp.trigger(PROCESS_EVENT, stringifyData(event));
                });
            });
        }
    }
}
/**
 * Calls a remote procedure registered on the client.
 *
 * Can be called from any environment.
 *
 * @param player - The player to call the procedure on.
 * @param name - The name of the registered procedure.
 * @param args - Any parameters for the procedure.
 * @param options - Any options.
 * @returns The result from the procedure.
 */
function callClient(player, name, args, options = {}) {
    switch (environment) {
        case 'client': {
            options = args || {};
            args = name;
            name = player;
            player = null;
            if (arguments.length < 1 || arguments.length > 3 || typeof name !== 'string')
                return promiseReject('callClient from the client expects 1 to 3 arguments: "name", optional "args", and optional "options"');
            break;
        }
        case 'server': {
            if (arguments.length < 2 || arguments.length > 4 || typeof player !== 'object')
                return promiseReject('callClient from the server expects 2 to 4 arguments: "player", "name", optional "args", and optional "options"');
            break;
        }
        case 'cef': {
            options = args || {};
            args = name;
            name = player;
            player = null;
            if (arguments.length < 1 || arguments.length > 3 || typeof name !== 'string')
                return promiseReject('callClient from the browser expects 1 to 3 arguments: "name", optional "args", and optional "options"');
            break;
        }
    }
    let extraData = {};
    if (options.noRet)
        extraData.noRet = 1;
    return promiseTimeout(_callClient(player, name, args, extraData), options.timeout);
}
function _callBrowser(browser, name, args, extraData = {}) {
    return new Promise((resolve) => {
        const id = uid();
        if (!extraData.noRet) {
            glob.__rpcPending[id] = {
                resolve
            };
        }
        passEventToBrowser(browser, {
            req: 1,
            id,
            name,
            env: environment,
            args,
            ...extraData
        }, false);
    });
}
function _callBrowsers(player, name, args, extraData = {}) {
    switch (environment) {
        case 'client':
            const browserId = glob.__rpcBrowserProcedures[name];
            if (!browserId)
                return promiseReject(ERR_NOT_FOUND);
            const browser = glob.__rpcBrowsers[browserId];
            if (!browser || !isBrowserValid(browser))
                return promiseReject(ERR_NOT_FOUND);
            return _callBrowser(browser, name, args, extraData);
        case 'server':
            return _callClient(player, '__rpc:callBrowsers', [name, args, +extraData.noRet], extraData);
        case 'cef':
            return _callClient(null, '__rpc:callBrowsers', [name, args, +extraData.noRet], extraData);
    }
}
/**
 * Calls a remote procedure registered in any browser context.
 *
 * Can be called from any environment.
 *
 * @param player - The player to call the procedure on.
 * @param name - The name of the registered procedure.
 * @param args - Any parameters for the procedure.
 * @param options - Any options.
 * @returns The result from the procedure.
 */
function callBrowsers(player, name, args, options = {}) {
    let promise;
    let extraData = {};
    switch (environment) {
        case 'client':
        case 'cef':
            options = args || {};
            args = name;
            name = player;
            if (arguments.length < 1 || arguments.length > 3)
                return promiseReject('callBrowsers from the client or browser expects 1 to 3 arguments: "name", optional "args", and optional "options"');
            if (options.noRet)
                extraData.noRet = 1;
            promise = _callBrowsers(null, name, args, extraData);
            break;
        case 'server':
            if (arguments.length < 2 || arguments.length > 4)
                return promiseReject('callBrowsers from the server expects 2 to 4 arguments: "player", "name", optional "args", and optional "options"');
            if (options.noRet)
                extraData.noRet = 1;
            promise = _callBrowsers(player, name, args, extraData);
            break;
    }
    if (promise) {
        return promiseTimeout(promise, options.timeout);
    }
}
/**
 * Calls a remote procedure registered in a specific browser instance.
 *
 * Client-side environment only.
 *
 * @param browser - The browser instance.
 * @param name - The name of the registered procedure.
 * @param args - Any parameters for the procedure.
 * @param options - Any options.
 * @returns The result from the procedure.
 */
function callBrowser(browser, name, args, options = {}) {
    if (environment !== 'client')
        return promiseReject('callBrowser can only be used in the client environment');
    if (arguments.length < 2 || arguments.length > 4)
        return promiseReject('callBrowser expects 2 to 4 arguments: "browser", "name", optional "args", and optional "options"');
    let extraData = {};
    if (options.noRet)
        extraData.noRet = 1;
    return promiseTimeout(_callBrowser(browser, name, args, extraData), options.timeout);
}
function callEvent(name, args, info) {
    const listeners = glob.__rpcEvListeners[name];
    if (listeners) {
        listeners.forEach((listener) => listener(args, info));
    }
}
/**
 * Register an event handler.
 * @param {string} name - The name of the event.
 * @param cb - The callback for the event.
 * @returns {Function} The function, which off the event.
 */
function on(name, cb) {
    if (arguments.length !== 2)
        throw 'on expects 2 arguments: "name" and "cb"';
    const listeners = glob.__rpcEvListeners[name] || new Set();
    listeners.add(cb);
    glob.__rpcEvListeners[name] = listeners;
    return () => off(name, cb);
}
/**
 * Unregister an event handler.
 * @param {string} name - The name of the event.
 * @param cb - The callback for the event.
 */
function off(name, cb) {
    if (arguments.length !== 2)
        throw 'off expects 2 arguments: "name" and "cb"';
    const listeners = glob.__rpcEvListeners[name];
    if (listeners) {
        listeners.delete(cb);
    }
}
/**
 * Triggers a local event. Only events registered in the same context will be triggered.
 *
 * Can be called from any environment.
 *
 * @param name - The name of the locally registered event.
 * @param args - Any parameters for the event.
 */
function trigger(name, args) {
    if (arguments.length < 1 || arguments.length > 2)
        throw 'trigger expects 1 or 2 arguments: "name", and optional "args"';
    callEvent(name, args, { environment });
}
/**
 * Triggers an event registered on the client.
 *
 * Can be called from any environment.
 *
 * @param player - The player to call the procedure on.
 * @param name - The name of the event.
 * @param args - Any parameters for the event.
 */
function triggerClient(player, name, args) {
    switch (environment) {
        case 'client': {
            args = name;
            name = player;
            player = null;
            if (arguments.length < 1 || arguments.length > 2 || typeof name !== 'string')
                throw 'triggerClient from the client expects 1 or 2 arguments: "name", and optional "args"';
            break;
        }
        case 'server': {
            if (arguments.length < 2 || arguments.length > 3 || typeof player !== 'object')
                throw 'triggerClient from the server expects 2 or 3 arguments: "player", "name", and optional "args"';
            break;
        }
        case 'cef': {
            args = name;
            name = player;
            player = null;
            if (arguments.length < 1 || arguments.length > 2 || typeof name !== 'string')
                throw 'triggerClient from the browser expects 1 or 2 arguments: "name", and optional "args"';
            break;
        }
    }
    _callClient(player, TRIGGER_EVENT, [name, args], { noRet: 1 });
}
/**
 * Triggers an event registered on the server.
 *
 * Can be called from any environment.
 *
 * @param name - The name of the event.
 * @param args - Any parameters for the event.
 */
function triggerServer(name, args) {
    if (arguments.length < 1 || arguments.length > 2)
        throw 'triggerServer expects 1 or 2 arguments: "name", and optional "args"';
    _callServer(TRIGGER_EVENT, [name, args], { noRet: 1 });
}
/**
 * Triggers an event registered in any browser context.
 *
 * Can be called from any environment.
 *
 * @param player - The player to call the procedure on.
 * @param name - The name of the event.
 * @param args - Any parameters for the event.
 */
function triggerBrowsers(player, name, args) {
    switch (environment) {
        case 'client':
        case 'cef':
            args = name;
            name = player;
            player = null;
            if (arguments.length < 1 || arguments.length > 2)
                throw 'triggerBrowsers from the client or browser expects 1 or 2 arguments: "name", and optional "args"';
            break;
        case 'server':
            if (arguments.length < 2 || arguments.length > 3)
                throw 'triggerBrowsers from the server expects 2 or 3 arguments: "player", "name", and optional "args"';
            break;
    }
    _callClient(player, TRIGGER_EVENT_BROWSERS, [name, args], {
        noRet: 1
    });
}
/**
 * Triggers an event registered in a specific browser instance.
 *
 * Client-side environment only.
 *
 * @param browser - The browser instance.
 * @param name - The name of the event.
 * @param args - Any parameters for the event.
 */
function triggerBrowser(browser, name, args) {
    if (environment !== 'client')
        throw 'callBrowser can only be used in the client environment';
    if (arguments.length < 2 || arguments.length > 4)
        throw 'callBrowser expects 2 or 3 arguments: "browser", "name", and optional "args"';
    _callBrowser(browser, TRIGGER_EVENT, [name, args], { noRet: 1 });
}
var index = {
    register,
    unregister,
    call,
    callServer,
    callClient,
    callBrowsers,
    callBrowser,
    on,
    off,
    trigger,
    triggerServer,
    triggerClient,
    triggerBrowsers,
    triggerBrowser
};

var rpc = /*#__PURE__*/Object.freeze({
    __proto__: null,
    register: register,
    unregister: unregister,
    call: call,
    callServer: callServer,
    callClient: callClient,
    callBrowsers: callBrowsers,
    callBrowser: callBrowser,
    on: on,
    off: off,
    trigger: trigger,
    triggerClient: triggerClient,
    triggerServer: triggerServer,
    triggerBrowsers: triggerBrowsers,
    triggerBrowser: triggerBrowser,
    'default': index
});

String.prototype.capitalize = function capitalize() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
String.prototype.uncapitalize = function uncap() {
    return this.charAt(0).toLowerCase() + this.slice(1);
};
String.prototype.replaceAll = function (str, newStr) {
    if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
        return this.replace(str, newStr);
    }
    return this.replace(new RegExp(str, 'g'), newStr);
};
Array.prototype.remove = function (value) {
    const index = this.indexOf(value);
    if (index !== -1) {
        this.splice(index, 1);
        return true;
    }
    else {
        return false;
    }
};

const createClientProxy = (rpc) => {
    const clientProxyCache = new Map();
    return new Proxy({}, {
        get(_, service) {
            if (clientProxyCache.has(service)) {
                return clientProxyCache.get(service);
            }
            else {
                const proxy = new Proxy({}, {
                    get(_, event) {
                        const call = (noRet, ...args) => {
                            const eventName = `${service.capitalize()}${event.capitalize()}`;
                            return rpc.callClient(eventName, args, noRet ? { noRet: true } : { timeout: 60 * 1000, noRet: false });
                        };
                        const f = call.bind(null, false);
                        f.noRet = (...args) => {
                            call(true, ...args);
                        };
                        return f;
                    }
                });
                clientProxyCache.set(service, proxy);
                return proxy;
            }
        }
    });
};

/* eslint-disable @typescript-eslint/consistent-type-assertions */
const install = (rpc, env) => {
    class Service {
        constructor() {
            Object.defineProperty(this, "services", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: Service.namespacesUncap
            });
        }
        static hookThisContextFromSingle(Target) {
            let name = Target.constructor.name;
            if (name === 'Function') {
                name = Reflect.get(Target, 'name');
            }
            return this.namespaces[name];
        }
        static combineServices(services) {
            let arr = Object.keys(Service.namespaces);
            for (const key in services) {
                // arr.splice(arr.indexOf(key), 1);
                arr.remove(key);
            }
            if (arr.length !== 0) {
                throw new Error(`Runtime error: ${arr} is missing to combineServices`);
            }
            return services;
        }
        static namespace(Target) {
            if (Service.namespaces[Target.name]) {
                throw new Error(`Error: namespace '${Target.name}' is already defined`);
            }
            const single = new Target();
            Service.namespaces[Target.name] = single;
            Service.namespacesUncap[Target.name.uncapitalize()] = single;
            let eventMethods = Object.getOwnPropertyNames(Target.prototype).filter((name) => Service.EV_PREFIX.test(name));
            for (const iterator of eventMethods) {
                const name = `${Target.name}${iterator.replace(Service.EV_PREFIX, '')}`;
                if (!Service.procedures.has(name)) {
                    throw new Error(`Error: ${iterator} in ${Target.name} has no decorator @access`);
                }
                else {
                    const f = Service.procedures.get(name);
                    if (f) {
                        Service.procedures.set(name, f.bind(single));
                    }
                    else {
                        throw new Error(`Runtime error: ${name} is not registered`);
                    }
                }
            }
        }
        static access(Target, propertyKey) {
            let prefix = Target.constructor.name;
            if (prefix === 'Function') {
                prefix = Reflect.get(Target, 'name');
            }
            if (!Service.EV_PREFIX.test(propertyKey)) {
                throw new Error(`Error: ${propertyKey} in ${prefix} no 'event' prefix`);
            }
            let name = `${prefix}${propertyKey.replace(Service.EV_PREFIX, '')}`;
            if (Service.procedures.has(name)) {
                throw new Error(`Error: event ${name} is already registered`);
            }
            else {
                let f = Reflect.get(Target, propertyKey);
                if (f instanceof Function) {
                    Service.procedures.set(name, f);
                    console.log(name, 'system ready');
                    if (env === 'client') {
                        // @ts-ignore
                        rpc.register(name, (argumentList) => Service.procedures.get(name)(...argumentList));
                    }
                    else {
                        // @ts-ignore
                        rpc.register(name, (argumentList, { player }) => Service.procedures.get(name)(player, ...argumentList));
                    }
                }
                else {
                    throw new Error(`Runtime error: ${name} is not a function`);
                }
            }
        }
    }
    Object.defineProperty(Service, "namespaces", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: {}
    });
    Object.defineProperty(Service, "namespacesUncap", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: {}
    });
    Object.defineProperty(Service, "EV_PREFIX", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: /^rpc/
    });
    Object.defineProperty(Service, "procedures", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: new Map()
    });
    Object.defineProperty(Service, "Invoker", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: class Invoker {
            constructor() {
                Object.defineProperty(this, "call", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: ((name, ...args) => {
                        const proc = Service.procedures.get(name);
                        if (proc) {
                            return proc(...args);
                        }
                        else {
                            throw new Error(`Runtime error: remote procedure ${name} is not defined`);
                        }
                    })
                });
            }
        }
    });
    return Service;
};

const Service = install(rpc, 'server');
createClientProxy(rpc);

// const AUTOSALON_LIST = [
// 	{
// 		name: 'San Andreas',
// 		pos: new mp.Vector3(-20.840431213378906, -699.7188720703125, 250.41355895996094),
// 		vehicleHeading: 195
// 	}
// ];
let Ems = class Ems extends Service {
    constructor() {
        super();
        Object.defineProperty(this, "autosalonShapes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.autosalonShapes = new Map();
        mp.events.add({
            'server::new:death': (player) => {
                mp.events.call('chat::fraction:ems', `Человек умер напишите /accept ${player.id} что бы принять вызов`);
            },
            'playerStartedResuscitation': (player, nearPlayer) => {
                this.playerStartedResuscitation(player, nearPlayer);
            },
            'givePlayerPill': (nearPlayer) => {
                this.givePillToPlayer(nearPlayer);
            }
        });
    }
    playerStartedResuscitation(player, nearPlayer) {
        console.log(player, nearPlayer);
        if (nearPlayer === undefined || nearPlayer._death === false)
            return;
        player.playAnimation('missheistfbi3b_ig8_2', 'cpr_loop_paramedic', 1, 1);
        setTimeout(() => {
            player.stopAnimation();
            nearPlayer.health = 100;
        }, 7000);
    }
    givePillToPlayer(nearPlayer) {
        if (nearPlayer === undefined || nearPlayer._death === true)
            return;
        nearPlayer.health = 100;
    }
};
Ems = __decorate([
    Service.namespace,
    __metadata("design:paramtypes", [])
], Ems);
var Ems$1 = Ems;

const CONFIG_DATABASE_TYPE = 'mysql';
const CONFIG_DATABASE_HOST = 'localhost';
const CONFIG_DATABASE_PORT = 3306;
const CONFIG_DATABASE_USER = 'root';
const CONFIG_DATABASE_DB = 'newyork';
const CONFIG_DATABASE_PASS = '';

let Characters = class Characters {
    constructor() {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "userid", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "gender", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "age", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "skin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "clothes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "birthday", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "level", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "exp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cash", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "bankcash", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "createchar", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lastDate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "quests", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "questsOld", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "inventory", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "backpack", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "backpackStatus", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "donateRoullete", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fractionId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fractionRank", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
};
__decorate([
    typeorm.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Characters.prototype, "id", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], Characters.prototype, "userid", void 0);
__decorate([
    typeorm.Column('simple-json'),
    __metadata("design:type", Array)
], Characters.prototype, "name", void 0);
__decorate([
    typeorm.Column({ default: 0 }),
    __metadata("design:type", Number)
], Characters.prototype, "gender", void 0);
__decorate([
    typeorm.Column({ default: 0 }),
    __metadata("design:type", Number)
], Characters.prototype, "age", void 0);
__decorate([
    typeorm.Column('simple-json'),
    __metadata("design:type", Object)
], Characters.prototype, "skin", void 0);
__decorate([
    typeorm.Column('simple-json', { default: () => '{}' }),
    __metadata("design:type", Object)
], Characters.prototype, "clothes", void 0);
__decorate([
    typeorm.Column({ type: 'timestamp', default: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", String)
], Characters.prototype, "birthday", void 0);
__decorate([
    typeorm.Column({ default: 1 }),
    __metadata("design:type", Number)
], Characters.prototype, "level", void 0);
__decorate([
    typeorm.Column({ default: 0 }),
    __metadata("design:type", Number)
], Characters.prototype, "exp", void 0);
__decorate([
    typeorm.Column({ default: 200 }),
    __metadata("design:type", Number)
], Characters.prototype, "cash", void 0);
__decorate([
    typeorm.Column({ default: 0 }),
    __metadata("design:type", Number)
], Characters.prototype, "bankcash", void 0);
__decorate([
    typeorm.Column({ default: 1 }),
    __metadata("design:type", Number)
], Characters.prototype, "createchar", void 0);
__decorate([
    typeorm.Column({ type: 'timestamp', default: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", String)
], Characters.prototype, "lastDate", void 0);
__decorate([
    typeorm.Column('simple-json', { default: () => '{}' }),
    __metadata("design:type", Object)
], Characters.prototype, "quests", void 0);
__decorate([
    typeorm.Column('simple-json', { default: () => '[]' }),
    __metadata("design:type", Array)
], Characters.prototype, "questsOld", void 0);
__decorate([
    typeorm.Column('simple-json', { default: () => '[]', array: true }),
    __metadata("design:type", Array)
], Characters.prototype, "inventory", void 0);
__decorate([
    typeorm.Column('simple-json', { default: () => '[]' }),
    __metadata("design:type", Array)
], Characters.prototype, "backpack", void 0);
__decorate([
    typeorm.Column({ default: 0 }),
    __metadata("design:type", Number)
], Characters.prototype, "backpackStatus", void 0);
__decorate([
    typeorm.Column('simple-json', { default: '{ "status": false, "data": [], "time": 0 }' }),
    __metadata("design:type", Object)
], Characters.prototype, "donateRoullete", void 0);
__decorate([
    typeorm.Column({ default: () => 0 }),
    __metadata("design:type", Number)
], Characters.prototype, "fractionId", void 0);
__decorate([
    typeorm.Column({ default: () => 0 }),
    __metadata("design:type", Number)
], Characters.prototype, "fractionRank", void 0);
Characters = __decorate([
    typeorm.Entity()
], Characters);
console.log(123);

let Fraction = class Fraction {
    constructor() {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // @Column()
        // type!: number;
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "position", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "interior", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "leader", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "maxRang", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "balance", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "stock", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "warehouse", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
};
__decorate([
    typeorm.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Fraction.prototype, "id", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", String)
], Fraction.prototype, "name", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", String)
], Fraction.prototype, "description", void 0);
__decorate([
    typeorm.Column('simple-json'),
    __metadata("design:type", Object)
], Fraction.prototype, "position", void 0);
__decorate([
    typeorm.Column('simple-json'),
    __metadata("design:type", Object)
], Fraction.prototype, "interior", void 0);
__decorate([
    typeorm.Column('simple-json'),
    __metadata("design:type", Object)
], Fraction.prototype, "leader", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], Fraction.prototype, "maxRang", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], Fraction.prototype, "balance", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], Fraction.prototype, "stock", void 0);
__decorate([
    typeorm.Column('simple-json', {
        array: true
    }),
    __metadata("design:type", Array)
], Fraction.prototype, "warehouse", void 0);
Fraction = __decorate([
    typeorm.Entity()
], Fraction);

let User = class User {
    constructor() {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "username", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "password", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "email", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "promo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "regIP", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "regDate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "buy_slots_chars", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lastDate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lastIP", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "settings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "admin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "adminPassword", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "adminData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "adminBan", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "online", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "onlineChar", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "keysSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "donate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
};
__decorate([
    typeorm.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    typeorm.Column('varchar', { length: 200 }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm.Column('varchar', { length: 70 }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", String)
], User.prototype, "promo", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", String)
], User.prototype, "regIP", void 0);
__decorate([
    typeorm.Column({ type: 'timestamp', default: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", String)
], User.prototype, "regDate", void 0);
__decorate([
    typeorm.Column('simple-json', { default: '[0]', array: true }),
    __metadata("design:type", Array)
], User.prototype, "buy_slots_chars", void 0);
__decorate([
    typeorm.Column({ type: 'timestamp', default: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", String)
], User.prototype, "lastDate", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", String)
], User.prototype, "lastIP", void 0);
__decorate([
    typeorm.Column('simple-json', { default: () => '{}' }),
    __metadata("design:type", Object)
], User.prototype, "settings", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], User.prototype, "admin", void 0);
__decorate([
    typeorm.Column('varchar', { length: 200 }),
    __metadata("design:type", String)
], User.prototype, "adminPassword", void 0);
__decorate([
    typeorm.Column('simple-json', { default: () => '{}' }),
    __metadata("design:type", Object)
], User.prototype, "adminData", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], User.prototype, "adminBan", void 0);
__decorate([
    typeorm.Column({ default: () => -1 }),
    __metadata("design:type", Number)
], User.prototype, "online", void 0);
__decorate([
    typeorm.Column({ default: () => -1 }),
    __metadata("design:type", Number)
], User.prototype, "onlineChar", void 0);
__decorate([
    typeorm.Column('simple-json', { default: () => '{}' }),
    __metadata("design:type", Object)
], User.prototype, "keysSettings", void 0);
__decorate([
    typeorm.Column({ default: () => 0 }),
    __metadata("design:type", Number)
], User.prototype, "donate", void 0);
User = __decorate([
    typeorm.Entity()
], User);

// import { Vehicles } from './schemas/Vehicles';
const AppDataSource = new typeorm.DataSource({
    type: CONFIG_DATABASE_TYPE,
    host: CONFIG_DATABASE_HOST,
    port: CONFIG_DATABASE_PORT,
    username: CONFIG_DATABASE_USER,
    password: CONFIG_DATABASE_PASS,
    database: CONFIG_DATABASE_DB,
    synchronize: false,
    logging: false,
    entities: [Fraction, User, Characters],
    // Business, Character, Houses, Vehicles, Users
    migrations: [],
    subscribers: []
});

const SHARED_FRACTIONS_DATA = [
    [
        {
            name: 'Стажер',
            clothes: [0, 0, 0, 0, 122, 0, 54, 0, 0, 0, 0, 384],
            weapons: ['weapon_specialcarbine_mk2', 'weapon_stungun']
        },
        {
            name: 'Уверенный',
            clothes: [0, 0, 0, 0, 122, 0, 54, 0, 0, 0, 0, 384],
            weapons: ['weapon_specialcarbine_mk2', 'weapon_stungun', 'weapon_raypistol']
        },
        {
            name: 'Обычный',
            clothes: [0, 0, 0, 0, 122, 0, 54, 0, 0, 0, 0, 384],
            weapons: ['weapon_specialcarbine_mk2']
        }
    ],
    [
        {
            name: 'Офицер',
            clothes: [0, 0, 0, 0, 122, 0, 54, 0, 0, 0, 0, 384]
        },
        {
            name: 'Уверенный',
            clothes: [0, 0, 0, 0, 122, 0, 54, 0, 0, 0, 0, 384]
        },
        {
            name: 'Обычный',
            clothes: [0, 0, 0, 0, 122, 0, 54, 0, 0, 0, 0, 384]
        }
    ]
];

const FRACTION_LIST = [
    {
        name: 'Ems',
        pos: new mp.Vector3(-20.840431213378906, -699.7188720703125, 249.41355895996094),
        id: 1,
        sprite: 489,
        color: 1,
        changeClothes: new mp.Vector3(-10.840431213378906, -699.7188720703125, 249.41355895996094)
    },
    {
        name: 'Lspd',
        pos: new mp.Vector3(451.61663818359375, -980.2980346679688, 29.689603805541992),
        id: 2,
        sprite: 60,
        color: 38,
        changeClothes: new mp.Vector3(456.4762268066406, -988.3687133789062, 30.689586639404297)
    }
];
const fractionShapes = new Map();
let Faction = class Faction extends Service {
    constructor() {
        super();
        Object.defineProperty(this, "fractionShapes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.fractionShapes = new Map();
        for (let fraction of FRACTION_LIST) {
            const fractionWarehouseShape = mp.colshapes.newSphere(fraction.pos.x, fraction.pos.y, fraction.pos.z, 2, 0);
            const fractionClothesShape = mp.colshapes.newSphere(fraction.changeClothes.x, fraction.changeClothes.y, fraction.changeClothes.z, 2, 0);
            mp.blips.new(fraction.sprite, fraction.pos, {
                name: fraction.name,
                shortRange: true,
                color: fraction.color
            });
            mp.markers.new(1, fraction.pos, 1);
            mp.markers.new(1, fraction.changeClothes, 1);
            fractionShapes.set(fractionWarehouseShape, {
                ...fraction,
                isWarehouseShape: true
            });
            fractionShapes.set(fractionClothesShape, {
                ...fraction,
                isClothesShape: true
            });
        }
        mp.events.add('playerEnterColshape', (player, colshape) => {
            this.enterInWarehouse(player, colshape);
            this.enterInChangeClothes(player, colshape);
        });
    }
    async enterInChangeClothes(player, colshape) {
        const fraction = fractionShapes.get(colshape);
        if (!fraction || fraction.isClothesShape !== true)
            return;
        console.log(player.character);
        if (fraction && player.character.fractionId !== 0 && player.character.fractionRank !== 0) {
            let clothes = SHARED_FRACTIONS_DATA[--player.character.fractionId][--player.character.fractionRank].clothes;
            clothes.map((value, index) => {
                player.setClothes(index, value, 0, 0);
            });
        }
    }
    async enterInWarehouse(player, colshape) {
        const fraction = fractionShapes.get(colshape);
        if (!fraction || fraction.isWarehouseShape !== true)
            return;
        const users = AppDataSource.getRepository('Fraction');
        const user = await users.findOneBy({
            id: fraction.id
        });
        if (user === null)
            return;
        if (fraction) {
            // player.call('newserver::user:cursor', true);
            player.dispatch({ type: 'WAREHOUSE_ADD', warehouse: user.warehouse, fractionId: user.id });
            player.setView('Fraction');
        }
    }
    // public async enterInReanimationZone(player: PlayerServer, colshape: RageEnums.ColshapeType): Promise<void> {
    // 	//@ts-ignore
    // 	const deathPlayer = colshape.getVariable('deathPlayerID');
    // 	if (!deathPlayer) return;
    // 	if (deathPlayer) {
    // 		player.call('server::user:toggleActionText', [true, 'E', 'Восп']);
    // 	}
    // }
    async rpcGivePlayerItem(player, id, _fractionId, selected, selectedCell) {
        const users = AppDataSource.getRepository('Fraction');
        const user = await users.findOneBy({
            id: 1
        });
        if (user === null)
            return;
        let newData = user.warehouse;
        newData[selected][selectedCell] = null;
        user.warehouse = newData;
        await users.save(user);
        player.dispatch({ type: 'WAREHOUSE_ADD', warehouse: newData, fractionId: user.id });
        mp.events.call('serverNew::give:item', player, id, 1, {}, false, 0, false);
    }
};
__decorate([
    Service.access,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], Faction.prototype, "rpcGivePlayerItem", null);
Faction = __decorate([
    Service.namespace,
    __metadata("design:paramtypes", [])
], Faction);
var Faction$1 = Faction;

class Player {
    /**
     * Обертка entityCreated, entityDestroyed.
     * Первый callback вызывается, когда игрок создается, коллбек, который был возвращен, когда игрок уничтожился
     */
    static created(callback) {
        let destroyedCallback = undefined;
        mp.events.add('entityCreated', (player) => {
            if (Player.isPlayer(player)) {
                destroyedCallback = callback(player);
                player.pushAlert;
            }
        });
        mp.events.add('entityDestroyed', (player) => {
            if (Player.isPlayer(player)) {
                destroyedCallback && destroyedCallback(player);
            }
        });
    }
}
/**
 * Проверяет EntityMp === PlayerMp
 */
Object.defineProperty(Player, "isPlayer", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (entity) => entity.type === "player" /* RageEnums.EntityType.PLAYER */
});
/**
 * Получает список игроков (авторизованных, играющих за персонажей)
 */
Object.defineProperty(Player, "getPlayerList", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: ({ hasAuth, hasCharacter }) => {
        if (hasAuth && !hasCharacter) {
            return mp.players.toArrayFast().filter((player) => player.user);
        }
        if (hasCharacter) {
            return mp.players.toArrayFast().filter((player) => player.user && player.character);
        }
        return mp.players.toArrayFast();
    }
});
(() => {
    mp.events.add('entityCreated', (player) => {
        if (!Player.isPlayer(player))
            return;
        player.client = createClientProxy({
            callClient: (name, args, opt) => callClient(player, name, args, opt)
        });
        player.dispatch = (action) => {
            triggerBrowsers(player, 'internal.dispatch', action);
        };
        player.setView = (view) => {
            triggerBrowsers(player, 'internal.setView', view);
        };
        player.pushHud = (hud) => {
            triggerBrowsers(player, 'internal.pushHud', hud);
        };
        player.removeHud = (hud) => {
            triggerBrowsers(player, 'internal.removeHud', hud);
        };
        player.setAlert = (_props) => {
            throw new Error('Not implemented');
        };
        player.pushAlert = (_props) => {
            throw new Error('Not implemented');
        };
        player.setConfirm = (_props) => {
            throw new Error('Not implemented');
        };
        player.pushConfirm = (_props) => {
            throw new Error('Not implemented');
        };
        player.setPhoneAlert = (_props) => {
            throw new Error('Not implemented');
        };
        player.setPhoneConfirm = (_props) => {
            throw new Error('Not implemented');
        };
        player.pushPhoneAlert = (_props) => {
            throw new Error('Not implemented');
        };
        player.pushPhoneConfirm = (_props) => {
            throw new Error('Not implemented');
        };
        mp.events.add('playerHasLogged', async (userId) => {
            const Characters = AppDataSource.getRepository('Characters');
            const Character = await Characters.findOneBy({
                userid: userId
            });
            if (Character === null)
                return;
            //@ts-ignore
            player.character = Character;
        });
    });
})();

let jails = [
    new mp.Vector3(459.25750732421875, -1001.5284423828125, 24.914859771728516),
    new mp.Vector3(459.3766174316406, -997.9525756835938, 24.914859771728516),
    new mp.Vector3(460.325927734375, -994.3788452148438, 24.914859771728516)
];
let JailExit = {
    pos: new mp.Vector3(443.1412658691406, -982.986083984375, 29.689594268798828),
    heading: 80
};
let Lspd = class Lspd extends Service {
    constructor() {
        super();
        Object.defineProperty(this, "jail", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (_player, nearPlayer, time) => {
                let jail = this.getRandomJail();
                if (nearPlayer[1] === undefined)
                    return;
                if (!nearPlayer[1].isCuff)
                    return;
                if (nearPlayer[1].wantedStars == 0)
                    return;
                if (jail.subtract(nearPlayer[1].position).length() > 10)
                    return;
                nearPlayer[1].position = jail;
                setTimeout(() => {
                    nearPlayer[1].position = JailExit.pos;
                    nearPlayer[1].isCuff = false;
                }, time);
            }
        });
        Object.defineProperty(this, "giveStars", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (_player, targetPlayer, stars) => {
                if (targetPlayer === undefined)
                    return;
                targetPlayer.wantedStars = stars;
            }
        });
        Player.created((player) => {
            player.isCuff = false;
        });
        mp.events.add({
            'server::new:death': (player) => {
                mp.events.call('chat::fraction:lspd', `Поступил вызов что бы принять напишите /accept ${player.id} .`);
            },
            'server::lspd:keyPressed': () => {
                console.log('Привет');
            },
            'server::lspd:jail': (player, nearPlayer, time) => {
                this.jail(player, nearPlayer, time);
            },
            'server::lspd:giveStars': (player, targetPlayer, stars) => {
                this.giveStars(player, targetPlayer, stars);
            }
        });
    }
    // user.setClothes(player, clothes, false)
    rpcCuffPlayer(player) {
        player.client.lspd.cuffPlayer();
        player.isCuff = !player.isCuff;
        if (player.isCuff) {
            player.playAnimation('mp_arresting', 'idle', 1, 53); // или вместо 53 49
        }
        else {
            player.stopAnimation();
        }
    }
    rpcDragCuffedPlayer(player) {
        player.client.lspd.dragPlayer();
    }
    getRandomJail() {
        //@ts-ignore
        return jails[mp.getRandomInRange(0, jails.length - 1)];
    }
};
__decorate([
    Service.access,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Lspd.prototype, "rpcCuffPlayer", null);
__decorate([
    Service.access,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Lspd.prototype, "rpcDragCuffedPlayer", null);
Lspd = __decorate([
    Service.namespace,
    __metadata("design:paramtypes", [])
], Lspd);
var Lspd$1 = Lspd;

//@ts-ignore
mp.getRandomInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
const services = {
    Faction: Faction$1,
    Ems: Ems$1,
    Lspd: Lspd$1
};
Service.combineServices(services);

AppDataSource.initialize()
    .then(async () => {
})
    .catch((error) => console.log(error));
