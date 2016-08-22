import express from 'express'
import exphbs from 'express-handlebars'
import Handlebars from 'handlebars'
import path from 'path'
import fs from 'fs'
import Camera from './modules/camera'
import Config from './modules/config'
import Images from './modules/images'
import JsonHelper from './helpers'
console.log('* * * * * * * * * * * * * * * * * * * * * * * * * * * * *')
console.log('JsonHelper', JsonHelper)

var app = express()
var port = 8000

var html = exphbs.create({extname: '.html'})

app.use(express.static(__dirname))
app.set('views', path.join(__dirname, '/views'))
app.engine('html', html.engine)
Handlebars.registerHelper('toJSON', jsonHelper.instance.helper);
app.set('view engine', 'html')

function make(req, res, options = {}) {
	var time = Config.instance.env === 'dev' ? 2000 : 0
    setTimeout(() => {
    	new Camera(options)
		.then((img) => {
			res.set('Content-Type', 'application/json')
			res.send({
				status: 'sucess',
				images: [{
					path: img
				}]
			})
		}).catch(function(e) {
	      console.error(e)
	    })
    }, time)
}

app.get('/saturation', (req, res) => {
	make(req, res, {saturation: -100})
});

app.get('/sharpness', (req, res) => {
	make(req, res, {sharpness: -100})
});

app.get('/brightness', (req, res) => {
	make(req, res, {brightness: 50})
});

app.get('/reload', (req, res) => {
	make(req, res)
});

app.get('/', (req, res) => {
	Images.instance.read()
		.then((images) => {
			var index = __dirname + '/views/index.html'
			var html = fs.readFileSync(index, 'utf8')

			var template = Handlebars.compile(html, {noEscape: true})
			var tmp = template({images: images})
			
			// res.set('Content-Type', 'text/html')
			// return res.send(html);
			return res.send(tmp);
		})
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
