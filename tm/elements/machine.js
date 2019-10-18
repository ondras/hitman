import * as util from "../util.js";

class Machine extends util.SceneAssociated {
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

	_onSceneChange() { this._updateContent(); }

	_updateContent() {
		this.textContent = util.getStateString(this.state, this);
	}
}

util.reflectAttribute(Machine, "state", "A");
util.reflectAttribute(Machine, "position", 0);

customElements.define("tm-machine", Machine);
