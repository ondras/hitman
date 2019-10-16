import * as util from "./util.js";

function indexToState(i) { return String.fromCharCode("A".charCodeAt(0) + i); }
function stateToIndex(state) { return state.charCodeAt(0) - "A".charCodeAt(0); }
function indexToSymbol(i) { return String(i); }
function symbolToIndex(symbol) { return Number(symbol); }

class Rules extends HTMLElement {
	constructor() {
		super();
		this._built = false;
	}

	static get observedAttributes() { return ["states", "symbols"]; }

	connectedCallback() {
		if (this._built) { return; }

		this.innerHTML = "";

		let table = document.createElement("table");
		table.createTHead();
		table.createTBody();
		this.append(table);

		this._fill();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "states":
			case "symbols":
				if (!this._built) { return; }
				this._fill();
			break;
		}
	}

	_fill() {
		const table = this.querySelector("table");
		const tHead = table.tHead;
		const tBody = table.tBodies[0];

		tHead.innerHTML = "";
		tBody.innerHTML = "";

		let row = tHead.insertRow();
		for (let i=-1;i<this.states;i++) {
			let cell = row.insertCell();
			if (i > -1) {

			}
		}

		for (let j=0;j<this.symbols;j++) {
			let row = tBody.insertRow();
			for (let i=-1;i<this.states;i++) {
				let cell = row.insertCell();
				if (i > -1) {
					cell.dataset.state = indexToState(i);
					cell.dataset.symbol = indexToSymbol(j);
					cell.textContent = `1L${indexToState(i)}`;
				} else {
				}
			}
		}
	}

	advanceState(state, symbol) {
		let cell = this._getCell(state, symbol);
		if (!cell) { return null; }

		let previous = Array.from(this.querySelectorAll(".active"));
		previous.forEach(n => n.classList.remove("active"));
		cell.classList.add("active");

		let parts = cell.textContent.trim().split("");
		let position = (parts[1] == "L" ? -1 : 1);

		return {state:parts[2], position, tape:parts[0]};
	}

	fillBusyBeaver() {
		for (let j=0;j<this.symbols;j++) {
			for (let i=0;i<this.states;i++) {
				let state = indexToState(i);
				let symbol = indexToSymbol(j);
				let cell = this._getCell(state, symbol);
				cell.textContent = BUSY[this.states][`${state}-${symbol}`];
			}
		}

		return this;
	}

	_getCell(state, symbol) {
		const table = this.querySelector("table");
		return table.querySelector(`[data-state="${state}"][data-symbol="${symbol}"]`);
	}
}

util.reflectAttribute(Rules, "states", 1);
util.reflectAttribute(Rules, "symbols", 2);
customElements.define("tm-rules", Rules);

const BUSY = {
	"2": {
		"A-0": "1RB",
		"B-0": "1LA",
		"A-1": "1LB",
		"B-1": "1RH"
	},

	"3": {
		"A-0": "1RB",
		"B-0": "0RC",
		"C-0": "1LC",
		"A-1": "1RH",
		"B-1": "1RB",
		"C-1": "1LA"
	},
	"4": {
		"A-0": "1RB",
		"B-0": "1LA",
		"C-0": "1RH",
		"D-0": "1RD",
		"A-1": "1LB",
		"B-1": "0LC",
		"C-1": "1LD",
		"D-1": "0RA"
	}
}
