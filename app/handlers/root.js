export default function (req, res) {
	run(req.app)
	.then(
		data => res.render('index', data),
		error => res.status(error.status || 500).render('error', error));
}

async function run(app) {
	let storage = app.get('storage');

	let heroPapers = await storage.getHeroPapers();

	if (heroPapers[0])
		heroPapers[0].first = true;

	return {
		heroPapers: heroPapers,
		gridPapers: await storage.getGridPapers()
	};
}
