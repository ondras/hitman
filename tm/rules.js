import * as dom from "./dom.js";

export function advanceState(rulesNode, state, position, tape) {
	let cell = dom.getRuleNode(rulesNode, state, tape);
	if (!cell) { return null; }

	let parts = cell.textContent.trim().split("");
	let diff = parts[1] == "L" ? -1 : 1;

	return {state:parts[2], position:position+diff, tape:parts[0]};
}
