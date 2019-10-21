import * as util from "../util.js";

const TRANSITION = "--transition";
const PLAYPAUSE = ["⏵", "⏸"];

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
}

class Controls extends util.SceneAssociated {
	static get observedAttributes() { return ["what"]; }

	constructor() {
		super();
		this._steps = 0;
		this.playing = false;
		this._controls = this._buildControls();
	}

	connectedCallback() {
		super.connectedCallback();

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

		this._controls.playpause.textContent = PLAYPAUSE[1];
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
		this._controls.playpause.textContent = PLAYPAUSE[0];

		if (!this.playing) { return; }
		this.playing = false;
	}

	reset() {
		this._steps = 0;

		// FIXME
		this.scene.tape.reset();
		this.scene.machine.reset();
		this.scene.rules.reset();

		this._updateStats();
	}

	async step() {
		// FIXME
		return this._step(this.scene.machine, this.scene.tape, this.scene.rules);
	}

	_onSceneChange() {
		this._controls.skin.value = this.scene.skin;
		this._controls.speed.value = Number(getProperty(this.scene, TRANSITION));
		this._updateStats();
	}

	async _step(machine, tape, rules) {
		if (machine.state == "H") { return this.pause(); }

		transitionToNextState(machine, tape, rules);

		this._steps++;
		this._updateStats();

		let time = Number(getProperty(machine, TRANSITION));
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
		node.min = "0"; // FIXME
		node.max = "5000";
		node.addEventListener("input", e => this.scene.style.setProperty(TRANSITION, e.target.value));
		controls.speed = node;

		node = document.createElement("button");
		node.textContent = PLAYPAUSE[0];
		node.addEventListener("click", e => this.playing ? this.pause() : this.play());
		controls.playpause = node;

		node = document.createElement("button");
		node.textContent = "1";
		node.addEventListener("click", e => this.step());
		controls.step = node;

		node = document.createElement("select");
		["plain", "robot"].forEach(name => node.appendChild(new Option(name, name)));
		node.addEventListener("change", e => this.scene.skin = e.target.value);
		controls.skin = node;

		node = document.createElement("span");
		node.className = "score";
		controls.stats = node;

		return controls;
	}

	_append() {
		this.innerHTML = "";

		let names = (this.what || "reset step playpause speed skin stats").split(" ");
		names.map(name => this._controls[name])
			.filter(item => item)
			.forEach(item => this.append(item));
	}

	_updateStats() {
		this._controls.stats.textContent = `Steps: ${this._steps}, score: ${this.scene.tape.getScore()}`;
	}
}

util.reflectAttribute(Controls, "what");

customElements.define("tm-controls", Controls);
