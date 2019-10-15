const POSITION = "--position";

class Item extends HTMLElement {
	static get observedAttributes() { return ["value", "position"]; }

	get position() {
		return this.hasAttribute("position") ? Number(this.getAttribute("position")) : 0;
	}
	set position(position) { return this.setAttribute("position", position); }

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "position": this.style.setProperty(POSITION, newValue); break;
		}
	}

	get value() {
		return this.hasAttribute("value") ? this.getAttribute("value") : "0";
	}
	set value(value) { return this.setAttribute("value", value); }
}

class Tape extends HTMLElement {
	getValue(position) {
		let item = this.querySelector(`[position="${position}"]`);
		return (item ? item.value : "0");
	}

	setValue(position, value) {
		let item = this.querySelector(`[position="${position}"]`);
		if (!item) {
			item = document.createElement("tm-item");
			item.position = position;
			this.appendChild(item);
		}
		item.value = value;
	}
}

customElements.define("tm-tape", Tape);
customElements.define("tm-item", Item);
