import express from 'express'
import exphbs from 'express-handlebars'
import path from 'path'
import Camera from './camera'

var app = express()
var port = 80

var html = exphbs.create({extname: '.html'})

app.use(express.static(path.join(__dirname,'screenshot')))
app.use(express.static(path.join(__dirname,'assets')))
app.set('views', path.join(__dirname, '/views'))
app.engine('html', html.engine)
app.set('view engine', 'html')

app.get('/', (req, res) => {
	new Camera(() => {
	  	res.render('index')
	})
});

app.listen(port, function () {
  console.log(`Example app listening on port port!`);
});
