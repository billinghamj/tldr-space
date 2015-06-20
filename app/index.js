const express = require('express');
const http = require('http');
var path = require('path');
const Q = require('q');
const mongo = require('mongodb');
const storage = require('./storage');
var exphbs = require('express-handlebars');

const app = express();
export default app;

app.engine('handlebars', exphbs({
	defaultLayout: 'main',
	layoutsDir: path.join(__dirname, 'views/layouts'),
	partialsDir: path.join(__dirname, 'views/partials')
}));

app.set('port', process.env.PORT || 3000);
app.set('storage', new storage(app));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// todo - handlers

const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost/research-directory';

(async function () {
	let db = await Q.nfcall(mongo.MongoClient.connect, dbUrl);

	app.set('db', db);
	console.info('database connected');

	/* istanbul ignore if : not used during unit testing */
	if (require.main === module) {
		let server = http.createServer(app);
		let port = app.get('port');

		server.listen(port, () => console.info('listening on port ' + port));
	}
})().then(null, console.error);
