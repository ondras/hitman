import * as util from "../util.js";

class Machine extends HTMLElement {
	static get observedAttributes() { return ["position", "state"]; }

	connectedCallback() {
		this.updateContent();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "state": this.updateContent(); break;
			case "position": this.style.setProperty("--position", newValue); break;
		}
	}

	updateContent() {
		this.textContent = util.getStateString(this.state, this);
	}

	reset() {
		this.position = 0;
		this.state = "A";
	}
}

util.reflectAttribute(Machine, "state", "A");
util.reflectAttribute(Machine, "position", 0);

customElements.define("tm-machine", Machine);
