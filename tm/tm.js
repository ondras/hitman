import "./machine.js";
import "./symbol.js";
import "./tape.js";
import "./rules.js";
import "./scene.js";

import * as util from "./util.js";

export async function transitionToNextState(machine, tape, rules) {
	let oldSymbol = tape.getValue(machine.position);

	let {state, position, symbol} = rules.advanceState(machine.state, oldSymbol);

	tape.setValue(machine.position, symbol);
	machine.state = state;
	machine.position += position;

	let time = util.getTransitionTime(machine);
	await util.sleep(time);

	return (state != "H");
}

export async function loop(machine, tape, rules) {
	while (1) {
		let running = await transitionToNextState(machine, tape, rules);
		if (!running) { break; }
	}
}
