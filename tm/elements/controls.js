import * as util from "../util.js";

function getProperty(node, prop) {
	return getComputedStyle(node).getPropertyValue(prop);
}

function sleep(ms) {
	return new Promise(r => setTimeout(r, ms));
}

function transitionToNextState(machine, tape, rules) {
	let symbol = tape.getValue(machine.position);

	let instruction = rules.getInstruction(machine.state, symbol);

	tape.setValue(machine.position, instruction.symbol.value);
	machine.state = instruction.state.value;
	machine.position += (instruction.direction.value == "L" ? -1 : 1);

	return (machine.state != "H");
}

class Controls extends util.SceneAssociated {
	static get observedAttributes() { return ["what"]; }

	constructor() {
		super();
		this.playing = false;
		this._controls = this._buildControls();
	}

	connectedCallback() {
		if (this._built) { return; }

		this._append();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "what":
				if (!this.parentNode) { return; }
				this._append();
			break;
		}
	}

	async play() {
		if (this.playing) { return; }
		this.playing = true;

		this._controls.step.disabled = true;
		this._controls.reset.disabled = true;

		while (1) {
			// FIXME
			await this._step(this.scene.machine, this.scene.tape, this.scene.rules);
			if (!this.playing) { return; }
		}
	}

	pause() {
		this._controls.step.disabled = false;
		this._controls.reset.disabled = false;

		if (!this.playing) { return; }
		this.playing = false;
	}

	reset() {
		// FIXME
		this.scene.tape.reset();
		this.scene.machine.reset();
		this.scene.rules.reset();
	}

	async step() {
		// FIXME
		return this._step(this.scene.machine, this.scene.tape, this.scene.rules);
	}

	async _step(machine, tape, rules) {
		if (machine.state == "H") { return this.pause(); }

		transitionToNextState(machine, tape, rules);

		let time = Number(getProperty(machine, "--transition"));
		await sleep(time);

		if (machine.state == "H") { this.pause(); }
	}

	_buildControls() {
		let controls = {};
		let node;

		node = document.createElement("button");
		node.textContent = "↺";
		node.addEventListener("click", e => this.reset());
		controls.reset = node;

		node = document.createElement("input");
		node.type = "range";
		controls.speed = node;

		node = document.createElement("button");
		node.textContent = "playpause";
		node.addEventListener("click", e => this.playing ? this.pause() : this.play());
		controls.playpause = node;

		node = document.createElement("button");
		node.textContent = "step";
		node.addEventListener("click", e => this.step());
		controls.step = node;

		node = document.createElement("select");
		["plain", "robot"].forEach(name => node.appendChild(new Option(name, name)));
		// FIXME value
		node.addEventListener("change", e => {
			if (this.scene) { this.scene.skin = e.target.value; }
		});
		controls.skin = node;

		return controls;
	}

	_append() {
		this.innerHTML = "";

		let names = (this.what || "reset step playpause speed skin").split(" ");
		names.map(name => this._controls[name])
			.filter(item => item)
			.forEach(item => this.append(item));
	}
}

util.reflectAttribute(Controls, "what");

customElements.define("tm-controls", Controls);
