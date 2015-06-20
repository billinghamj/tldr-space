export default function (req, res) {
	run(req.app)
	.then(
		data => res.render('index', data),
		error => res.status(error.status || 500).render('error', error));
}

async function run(app) {
	let storage = app.get('storage');

	return {
		heroPapers: await storage.getHeroPapers(),
		gridPapers: await storage.getGridPapers()
	};
}
