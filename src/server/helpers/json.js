let singleton = Symbol()
let singletonEnforcer = Symbol()

class Json {

    constructor(enforcer) {
        if(enforcer != singletonEnforcer) throw "Cannot construct singleton";
    }

    static get instance() {
        if(!this[singleton]) {
            this[singleton] = new Json(singletonEnforcer);
        }
        return this[singleton];
    }

    _helper(object) {
        return new Handlebars.SafeString(JSON.stringify(object));
    }

    get helper() {
        return this._helper
    }
}

export default Json