let singleton = Symbol()
let singletonEnforcer = Symbol()

import walk from "walk"
import {Promise} from 'es6-promise'

class Images {

    constructor(enforcer) {
        if(enforcer != singletonEnforcer) throw "Cannot construct singleton";
    }

    static get instance() {
        if(!this[singleton]) {
            this[singleton] = new Images(singletonEnforcer);
        }
        return this[singleton];
    }

    read() {
        var p = new Promise((resolve, reject) => {
            var walker  = walk.walk(__dirname + '/../screenshot', { followLinks: false });
            var files = []

            walker.on('file', function(root, stat, next) {
                // Add this file to the list of files
                files.push({
                    path: '/screenshot/' + stat.name
                });
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