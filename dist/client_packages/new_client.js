'use strict';

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
                        mp.console.logInfo(name);
                        // console.log(name);
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

const createServerProxy = (rpc) => {
    const serverProxyCache = new Map();
    return new Proxy({}, {
        get(_, service) {
            if (serverProxyCache.has(service)) {
                return serverProxyCache.get(service);
            }
            else {
                const proxy = new Proxy({}, {
                    get(_, event) {
                        const call = (noRet, ...args) => {
                            const eventName = `${service.capitalize()}${event.capitalize()}`;
                            return rpc.callServer(eventName, args, noRet ? { noRet: true } : { timeout: 60 * 1000, noRet: false });
                        };
                        const f = call.bind(null, false);
                        f.noRet = (...args) => {
                            call(true, ...args);
                        };
                        return f;
                    }
                });
                serverProxyCache.set(service, proxy);
                return proxy;
            }
        }
    });
};

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

const Service = install(rpc, 'client');
const server = createServerProxy(rpc);

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

class Temp {
    rpcAwdadw() {
        server.phone.requestCall('09009');
        return 123;
    }
}
__decorate([
    Service.access,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Temp.prototype, "rpcAwdadw", null);

const services = {
    Temp
};
Service.combineServices(services);

mp.browsers.new('http://localhost:3000');
