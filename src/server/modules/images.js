let singleton = Symbol()
let singletonEnforcer = Symbol()

import walk from "walk"
import {Promise} from 'es6-promise'

class Images {

    constructor(enforcer) {
        if(enforcer != singletonEnforcer) throw "Cannot construct singleton";
        this.init()
    }

    static get instance() {
        if(!this[singleton]) {
            this[singleton] = new Images(singletonEnforcer);
        }
        return this[singleton];
    }

    init() {
        this._extensions = [/\.jpg/, /\.png/]
    }

    read() {
        var p = new Promise((resolve, reject) => {
            var walker  = walk.walk(__dirname + '/../screenshot', { followLinks: false });
            var files = []

            walker.on('file', (root, stat, next) => {
                // Add this file to the list of files
                var add = false
                Array.prototype.forEach.call(this._extensions, (extension) => {
                    if (extension.test(stat.name)) {
                        add = true
                    }
                })
                if (add) {
                    files.push({
                        path: '/screenshot/' + stat.name
                    }); 
                }
                next();
            });

            walker.on('end', function() {
                resolve(files);
            });
        })

        return p
    }
}

export default Images