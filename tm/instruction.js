import * as util from "./util.js";

class Instruction extends HTMLElement {
	static get observedAttributes() { return ["symbol", "direction", "state"]; }

	constructor() {
		super();
		this.symbol = "0";
		this.direction = "L";
		this.state = "A";
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "direction":
				let str = "";
				if (newValue == "L") { str = "←"; }
				if (newValue == "R") { str = "→"; }
				this.textContent = str;
			break;
		}
	}
}

util.reflectAttribute(Instruction, "symbol");
util.reflectAttribute(Instruction, "direction");
util.reflectAttribute(Instruction, "state");

customElements.define("tm-instruction", Instruction);
