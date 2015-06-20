export default function (req, res) {
	getData(req.app)
	.then(
		data => res.render('index', data),
		error => res.status(error.status || 500).render('error', error));
}

async function getData(app) {
	let storage = app.get('storage');

	return {
		heroPapers: await storage.getHeroPapers(),
		gridPapers: await storage.getGridPapers()
	};
}
