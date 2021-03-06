import * as util from "../util.js";

const BUSY = {
	"2": {
		"A0": "1RB",
		"B0": "1LA",
		"A1": "1LB",
		"B1": "1RH"
	},

	"3": {
		"A0": "1RB",
		"B0": "0RC",
		"C0": "1LC",
		"A1": "1RH",
		"B1": "1RB",
		"C1": "1LA"
	},
	"4": {
		"A0": "1RB",
		"B0": "1LA",
		"C0": "1RH",
		"D0": "1RD",
		"A1": "1LB",
		"B1": "0LC",
		"C1": "1LD",
		"D1": "0RA"
	},
	"5": {
		"A0": "1RB",
		"B0": "1RC",
		"C0": "1RD",
		"D0": "1LA",
		"E0": "1RH",
		"A1": "1LC",
		"B1": "1RB",
		"C1": "0LE",
		"D1": "1LD",
		"E1": "0LA"
	}
}

class Rules extends util.RuntimeAssociated {
	constructor() {
		super();
		this._built = false;
		this._editing = false;
		this._tds = [];
		this._current = null;
	}

	static get observedAttributes() { return ["states", "symbols"]; }

	connectedCallback() {
		super.connectedCallback();

		if (this._built) { return; }

		this.innerHTML = "";

		let table = document.createElement("table");
		table.createTHead();
		table.createTBody();
		this.append(table);

		this._initial = this.getAttribute("initial");
		this._built = true;
		this._fill();

		this.reset();
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
		this._markCurrent(null);

		let initial = this._initial;
		if (!initial) { return; }

		if (initial == "bb") { return this.fillBusyBeaver(); }

		initial.split(",").forEach(rule => {
			let [key, value] = rule.split(":");
			let [state, symbol] = key.split("");
			let cell = this._getCell(state, symbol);
			fillCellFromString(cell, value)
		});
	}

	get editable() { return this.hasAttribute("editable"); }
	set editable(editable) { return (editable ? this.setAttribute("editable", editable) : this.removeAttribute("editable")); }

	_fill() {
		const table = this.querySelector("table");
		const tHead = table.tHead;
		const tBody = table.tBodies[0];
		this._tds = [];

		tHead.innerHTML = "";
		tBody.innerHTML = "";

		let row = tHead.insertRow();
		for (let i=-1;i<this.states;i++) {
			let cell = row.appendChild(document.createElement("th"));
			if (i > -1) { 
				let state = document.createElement("tm-state");
				state.value = indexToState(i);
				cell.append(state);
			} else {
				let button = document.createElement("button");
				button.textContent = "⚙️";
				button.addEventListener("click", e => this._toggleEditing());
				cell.append(button);
			}
		}

		for (let j=0;j<this.symbols;j++) {
			let row = tBody.insertRow();
			let cell;
			let tds = [];
			for (let i=-1;i<this.states;i++) {
				if (i > -1) {
					cell = row.insertCell();
					fillCellFromString(cell, "0RA");
					tds.push(cell);
				} else {
					cell = row.appendChild(document.createElement("th"));
					let symbol = document.createElement("tm-symbol");
					symbol.value = indexToSymbol(j);
					cell.append(symbol);
				}
			}
			this._tds.push(tds);
		}
	}

	getInstruction(state, symbol) {
		let cell = this._getCell(state, symbol);
		if (!cell) { return null; }

		this._markCurrent(cell);

		return extractInstruction(cell);
	}

	fillBusyBeaver() {
		for (let j=0;j<this.symbols;j++) {
			for (let i=0;i<this.states;i++) {
				let state = indexToState(i);
				let symbol = indexToSymbol(j);
				let value = BUSY[this.states][`${state}${symbol}`];

				let cell = this._getCell(state, symbol);
				fillCellFromString(cell, value)
			}
		}

		return this;
	}

	_getCell(state, symbol) {
		let rowIndex = symbolToIndex(symbol);
		let colIndex = stateToIndex(state);
		return this._tds[rowIndex][colIndex];
	}

	_markCurrent(cell) {
		this._current && this._current.classList.remove("current");
		this._current = cell;
		this._current && this._current.classList.add("current");
	}

	_toggleEditing() {
		this._editing = !this._editing;
		const table = this.querySelector("table");
		let cells = [...table.querySelectorAll("tbody td")];
		cells.forEach(cell => {
			if (this._editing) {
				fillCellWithSelects(cell, this);
			} else {
				let str = getSelectValues(cell);
				fillCellFromString(cell, str);
			}
		});
	}
}

function indexToState(i) { return String.fromCharCode("A".charCodeAt(0) + i); }
function indexToSymbol(i) { return String(i); }

function stateToIndex(state) { return state.charCodeAt(0) - "A".charCodeAt(0); }
function symbolToIndex(symbol) { return Number(symbol); }

function extractInstruction(cell) {
	if (!cell.instruction) {
		cell.instruction = {
			symbol: cell.querySelector("tm-symbol"),
			direction: cell.querySelector("tm-direction"),
			state: cell.querySelector("tm-state")
		}
	}
	return cell.instruction;
}

function fillCellFromString(cell, string) {
	cell.instruction = null;
	cell.innerHTML = "";

	let symbol = document.createElement("tm-symbol");
	symbol.value = string.charAt(0);
	cell.append(symbol);

	let direction = document.createElement("tm-direction");
	direction.value = string.charAt(1);
	cell.append(direction);

	let state = document.createElement("tm-state");
	state.value = string.charAt(2);
	cell.append(state);
}

function fillCellWithSelects(cell, rules) {
	let instruction = extractInstruction(cell);
	cell.innerHTML = "";

	let select;

	select = document.createElement("select");
	for (let i=0;i<rules.symbols;i++) {
		select.appendChild(new Option(indexToSymbol(i)));
	}
	select.value = instruction.symbol.value;
	cell.append(select);

	select = document.createElement("select");
	["L", "R"].forEach(dir => select.appendChild(new Option(dir)));;
	select.value = instruction.direction.value;
	cell.append(select);

	select = document.createElement("select");
	for (let i=0;i<rules.states;i++) {
		select.appendChild(new Option(indexToState(i)));
	}
	select.appendChild(new Option("H"));
	select.value = instruction.state.value;
	cell.append(select);
}

function getSelectValues(cell) {
	return [...cell.querySelectorAll("select")].map(s => s.value).join("");
}

util.reflectAttribute(Rules, "states", 1);
util.reflectAttribute(Rules, "symbols", 2);
customElements.define("tm-rules", Rules);
