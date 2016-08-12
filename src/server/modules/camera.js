import extend from 'extend'
import RaspiCam from 'raspicam'
import Config from './config'
import {Promise} from 'es6-promise'

export default class Camera {
    constructor(options = {}) {
        var p = new Promise((resolve, reject) => {
            var saveTo = "./src/server/screenshot/"
            var webPath = "/screenshot/"
            var name = "cam.jpg"

            var defaultOptions = {
                mode: "photo",
                output: saveTo + name,
                encoding: "jpg",
                timeout: 0, // take the picture immediately
                w: 320,
                h: 240,
                q: 60
            }

            defaultOptions = extend(defaultOptions, options)
            console.log('* * * * * * * * * * * * * * * * * * * * * * * * * * * * *')
            console.log('defaultOptions', defaultOptions)

            if (Config.instance.env === 'dev') {
                resolve(webPath + name);
            }else {
                var piCam = new RaspiCam(defaultOptions);

                piCam.on("started", function( err, timestamp ) {
                    console.log("photo started at " + timestamp );
                });

                piCam.on("read", function( err, timestamp, filename ) {
                    console.log("photo image captured with filename: " + filename );
                    resolve(webPath + name);
                    piCam.stop();
                });

                piCam.on("exit", function( timestamp ) {
                    console.log("photo child process has exited at " + timestamp );
                });

                piCam.start();
            }
        })

        return p
    }
}
