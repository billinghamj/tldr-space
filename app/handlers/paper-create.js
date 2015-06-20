export default function (req, res) {
	run(req.app, req.body)
	.then(
		data => res.redirect(303, data),
		error => res.status(error.status || 500).render('error', error));
}

async function run(app, paper) {
	paper.featuredHero = !!paper.featuredHero;
	paper.featuredGrid = !!paper.featuredGrid;

	paper = await app.get('storage').createPaper(paper);

	let tweet = `${paper.title} -`;
	if (paper.authorTwitter)
		tweet += ` @${paper.authorTwitter}`;
	tweet += ` https://tldr.space/papers/${paper._id}`;

	app.get('twitter').tweet(tweet).catch(function (error) {
		console.warn('failed to tweet', error);
	});

	return '/papers/' + paper._id;
}
