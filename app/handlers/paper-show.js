export default function (req, res) {
	run(req.app, req.params.paperId)
	.then(
		data => res.render('paper-show', data),
		error => res.status(error.status || 500).render('error', error));
}

async function run(app, paperId) {
	return {
		paper: await app.get('storage').getPaper(paperId)
	};
}
