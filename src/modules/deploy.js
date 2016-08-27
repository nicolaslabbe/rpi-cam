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

            repo.exec('pull', null, function(err, stdout) {
                if (err) throw new Error(err)
                var exec = require('child_process').exec

                var command = 'npm build'
                var cp = exec(command, function (err, out, code) {
                    if (err instanceof Error) throw err
                    process.exit(code)
                })
                cp.stderr.pipe(process.stderr)
                cp.stdout.pipe(process.stdout)
                // process.fork(`node ./tasks/start.js`, []);
                resolve()
            })
        })

        return p
    }
}

export default Deploy