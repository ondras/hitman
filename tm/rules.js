import * as dom from "./dom.js";

export function advanceState(rulesNode, state, tape) {
	let cell = dom.getRuleNode(rulesNode, state, tape);
	if (!cell) { return null; }

	let previous = Array.from(rulesNode.querySelectorAll(".active"));
	previous.forEach(n => n.classList.remove("active"));
	cell.classList.add("active");

	let parts = cell.textContent.trim().split("");
	let position = parts[1] == "L" ? -1 : 1;

	return {state:parts[2], position, tape:parts[0]};
}

export function fillBusyBeaver(rulesNode) {
	let states = dom.getAvailableStates(rulesNode);
	let tapes = dom.getAvailableTapes(rulesNode);

	tapes.forEach(tape => {
		states.forEach(state => {
			let cell = dom.getRuleNode(rulesNode, state, tape);
			let result = BUSY[states.length][`${state}-${tape}`];
			dom.setRuleNode(cell, result);
		});
	});
}

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
