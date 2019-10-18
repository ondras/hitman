import * as util from "../util.js";

class State extends util.SceneAssociated {
	static get observedAttributes() { return ["value"]; }

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "value": this._updateContent(); break;
		}
	}

	_onSceneChange() { this._updateContent(); }

	_updateContent() {
		this.textContent = util.getStateString(this.value, this);
	}
}

util.reflectAttribute(State, "value", "A");

customElements.define("tm-state", State);
