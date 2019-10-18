import * as util from "../util.js";

class Symbol extends HTMLElement {
	static get observedAttributes() { return ["value", "position"]; }

	connectedCallback() {
		this.updateContent();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "position": this.style.setProperty("--position", newValue); break;
			case "value": this.updateContent(); break;
		}
	}

	updateContent() {
		this.textContent = util.getSymbolString(this.value, this);
	}
}

util.reflectAttribute(Symbol, "value", "0");
util.reflectAttribute(Symbol, "position", 0);

customElements.define("tm-symbol", Symbol);
