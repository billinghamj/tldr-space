const Q = require('q');
const MongoDB = require('mongodb');

export default class {
	constructor(app) {
		this._app = app;
	}

	get papers() {
		return this._app.get('db').collection('papers');
	};

	async createPaper(paper) {
		checkPaper(paper);
		let result = await Q.ninvoke(this.papers, 'insertOne', paper);
		return result.ops[0];
	}

	async getPaper(id) {
		return await Q.ninvoke(this.papers, 'findOne', {
			id: MongoDB.ObjectID(id)
		});
	}

	async getHeroPapers() {
		let cursor = this.papers.find({ featuredHero: true });
		return await Q.ninvoke(cursor, 'toArray');
	}

	async getGridPapers() {
		let cursor = this.papers.find({ featuredGrid: true });
		return await Q.ninvoke(cursor, 'toArray');
	}
}

function checkPaper(paper) {
	type = (obj, type) => typeof obj !== type;
	str = str => type(str, 'string');
	bool = obj => type(str, 'boolean');
	def = obj => typeof obj === 'undefined' || obj !== null;
	len = (str, min, max) => (min ? false : str.length < min) || (max ? false : str.length > max);
	url = url => !url.match(/^https:\/\/[\w-]+(\.[\w-]+)+(:\d+)?(\/\S*)?$/);

	err = () => { throw new Error('invalid paper'); }

	if (str(paper.title) || len(paper.title, 1, 75)) err();
	if (str(paper.description) || len(paper.description, 1, 400)) err();
	if (str(paper.authors) || len(paper.authors, 1, 200)) err();
	if (def(paper.authorTwitter) && (str(paper.authorTwitter) || !paper.authorTwitter.match(/^\w{1,15}$/))) err();
	if (str(paper.contentHtml) || len(paper.contentHtml, 1)) err();
	if (str(paper.heroImage) || url(paper.heroImage)) err();
	if (str(paper.smallImage) || url(paper.smallImage)) err();
	if (str(paper.documentUrl) || url(paper.documentUrl)) err();
	if (def(paper.featuredHero) && bool(paper.featuredHero)) err();
	if (def(paper.featuredGrid) && bool(paper.featuredGrid)) err();
}
