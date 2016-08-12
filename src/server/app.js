import express from 'express'
import exphbs from 'express-handlebars'
import Handlebars from 'handlebars'
import path from 'path'
import fs from 'fs'
import Camera from './modules/camera'
import Config from './modules/config'

var app = express()
var port = 8000

var html = exphbs.create({extname: '.html'})

app.use(express.static(__dirname))
app.set('views', path.join(__dirname, '/views'))
app.engine('html', html.engine)
app.set('view engine', 'html')

app.get('/reload', (req, res) => {
	if (Config.instance.env === 'dev') {
        setTimeout(() => {
        	new Camera()
			.then((img) => {
				res.set('Content-Type', 'application/json')
				res.send({
					status: 'sucess',
					img: img
				})
			})
        }, 2000)
    }else {
		new Camera()
			.then((img) => {
				res.set('Content-Type', 'application/json')
				res.send({
					status: 'sucess',
					img: img
				})
			})
    }
});

app.get('/', (req, res) => {
	new Camera()
		.then((img) => {
			var index = __dirname + '/views/index.html'
			var html = fs.readFileSync(index, 'utf8')

			var template = Handlebars.compile(html, {noEscape: true})
			var tmp = template({img: img})
			
			res.set('Content-Type', 'text/html')
			return res.send(tmp);
		})
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
