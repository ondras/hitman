import * as util from "../util.js";

function indexToState(i) { return String.fromCharCode("A".charCodeAt(0) + i); }
function indexToSymbol(i) { return String(i); }

function stateToIndex(state) { return state.charCodeAt(0) - "A".charCodeAt(0); }
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

		this._built = true;
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

	reset() {

		
		
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
			if (i > -1) { 
				let state = document.createElement("tm-state");
				state.value = indexToState(i);
				cell.append(state);
			}
		}

		for (let j=0;j<this.symbols;j++) {
			let row = tBody.insertRow();
			let cell;
			for (let i=-1;i<this.states;i++) {
				if (i > -1) {
					cell = row.insertCell();
					cell.append(document.createElement("tm-symbol"));
					cell.append(document.createElement("tm-direction"));
					cell.append(document.createElement("tm-state"));
				} else {
					cell = row.appendChild(document.createElement("th"));
					let symbol = document.createElement("tm-symbol");
					symbol.value = indexToSymbol(j);
					cell.append(symbol);
				}
			}
		}
	}

	getInstruction(state, symbol) {
		let cell = this._getCell(state, symbol);
		if (!cell) { return null; }

		[...this.querySelectorAll("td")].forEach(c => c.classList.toggle("current", c == cell));
		return {
			symbol: cell.querySelector("tm-symbol"),
			direction: cell.querySelector("tm-direction"),
			state: cell.querySelector("tm-state")
		}
	}

	fillBusyBeaver() {
		for (let j=0;j<this.symbols;j++) {
			for (let i=0;i<this.states;i++) {
				let state = indexToState(i);
				let symbol = indexToSymbol(j);
				let value = BUSY[this.states][`${state}-${symbol}`];

				let cell = this._getCell(state, symbol);
				cell.querySelector("tm-symbol").value = value.charAt(0);
				cell.querySelector("tm-direction").value = value.charAt(1);
				cell.querySelector("tm-state").value = value.charAt(2);
			}
		}

		return this;
	}

	_getCell(state, symbol) {
		let rowIndex = symbolToIndex(symbol);
		let colIndex = stateToIndex(state);
		return this.querySelector("table").tBodies[0].rows[rowIndex].cells[colIndex+1];
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