import * as util from "../util.js";

const PLAYPAUSE = ["⏵", "⏸"];
const SKINS = ["plain", "circle", "robot"];

class Controls extends util.RuntimeAssociated {
	static get observedAttributes() { return ["what"]; }

	constructor() {
		super();
		this._items = this._build();
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

	runtimeConnectedCallback() {
		this._updateState();
		this._items.skin.value = this.runtime.skin;
		let transition = Number(util.getProperty(this.runtime, util.TRANSITION));
		this._items.speed.value = transitionToSpeed(transition);
	}

	runtimeAttributeChangedCallback(name) {
		switch (name) {
			case "skin": this._items.skin.value = this.runtime.skin; break;
			case "running": this._updateState(); break;
		}
	}

	_updateState() {
		if (this.runtime.running) {
			this._items.playpause.textContent = PLAYPAUSE[1];
			this._items.step.disabled = true;
			this._items.reset.disabled = true;
		} else {
			this._items.step.disabled = false;
			this._items.reset.disabled = false;
			this._items.playpause.textContent = PLAYPAUSE[0];
		}
	}

	_build() {
		let nodes = {};
		let node;

		node = document.createElement("button");
		node.textContent = "↺";
		node.addEventListener("click", e => this.runtime && this.runtime.reset());
		nodes.reset = node;

		node = document.createElement("input");
		node.type = "range";
		node.min = "0";
		node.max = "3";
		node.value = "1";
		node.addEventListener("input", e => {
			let transition = speedToTransition(e.target.valueAsNumber);
			this.runtime.style.setProperty(util.TRANSITION, transition);
		});
		nodes.speed = node;

		node = document.createElement("button");
		node.addEventListener("click", e => this.runtime && (this.runtime.running = !this.runtime.running));
		nodes.playpause = node;

		node = document.createElement("button");
		node.textContent = "1";
		node.addEventListener("click", e => this.runtime && this.runtime.step());
		nodes.step = node;

		node = document.createElement("select");
		SKINS.forEach(name => node.appendChild(new Option(name, name)));
		node.addEventListener("change", e => this.runtime.skin = e.target.value);
		nodes.skin = node;

		return nodes;
	}

	_append() {
		this.innerHTML = "";

		let names = (this.what || "reset step playpause speed skin").split(" ");
		names.map(name => this._items[name])
			.filter(item => item)
			.forEach(item => this.append(item));
	}
}

util.reflectAttribute(Controls, "what");

customElements.define("tm-controls", Controls);

function speedToTransition(speed) {
	speed = 3-speed;
	return (speed ? 5 * Math.pow(10, speed) : 0);
}

function transitionToSpeed(transition) {
	const base = Math.log(20);
	let speed = (transition ? Math.round(Math.log10(transition/5)) : 0);
	return 3-speed;
}
