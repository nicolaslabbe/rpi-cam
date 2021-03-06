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

function take(req, res) {
	var url = req.protocol + '://' + req.get('host')
	var options = {
		values: req.query,
		url: url
	}
	
	new Camera(options)
		.then((result) => {
			res.set({
	          'Access-Control-Allow-Origin': '*',
	          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
	          'Content-Type': 'application/json',
	          'Cache-Control': 'public, max-age=' + 0
	        })
			res.send({
				status: 'sucess',
				images: [result]
			})
		})
		.catch((e) => {
			return res.send(e.toString());
		})
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

app.get('/take*', (req, res) => {
	take(req, res)
});

var index = process.cwd() + '/dist/views/index.html'
var html = fs.readFileSync(index, 'utf8')

var template = Handlebars.compile(html, {noEscape: true})
app.get('/', (req, res) => {
	Images.instance.read()
		.then((images) => {
			if (Config.instance.env === 'dev') {
				index = process.cwd() + '/dist/views/index.html'
				html = fs.readFileSync(index, 'utf8')
				template = Handlebars.compile(html, {noEscape: true})
			}
			var tmp = template({
				images: images,
				service: Config.instance.config.url
			})
			res.set('Content-Type', 'text/html')
			return res.send(tmp);
		})
		.catch((e) => {
			return res.send(e.toString());
		})
});

app.listen(Config.instance.config.port, function () {
  console.log(`Example app listening on port ${Config.instance.config.port}!`);
});
