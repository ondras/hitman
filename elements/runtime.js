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

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "running":
				let wasRunning = (oldValue !== null);
				let isRunning = (newValue !== null);
				if (wasRunning == isRunning) { return; }

				if (isRunning) { this._loop(); }
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
		this._runBatch(this.machine, this.tape, this.rules, 1);
		this._dispatchStats();
	}

	async _runBatch(machine, tape, rules, count) {
		if (machine.state == "H") { return false; }

		for (let i=0;i<count;i++) {
			transitionToNextState(machine, tape, rules);
			this._steps++;
			if (machine.state == "H") { return false; }
		}

		return true;
	}

	async _loop() {
		let {machine, tape, rules} = this;
		let time = Number(util.getProperty(machine, util.TRANSITION));
		let count = (time ? 1 : 1000);

		while (this.running) {
			this.running = await this._runBatch(machine, tape, rules, count);
			this._dispatchStats();
			this.running && await sleep(time);
		}
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
