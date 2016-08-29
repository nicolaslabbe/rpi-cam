import extend from 'extend'
import {exec} from 'child_process'
// import RaspiCam from 'raspicam'
import fs from 'fs'
import Config from './config'
import {Promise} from 'es6-promise'

export default class Camera {
    constructor(options = {}) {
        var p = new Promise((resolve, reject) => {
            var webPath = "/screenshot/"
            // var name = 'cam-' + new Date().getTime() + '.jpg'
            var name = 'cam-' + new Date().getTime() + '.jpg'
            var saveTo = process.cwd() + "/dist/screenshot/" + name
            // console.log('* * * * * * * * * * * * * * * * * * * * * * * * * * * * *')
            // console.log('create file', __dirname + webPath + name)

            var defaultOptions = {
                ex: "auto",
                e: "jpg",
                v: null,
                n: null,
                w: 320,
                h: 240,
                q: 60
            }
            // var defaultOptions = {
            //     mode: "photo",
            //     output: saveTo + name,
            //     w: 180
            // }

            // defaultOptions = extend(defaultOptions, options)
            
            var optionStr = ''
            Array.prototype.forEach.call(Object.keys(defaultOptions), (key) => {
                optionStr += `-${key}`
                if(typeof defaultOptions[key] !== 'undefined' && defaultOptions[key] !== null) {
                    optionStr += ` ${defaultOptions[key]}`
                }
                optionStr += ` `
            })
            if (Config.instance.env === 'dev') {
                resolve({
                    path:'https://i.ytimg.com/vi/cNycdfFEgBc/maxresdefault.jpg',
                    cmd: 'fuck'
                });
            }else {
                /*
                --sharpness -100 / 100
                --contrast -100 / 100
                --brightness 0 / 100
                --saturation -100 / 100
                --ISO 100 / 800
                --vstab (video)
                --ev -10 / 10
                --exposure off / auto / night / nightpreview / backlight / spotlight / sports / snow / beach / verylong / fixedfps / antishake / fireworks
                ---awb off / auto / sun / cloudshade / tungsten / fluorescent / incandescent / flash / horizon
                --imxfx none / negative / solarise / whiteboard / blackboard / sketch / denoise / emboss / oilpaint / hatch / gpen / pastel / watercolour / film / blur / saturation / colourswap / washedout / posterise / colourpoint / colourbalance / cartoon
                --colfx 0 to 255 128:128
                --rotation 0-359
                --hflip
                --vflip
                --roi 0.5,0.5,0.25,0.25
                --width
                --height
                --quality
                --raw
                --output
                --verbose
                --timeout
                // https://www.raspberrypi.org/wp-content/uploads/2013/07/RaspiCam-Documentation.pdf
                */
                var raspistill = `/opt/vc/bin/raspistill -o ${saveTo} ${optionStr}`
                console.log('cmd : ' + raspistill)
                var cmd = exec(raspistill,
                    function (err, out, code) {
                    if (err instanceof Error) throw err
                      console.log('process.stderr: ' + err)
                      console.log('process.stdout:' + out)
                      resolve({
                        path: options.url.replace(/\/$/, '') + webPath + name,
                        cmd: cmd
                      });
                })
                cmd.stderr.pipe(process.stderr)
                cmd.stdout.pipe(process.stdout)
            }
        })

        return p
    }
}
