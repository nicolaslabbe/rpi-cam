// ./node_modules/.bin/babel-node src/tasks/pm2.js
// ./node_modules/.bin/browserify src/tasks/pm2.js -o src/tasks/pm2.es5.js --full-paths=false --node
var pm2 = require('pm2')
var path = require('path')

var pm2Name = 'camera';
var processPort = 80;

pm2.connect(function(err) {
	if (err instanceof Error) throw err;
	var start = pm2.start;

	pm2.list(function(err, process_list) {
		var found = false;

		Array.prototype.forEach.call(process_list, function(process) {
			if (process.name === pm2Name) {
				found = true;
			}
		})

		var cb = function() {
			var options = {
				'name':pm2Name,
				'nodeArgs':['--harmony'],
				'watch':"./dist/app.es5.js",
				env: {
					'PORT': processPort
					,"args": ["--ignore-watch=\.git|node_modules|src"]
				}
			};
			console.log('[ pm2 ] start', path.join(__dirname, '../dist/app.es5.js'));
			console.log('[ pm2 ] options', options);
			start(
				path.join(__dirname, '../dist/app.es5.js'),
				options,
				function(err, proc) {
					if (err instanceof Error) throw err;

					pm2.list(function(err, list) {
						 if (err instanceof Error) throw err;
						Array.prototype.forEach.call(list, function(item) {
							console.log('[ pm2 ]', '{', '"pid":', item.pid + ',', '"process":', '"' + item.name + '"', '}');
						})
						process.exit(0);
					})
				})
		}

		if (!found) {
			cb();
		}else {
			console.log('[ pm2 ] stop ', pm2Name);
			pm2.delete(pm2Name, function(err, proc) {
		    if (err) throw new Error(err);
		    console.log('[ pm2 ]', pm2Name,  'server stopped');
		    cb()
			});
		}
	});
});
