import * as util from "./util.js";

class Rules extends HTMLTableElement {
	constructor() {
		super();

		let thead = document.createElement("thead");
		thead.insertRow();
		this.appendChild(thead);

		let tbody = document.createElement("tbody");
		tbody.insertRow().dataset.tape = "0";
		tbody.insertRow().dataset.tape = "1";
		this.appendChild(tbody);
	}

	static get observedAttributes() { return ["states"]; }

	attributeChangedCallback(name, oldValue, newValue) {
		let count = Number(newValue);

		let row = this.querySelector("thead tr");
		row.innerHTML = "";
		for (let i=-1;i<count;i++) {
			let cell = row.insertCell();
			if (i > -1) { cell.dataset.state = util.indexToState(i); }
		}

		[...this.querySelectorAll("tbody tr")].forEach((row, i) => {
			row.innerHTML = "";
			for (let j=-1;j<count;j++) {
				let cell = row.insertCell();
				if (j > -1) {
					cell.dataset.state = util.indexToState(j);
					cell.textContent = `1L${util.indexToState(j)}`;
				} else {
					cell.dataset.tape = i;
				}
			}
		});
	}

	advanceState(state, tape) {
		let cell = this._getCell(state, tape);
		if (!cell) { return null; }

		let previous = Array.from(this.querySelectorAll(".active"));
		previous.forEach(n => n.classList.remove("active"));
		cell.classList.add("active");

		let parts = cell.textContent.trim().split("");
		let position = (parts[1] == "L" ? -1 : 1);

		return {state:parts[2], position, tape:parts[0]};
	}

	fillBusyBeaver() {
		let states = [...this.querySelectorAll("thead [data-state]")].map(node => node.dataset.state);
		let tapes = [...this.querySelectorAll("tbody tr")].map(node => node.dataset.tape);

		tapes.forEach(tape => {
			states.forEach(state => {
				let cell = this._getCell(state, tape);
				cell.textContent = BUSY[states.length][`${state}-${tape}`];
			});
		});

		return this;
	}

	_getCell(state, tape) {
		return this.querySelector(`[data-tape="${tape}"] [data-state="${state}"]`);
	}
}

customElements.define("tm-rules", Rules, {extends:"table"});

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
