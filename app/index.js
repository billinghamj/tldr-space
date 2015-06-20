const express = require('express');
const http = require('http');
const path = require('path');
const Q = require('q');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongo = require('mongodb');
const storage = require('./storage');

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

app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', require('./handlers/root'));
app.post('/papers', require('./handlers/paper-create'));
app.get('/papers/new', require('./handlers/paper-new'));
app.get('/papers/:paperId', require('./handlers/paper-show'));

const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost/research-directory';

(async function () {
	let db = await Q.nfcall(mongo.MongoClient.connect, dbUrl);

	app.set('db', db);
	console.info('database connected');

	await Q.ninvoke(db.collection('papers'), 'createIndexes', [
		{ key: { featuredHero: 1 } },
		{ key: { featuredGrid: 1 } }
	]);

	console.info('created indexes');

	/* istanbul ignore if : not used during unit testing */
	if (require.main === module) {
		let server = http.createServer(app);
		let port = app.get('port');

		server.listen(port, () => console.info('listening on port ' + port));
	}
})().then(null, console.error);
