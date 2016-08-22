import Handlebars from 'handlebars'

let singleton = Symbol()
let singletonEnforcer = Symbol()

class helperJson {

    constructor(enforcer) {
        if(enforcer != singletonEnforcer) throw "Cannot construct singleton";
    }

    static get instance() {
        if(!this[singleton]) {
            this[singleton] = new helperJson(singletonEnforcer);
        }
        return this[singleton];
    }

    _helper(object) {
	    return object.fn(this).replace(/\[\[/g, '{{').replace(/\]\]/g, '}}');
	}

    get helper() {
        return this._helper
    }
}

export default helperJson