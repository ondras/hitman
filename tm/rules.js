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
	let states = ["A", "B"]; // FIXME
	let tapes = ["0", "1"];

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
	}
}