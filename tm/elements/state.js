import * as util from "../util.js";

class State extends util.RuntimeAssociated {
	static get observedAttributes() { return ["value"]; }

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
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
		this.textContent = util.getStateString(this.value, this);
	}
}

util.reflectAttribute(State, "value", "A");

customElements.define("tm-state", State);
