const Q = require('q');
const twitter = require('twitter');

export default class {
	constructor() {
		this._client = new twitter({
			consumer_key: process.env.TW_C_KEY,
			consumer_secret: process.env.TW_C_SECRET,
			access_token_key: process.env.TW_AT,
			access_token_secret: process.env.TW_AT_SECRET,
		});
	}

	async tweet(text) {
		await Q.ninvoke(this._client, 'post', 'statuses/update', { status: text });
	}
}
