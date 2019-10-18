import * as util from "../util.js";

class State extends HTMLElement {
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
		this.textContent = util.getStateString(this.value, this);
	}
}

util.reflectAttribute(State, "value", "A");

customElements.define("tm-state", State);
