import * as util from "../util.js";

class Runtime extends HTMLElement {
	static get observedAttributes() { return ["running"]; }
	constructor() {
		super();
		this._steps = 0;
	}

	connectedCallback() {
		this._dispatchStats();
	}

	async attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "running":
				let wasRunning = (oldValue !== null);
				let isRunning = (newValue !== null);
				if (wasRunning == isRunning) { return; }

				if (isRunning) {
					let {machine, tape, rules} = this;
					while (1) {
						await this._step(machine, tape, rules);
						if (!this.running) { return; }
					}
				}
			break;
		}
	}

	get running() { return this.hasAttribute("running"); }
	set running(running) { return (running ? this.setAttribute("running", "") : this.removeAttribute("running")); }

	reset() {
		this._steps = 0;

		// FIXME
		this.tape.reset();
		this.machine.reset();
		this.rules.reset();

		this._dispatchStats();
	}

	async step() {
		// FIXME
		return this._step(this.machine, this.tape, this.rules);
	}

	async _step(machine, tape, rules) {
		if (machine.state == "H") { return this.running = false; }

		transitionToNextState(machine, tape, rules);

		this._steps++;
		this._dispatchStats();

		let time = Number(util.getProperty(machine, util.TRANSITION));
		await sleep(time);

		if (machine.state == "H") { this.running = false; }
	}

	_dispatchStats() {
		let detail = {steps:this._steps, score:this.tape.getScore()};
		this.dispatchEvent(new CustomEvent("stats", {detail}));
	}
}

util.reflectAttribute(Runtime, "skin");

["tape", "machine", "rules"].forEach(name => {
	Object.defineProperty(Runtime.prototype, name, {
		get() { return this.querySelector(`tm-${name}`); }
	});
});

customElements.define("tm-runtime", Runtime);

function transitionToNextState(machine, tape, rules) {
	let symbol = tape.getValue(machine.position);

	let instruction = rules.getInstruction(machine.state, symbol);

	tape.setValue(machine.position, instruction.symbol.value);
	machine.state = instruction.state.value;
	machine.position += (instruction.direction.value == "L" ? -1 : 1);
}

function sleep(ms) {
	return new Promise(r => setTimeout(r, ms));
}
