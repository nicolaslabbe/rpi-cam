import RaspiCam from 'raspicam'

export default class Camera {
    constructor(cb) {
        var piCam = new RaspiCam({
            mode: "photo",
            output: "./src/server/screenshot/cam.jpg",
            encoding: "jpg",
            timeout: 0, // take the picture immediately
            w: 320,
            h: 240,
            q: 60
        });

        piCam.on("started", function( err, timestamp ){
            console.log("photo started at " + timestamp );
        });

        piCam.on("read", function( err, timestamp, filename ){
            console.log("photo image captured with filename: " + filename );
            cb && cb();
            piCam.stop();
        });

        piCam.on("exit", function( timestamp ){
            console.log("photo child process has exited at " + timestamp );
        });

        piCam.start();
    }
}
