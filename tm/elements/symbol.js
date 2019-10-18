import * as util from "../util.js";

class Symbol extends util.SceneAssociated {
	static get observedAttributes() { return ["value", "position"]; }

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "position": this.style.setProperty("--position", newValue); break;
			case "value": this._updateContent(); break;
		}
	}

	_onSceneChange() { this._updateContent(); }

	_updateContent() {
		this.textContent = util.getSymbolString(this.value, this);
	}
}

util.reflectAttribute(Symbol, "value", "0");
util.reflectAttribute(Symbol, "position", 0);

customElements.define("tm-symbol", Symbol);
