import * as util from "../util.js";

class Direction extends HTMLElement {
	static get observedAttributes() { return ["value"]; }

	connectedCallback() {
		this.updateContent();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "value": this.updateContent(); break;
		}
	}

	updateContent() {
		this.textContent = util.getDirectionString(this.value, this);
	}
}

util.reflectAttribute(Direction, "value", "L");

customElements.define("tm-direction", Direction);
