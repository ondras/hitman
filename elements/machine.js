import * as util from "../util.js";

class Machine extends util.RuntimeAssociated {
	static get observedAttributes() { return ["position", "state"]; }

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "state": this._updateContent(); break;
			case "position": this.style.setProperty("--position", newValue); break;
		}
	}

	reset() {
		this.position = 0;
		this.state = "A";
	}

	runtimeConnectedCallback() { this._updateContent(); }
	runtimeAttributeChangedCallback(name) {
		switch (name) {
			case "skin": this._updateContent(); break;
		}
	}

	_updateContent() {
		this.textContent = util.getStateString(this.state, this);
	}
}

util.reflectAttribute(Machine, "state", "A");
util.reflectAttribute(Machine, "position", 0);

customElements.define("tm-machine", Machine);
