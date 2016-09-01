let singleton = Symbol()
let singletonEnforcer = Symbol()

class Config {

    constructor(enforcer) {
        if(enforcer != singletonEnforcer) throw "Cannot construct singleton";
        this._init()
    }

    _init() {
        this._env = process.env.NODE_ENV || 'prod'
        if (this._env !== 'prod') {
            this._config = require('../config/config.json')
        }else {
            this._config = require('../config/prod.json')
        }
    }

    static get instance() {
        if(!this[singleton]) {
            this[singleton] = new Config(singletonEnforcer);
        }
        return this[singleton];
    }

    get env() {
        return this._env
    }

    get config() {
        return this._config
    }
}

export default Config