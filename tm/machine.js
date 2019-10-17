import * as util from "./util.js";

class Machine extends HTMLElement {
	static get observedAttributes() { return ["position"]; }

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "position": this.style.setProperty("--position", newValue); break;
		}
	}
}

util.reflectAttribute(Machine, "state", "A");
util.reflectAttribute(Machine, "position", 0);

customElements.define("tm-machine", Machine);
