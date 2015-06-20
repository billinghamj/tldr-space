const Q = require('q');
const mongo = require('mongodb');

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
		id = mongo.ObjectID(id);
		return await Q.ninvoke(this.papers, 'findOne', { _id: id });
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
	function str(str) { return typeof str !== 'string' };
	function bool(obj) { return typeof obj !== 'boolean' };
	function def(obj) { return typeof obj === 'undefined' || obj !== null };
	function len(str, min, max) { return (min ? false : str.length < min) || (max ? false : str.length > max) };
	function url(str) { return !str.match(/^https?:\/\/[\w-]+(\.[\w-]+)+(:\d+)?(\/\S*)?$/i) };
	function urlSec(str) { return url(str) || !str.match(/^https/i) };

	function err() { throw new Error('invalid paper'); };

	if (str(paper.title)) err();
	if (str(paper.description)) err();
	if (str(paper.authors)) err();
	if (def(paper.authorTwitter) && (str(paper.authorTwitter) || !paper.authorTwitter.match(/^\w{1,15}$/))) err();
	if (str(paper.contentHtml)) err();
	if (str(paper.heroImage)) err();
	if (str(paper.smallImage)) err();
	if (str(paper.documentUrl)) err();
	if (def(paper.featuredHero) && bool(paper.featuredHero)) err();
	if (def(paper.featuredGrid) && bool(paper.featuredGrid)) err();
}
