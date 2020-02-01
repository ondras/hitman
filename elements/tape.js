class Tape extends HTMLElement {
	connectedCallback() {
		this._initial = this.getAttribute("initial") || "";
		this._initialOffset = Number(this.getAttribute("initial-offset")) || 0;
		this.reset();
	}

	reset() {
		const offset = this._initialOffset;
		this.innerHTML = "";
		this._initial.split("").forEach((value, index) => this.setValue(index+offset, value));
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
