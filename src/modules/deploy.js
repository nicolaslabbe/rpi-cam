let singleton = Symbol()
let singletonEnforcer = Symbol()
import process from 'child_process'

import git from 'git-exec'
import {exec} from 'child_process'
import {Promise} from 'es6-promise'

class Deploy {

    constructor(enforcer) {
        if(enforcer != singletonEnforcer) throw "Cannot construct singleton";
    }

    static get instance() {
        if(!this[singleton]) {
            this[singleton] = new Deploy(singletonEnforcer);
        }
        return this[singleton];
    }

    run() {
        var p = new Promise((resolve, reject) => {
            var repo = new git('./');

            repo.exec('pull', null, (err, stdout) => {
                if (err) throw new Error(err)

                var command = 'npm i && npm run build'
                console.log('command', command)
                resolve()
                var cp = exec(command, (err, out, code) => {
                    if (err instanceof Error) {
                        console.log('err', err)
                    }
                })
            })
        })

        return p
    }
}

export default Deploy