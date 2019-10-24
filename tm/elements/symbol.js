import * as util from "../util.js";

class Symbol extends util.RuntimeAssociated {
	static get observedAttributes() { return ["value", "position"]; }

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "position": this.style.setProperty("--position", newValue); break;
			case "value": this._updateContent(); break;
		}
	}

	runtimeConnectedCallback() { this._updateContent(); }
	runtimeAttributeChangedCallback(name) {
		switch (name) {
			case "skin": this._updateContent(); break;
		}
	}

	_updateContent() {
		this.textContent = util.getSymbolString(this.value, this);
	}
}

util.reflectAttribute(Symbol, "value", "0");
util.reflectAttribute(Symbol, "position", 0);

customElements.define("tm-symbol", Symbol);
