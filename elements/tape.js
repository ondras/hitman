class Tape extends HTMLElement {
	connectedCallback() {
		this._initial = this.getAttribute("initial") || "";
		this.reset();
	}

	reset() {
		this.innerHTML = "";
		this._initial.split("").forEach((value, index) => this.setValue(index, value));
	}

	getValue(position) {
		let symbol = this.querySelector(`[position="${position}"]`);
		return (symbol ? symbol.value : "0");
	}

	setValue(position, value) {
		let symbol = this.querySelector(`[position="${position}"]`);
		if (!symbol) {
			symbol = document.createElement("tm-symbol");
			symbol.position = position;
			this.append(symbol);
		}
		symbol.value = value;
	}

	getScore() {
		return this.querySelectorAll('tm-symbol[value="1"]').length;
	}
}

customElements.define("tm-tape", Tape);
