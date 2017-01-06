export default class controversyAPI {
	constructor() {
		this.url = 'https://worldviewer-test.apigee.net/controversies/v1/';
		// this.url = 'http://localhost:10010/v1/';
		this.cardId = '76b02dc7-d246-11e6-861b-0ad881f403bf'; // Example graphic mock
	}

	init() {
		$.get(this.url + 'cards/' + this.cardId, (data) => {
			this.card = data;

			console.log(this.card);
		});
	}

	getReferences(cardId) {

	}

	getSlides(cardId) {

	}
}