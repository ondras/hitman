import * as util from "./util.js";

function indexToState(i) { return String.fromCharCode("A".charCodeAt(0) + i); }
function indexToSymbol(i) { return String(i); }

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
			let cell = row.appendChild(document.createElement("th"));
			if (i > -1) { cell.dataset.state = indexToState(i); }
		}

		for (let j=0;j<this.symbols;j++) {
			let row = tBody.insertRow();
			let cell;
			for (let i=-1;i<this.states;i++) {
				if (i > -1) {
					cell = row.insertCell();
					cell.dataset.state = indexToState(i);
					let instruction = document.createElement("tm-instruction");
					cell.append(instruction);
				} else {
					cell = row.appendChild(document.createElement("th"));
				}

				cell.dataset.symbol = indexToSymbol(j);
			}
		}
	}

	getInstruction(state, symbol) {
		let cell = this._getCell(state, symbol);
		if (!cell) { return null; }

		[...this.querySelectorAll("td")].forEach(c => c.classList.toggle("current", c == cell));
		return cell.querySelector("tm-instruction");
	}

	fillBusyBeaver() {
		for (let j=0;j<this.symbols;j++) {
			for (let i=0;i<this.states;i++) {
				let state = indexToState(i);
				let symbol = indexToSymbol(j);
				let value = BUSY[this.states][`${state}-${symbol}`];

				let cell = this._getCell(state, symbol);
				let instruction = cell.querySelector("tm-instruction")
				instruction.symbol = value.charAt(0);
				instruction.direction = value.charAt(1);
				instruction.state = value.charAt(2);
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
