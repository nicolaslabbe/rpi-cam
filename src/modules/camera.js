import extend from 'extend'
import {spawn} from 'child_process'
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
                // ,r: raw  : Add raw bayer data to jpeg metadata
                // ,t: timeout  : Time (in ms) before takes picture and shuts down (if not specified, set to 5s)
                // th: thumb    : Set thumbnail parameters (x:y:quality) or none
                // x: exif  : EXIF tag to apply to captures (format as 'key=value') or none
                // tl: timelapse    : Timelapse mode. Takes a picture every <t>ms. %d == frame number (Try: -o img_%04d.jpg)
                // fp: fullpreview  : Run the preview using the still capture resolution (may reduce preview fps)
                // k: keypress  : Wait between captures for a ENTER, X then ENTER to exit
                // s: signal    : Wait between captures for a SIGUSR1 from another process
                // g: gl    : Draw preview to texture instead of using video render component
                // gc: glcapture    : Capture the GL frame-buffer instead of the camera image
                // set: settings    : Retrieve camera settings and write to stdout
                // cs: camselect    : Select camera <number>. Default 0
                // bm: burst    : Enable 'burst capture mode'
                // md: mode : Force sensor mode. 0=auto. See docs for other modes available
                // dt: datetime : Replace output pattern (%d) with DateTime (MonthDayHourMinSec)
                // ts: timestamp    : Replace output pattern (%d) with unix timestamp (seconds since 1970)
                // fs: framestart   : Starting frame number in output pattern(%d)
                ex: "auto"
                ,e: "jpg"
                ,v: null
                ,n: null
                ,w: 320
                ,h: 240
                ,q: 60
                ,sa: 0 // 100 = plus couleur / -100 pas de couleur (noir et blanc)
                ,sh: 0 // sharpness
                ,co: 0 // 100 = plus couleur / -100 pas de couleur (gris complete)
                ,br: 50 // 100 tout blanc / 0 tout noir
                
                // ,ISO: Set capture ISO
                // ,vs: Turn on video stabilisation
                // ,ev: Set EV compensation - steps of 1/6 stop
                
                // ,ex: "auto" // off,night,nightpreview,backlight,spotlight,sports,snow,beach,verylong,fixedfps,antishake,fireworks
                // ,awb: "auto" // off,sun,cloud,shade,tungsten,fluorescent,incandescent,flash,horizon
                ,ifx: "none" // negative,solarise,sketch,denoise,emboss,oilpaint,hatch,gpen,pastel,watercolour,film,blur,saturation,colourswap,washedout,posterise,colourpoint,colourbalance,cartoon
                // ,cfx: "average" // spot,backlit,matrix

                // ,mm: "off" // low,med,high
                // ,rot: Set image rotation (0-359)
                // ,hf: Set horizontal flip
                // ,vf: Set vertical flip
                // ,roi: Set region of interest (x,y,w,d as normalised coordinates [0.0-1.0])
                // ,ss: Set shutter speed in microseconds
                // ,awbg: Set AWB gains - AWB mode must be off
                // ,drc: Set DRC Level
                // ,st: Force recomputation of statistics on stills capture pass
                // ,a: Enable/Set annotate flags or text
                // ,3d: Select stereoscopic mode
                // ,dec: Half width/height of stereo image
                // ,3dswap: Swap camera order for stereoscopic
                //ae: Set extra annotation parameters (text size, text colour(hex YUV), bg colour(hex YUV))

            }
            // var defaultOptions = {
            //     mode: "photo",
            //     output: saveTo + name,
            //     w: 180
            // }

            defaultOptions = extend(defaultOptions, options.values)
            
            var optionStr = ''
            var optionArr = ['-o', `${saveTo}`]
            Array.prototype.forEach.call(Object.keys(defaultOptions), (key) => {
                var str = `-${key}`
                if(typeof defaultOptions[key] !== 'undefined' && defaultOptions[key] !== null
                    && defaultOptions[key] !== "null") {
                    str += ` ${defaultOptions[key]}`
                }
                optionStr += `${str} `
                optionArr = optionArr.concat(str.split(' '))
            })
            if (Config.instance.env === 'dev') {
                resolve({
                    path:'https://i.ytimg.com/vi/cNycdfFEgBc/maxresdefault.jpg',
                    cmd: 'fuck'
                });
            }else {
                var raspistill = `/opt/vc/bin/raspistill -o ${saveTo} ${optionStr}`
                console.log('cmd : ' + raspistill)

                try {
                    var raspistillCmd = spawn('/opt/vc/bin/raspistill', optionArr)

                    raspistillCmd.stdout.on('data', (data) => {
                      console.log('stdout', data.toString())
                    });

                    raspistillCmd.stderr.on('data', (data) => {
                        console.log('stderr', data.toString())
                    });

                    raspistillCmd.on('close', (code, err) => {
                        console.log(`child process exited with code`, code);
                        var result = {
                            code: code
                        }
                        if (code === 0) {
                            result.path = options.url.replace(/\/$/, '') + webPath + name
                            result.cmd = raspistill
                        }else {
                            result.error = err
                        }
                          resolve(result);
                    });
                } catch(e) {
                    resolve({path: null, cmd: cmd});
                }
            }
        })

        return p
    }
}
