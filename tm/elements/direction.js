import * as util from "../util.js";

class Direction extends util.SceneAssociated {
	static get observedAttributes() { return ["value"]; }

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "value": this._updateContent(); break;
		}
	}

	_onSceneChange() { this._updateContent(); }

	_updateContent() {
		this.textContent = util.getDirectionString(this.value, this);
	}
}

util.reflectAttribute(Direction, "value", "L");

customElements.define("tm-direction", Direction);
