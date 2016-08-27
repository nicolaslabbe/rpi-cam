import express from 'express'
import exphbs from 'express-handlebars'
import Handlebars from 'handlebars'
import path from 'path'
import fs from 'fs'
import {Camera, Deploy, Config, Images} from './modules'
import {helperJson, helperRaw} from './helpers'

var app = express()
var port = 8000

var html = exphbs.create({extname: '.html'})

app.use(express.static(process.cwd() + '/dist'))
app.set('views', path.join(process.cwd(), '/dist/views'))
app.engine('html', html.engine)
app.set('view engine', 'html')

Handlebars.registerHelper('toJSON', helperJson.instance.helper);
Handlebars.registerHelper('raw', helperRaw.instance.helper);

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
		})
		.catch((e) => {
			return res.send(e.toString());
		})
    }, time)
}

function deploy(req, res) {
	Deploy.instance.run()
		.then(() => {
			res.set('Content-Type', 'application/json')
			res.send({
				status: 'sucess',
				messages: 'done'
			})
		})
		.catch((e) => {
			res.set('Content-Type', 'application/json')
			res.send({
				status: 'error',
				messages: e.toString()
			})
		})
}

app.get('/deploy', deploy)
app.post('/deploy', deploy)

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

var index = process.cwd() + '/dist/views/index.html'
var html = fs.readFileSync(index, 'utf8')

var template = Handlebars.compile(html, {noEscape: true})
app.get('/', (req, res) => {
	Images.instance.read()
		.then((images) => {
			console.log('* * * * * * * * * * * * * * * * * * * * * * * * * * * * *')
			console.log('images', images)
			var tmp = template({images: images})
			res.set('Content-Type', 'text/html')
			return res.send(tmp);
		})
		.catch((e) => {
			return res.send(e.toString());
		})
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
