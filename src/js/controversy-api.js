// Currently using Google+ to serve assets, todo: switch to Usergrid
export default class controversyAPI {
	constructor() {
		this.url = 'https://worldviewer-test.apigee.net/controversies-of-science/v1/';
		this.cardId = '76b02dc7-d246-11e6-861b-0ad881f403bf'; // Example graphic mock
	}

	init(data) {
		this.card = data;
		this.footnotes = data.footnotes;
		this.slides = data.slides;

		this.impressContainer = document.getElementById('impress');
		this.sideNav = document.getElementById('slide-out');

		this.cardSummary = document.querySelector('.title-box .card-summary');
		this.cardAuthor = document.querySelector('.title-box .card-author');
		this.cardTitle = document.querySelector('.title-box .card-title');
	}

	generateFootnote(selector, markup) {
		let li = document.createElement('li');
		li.innerHTML = markup;
		li.setAttribute('data-slide', selector);
		return li;
	}

	generateSlide(selector, x, y, scale) {
		let div = document.createElement('div');
		div.setAttribute('id', selector);
		div.setAttribute('data-x', x);
		div.setAttribute('data-y', y);
		div.setAttribute('data-scale', scale);
		div.classList.add('step');
		return div;
	}

	createAvatar() {
		let authorAvatar = document.createElement('img');
		authorAvatar.classList.add('author-avatar');
		authorAvatar.src = this.card.metacard.author.avatar;
		this.cardSummary.insertBefore(authorAvatar, this.cardSummary.firstChild);
	}

	addMetadataMarkup(resolve, reject) {
		this.cardTitle.innerHTML = this.card.metacard.name;
		this.cardSummary.innerHTML = this.card.metacard.summary;
		this.cardAuthor.innerHTML = this.card.metacard.author.username;

		this.createAvatar();

		resolve();
	}

	addFootnotesMarkup(resolve, reject) {
		this.footnotes.forEach((footnote) => {
			this.sideNav.appendChild(
				this.generateFootnote(
					footnote['selector'],
					footnote['markup']
				)
			);
		});

		resolve();
	}

	addSlidesMarkup(resolve, reject) {
		this.slides.forEach((slide) => {
			this.impressContainer.appendChild(
				this.generateSlide(
					slide['selector'],
					slide['x'],
					slide['y'],
					slide['scale']
				)
			)
		});

		resolve();
	}
}
