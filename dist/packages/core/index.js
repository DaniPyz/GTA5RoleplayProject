'use strict';

var rpc = require('rage-rpc');
var typeorm = require('typeorm');
require('reflect-metadata');

function _interopNamespace(e) {
	if (e && e.__esModule) return e;
	var n = Object.create(null);
	if (e) {
		Object.keys(e).forEach(function (k) {
			if (k !== 'default') {
				var d = Object.getOwnPropertyDescriptor(e, k);
				Object.defineProperty(n, k, d.get ? d : {
					enumerable: true,
					get: function () { return e[k]; }
				});
			}
		});
	}
	n["default"] = e;
	return Object.freeze(n);
}

var rpc__namespace = /*#__PURE__*/_interopNamespace(rpc);

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

const Service = install(rpc__namespace, 'server');

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

let Faction = class Faction extends Service {
    awdawdawd() { }
    awadawd() { }
    static awdawd() { }
    constructor() {
        super();
        this.services;
    }
    async rpcGetUserdAWD() {
        return;
    }
    async rpcGetUser(player) {
        return player;
    }
};
__decorate([
    Service.access,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Faction.prototype, "rpcGetUserdAWD", null);
__decorate([
    Service.access,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerMp]),
    __metadata("design:returntype", Promise)
], Faction.prototype, "rpcGetUser", null);
Faction = __decorate([
    Service.namespace,
    __metadata("design:paramtypes", [])
], Faction);
var Faction$1 = Faction;

const services = {
    Faction: Faction$1
};
Service.combineServices(services);

let Business = class Business {
    constructor() {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "owner", {
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
        Object.defineProperty(this, "dimension", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "locked", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "price", {
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
        Object.defineProperty(this, "accountBalance", {
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
        Object.defineProperty(this, "stats", {
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
    }
};
__decorate([
    typeorm.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Business.prototype, "id", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], Business.prototype, "type", void 0);
__decorate([
    typeorm.Column('simple-json'),
    __metadata("design:type", Object)
], Business.prototype, "owner", void 0);
__decorate([
    typeorm.Column('simple-json'),
    __metadata("design:type", Object)
], Business.prototype, "position", void 0);
__decorate([
    typeorm.Column('simple-json'),
    __metadata("design:type", Object)
], Business.prototype, "interior", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], Business.prototype, "dimension", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], Business.prototype, "locked", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], Business.prototype, "price", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], Business.prototype, "balance", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], Business.prototype, "accountBalance", void 0);
__decorate([
    typeorm.Column('jsonb', { nullable: true }),
    __metadata("design:type", Array)
], Business.prototype, "warehouse", void 0);
__decorate([
    typeorm.Column('simple-json'),
    __metadata("design:type", Object)
], Business.prototype, "stats", void 0);
__decorate([
    typeorm.Column('simple-json'),
    __metadata("design:type", Object)
], Business.prototype, "settings", void 0);
Business = __decorate([
    typeorm.Entity()
], Business);

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
        Object.defineProperty(this, "fraction", {
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
    typeorm.Column(),
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
    typeorm.Column('simple-json', { default: () => '[]' }),
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
    typeorm.Column({ default: '{ "status": false, "data": [], "time": 0 }' }),
    __metadata("design:type", Object)
], Characters.prototype, "donateRoullete", void 0);
__decorate([
    typeorm.Column({ default: () => '[]' }),
    __metadata("design:type", Array)
], Characters.prototype, "fraction", void 0);
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
        Object.defineProperty(this, "type", {
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
        // @Column()
        // users: {
        //     id: number,
        //     name: string,
        //     rank: number,
        //     status: number
        // };
    }
};
__decorate([
    typeorm.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Fraction.prototype, "id", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], Fraction.prototype, "type", void 0);
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
Fraction = __decorate([
    typeorm.Entity()
], Fraction);

let Houses = class Houses {
    constructor() {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "class", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "owner", {
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
        Object.defineProperty(this, "dimension", {
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
        Object.defineProperty(this, "price", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "garage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "locked", {
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
], Houses.prototype, "id", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], Houses.prototype, "type", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], Houses.prototype, "class", void 0);
__decorate([
    typeorm.Column('simple-json'),
    __metadata("design:type", Object)
], Houses.prototype, "owner", void 0);
__decorate([
    typeorm.Column('simple-json'),
    __metadata("design:type", Object)
], Houses.prototype, "position", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], Houses.prototype, "dimension", void 0);
__decorate([
    typeorm.Column('simple-json'),
    __metadata("design:type", Object)
], Houses.prototype, "interior", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], Houses.prototype, "price", void 0);
__decorate([
    typeorm.Column('simple-json'),
    __metadata("design:type", Object)
], Houses.prototype, "garage", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], Houses.prototype, "locked", void 0);
Houses = __decorate([
    typeorm.Entity()
], Houses);

let Users = class Users {
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
], Users.prototype, "id", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", String)
], Users.prototype, "username", void 0);
__decorate([
    typeorm.Column('varchar', { length: 200 }),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    typeorm.Column('varchar', { length: 70 }),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", String)
], Users.prototype, "promo", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", String)
], Users.prototype, "regIP", void 0);
__decorate([
    typeorm.Column({ type: 'timestamp', default: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", String)
], Users.prototype, "regDate", void 0);
__decorate([
    typeorm.Column({ default: '[0]' }),
    __metadata("design:type", Array)
], Users.prototype, "buy_slots_chars", void 0);
__decorate([
    typeorm.Column({ type: 'timestamp', default: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", String)
], Users.prototype, "lastDate", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", String)
], Users.prototype, "lastIP", void 0);
__decorate([
    typeorm.Column('simple-json', { default: () => '{}' }),
    __metadata("design:type", Object)
], Users.prototype, "settings", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], Users.prototype, "admin", void 0);
__decorate([
    typeorm.Column('varchar', { length: 200 }),
    __metadata("design:type", String)
], Users.prototype, "adminPassword", void 0);
__decorate([
    typeorm.Column('simple-json', { default: () => '{}' }),
    __metadata("design:type", Object)
], Users.prototype, "adminData", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], Users.prototype, "adminBan", void 0);
__decorate([
    typeorm.Column({ default: () => -1 }),
    __metadata("design:type", Number)
], Users.prototype, "online", void 0);
__decorate([
    typeorm.Column({ default: () => -1 }),
    __metadata("design:type", Number)
], Users.prototype, "onlineChar", void 0);
__decorate([
    typeorm.Column({ default: () => '{}' }),
    __metadata("design:type", Object)
], Users.prototype, "keysSettings", void 0);
__decorate([
    typeorm.Column({ default: () => 0 }),
    __metadata("design:type", Number)
], Users.prototype, "donate", void 0);
Users = __decorate([
    typeorm.Entity()
], Users);

let Vehicles = class Vehicles {
    constructor() {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "model", {
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
        Object.defineProperty(this, "heading", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dimension", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "owner", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "locked", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "number", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "color", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mileage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fuel", {
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
], Vehicles.prototype, "id", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Object)
], Vehicles.prototype, "model", void 0);
__decorate([
    typeorm.Column('simple-json'),
    __metadata("design:type", Object)
], Vehicles.prototype, "position", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], Vehicles.prototype, "heading", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], Vehicles.prototype, "dimension", void 0);
__decorate([
    typeorm.Column('simple-json'),
    __metadata("design:type", String)
], Vehicles.prototype, "owner", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], Vehicles.prototype, "locked", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Object)
], Vehicles.prototype, "number", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Object)
], Vehicles.prototype, "color", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], Vehicles.prototype, "mileage", void 0);
__decorate([
    typeorm.Column(),
    __metadata("design:type", Number)
], Vehicles.prototype, "fuel", void 0);
Vehicles = __decorate([
    typeorm.Entity()
], Vehicles);
