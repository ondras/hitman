import * as util from "../util.js";

class Direction extends util.RuntimeAssociated {
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
		this.textContent = util.getDirectionString(this.value, this);
	}
}

util.reflectAttribute(Direction, "value", "L");

customElements.define("tm-direction", Direction);
