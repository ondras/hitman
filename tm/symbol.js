import * as util from "./util.js";

class Symbol extends HTMLElement {
	static get observedAttributes() { return ["value", "position"]; }

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "position": this.style.setProperty("--position", newValue); break;
		}
	}
}

util.reflectAttribute(Symbol, "value", "0");
util.reflectAttribute(Symbol, "position", 0);

customElements.define("tm-symbol", Symbol);
