class Tape extends HTMLElement {
	reset() {
		this.innerHTML = "";
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
}

customElements.define("tm-tape", Tape);
