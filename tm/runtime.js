import * as util from "./util.js";
import * as dom from "./dom.js";
import * as rules from "./rules.js";

export async function transitionToNextState(machineNode, tapeNode, rulesNode) {
	let {state:oldState, position:oldPosition} = dom.getMachineState(machineNode);
	let oldTape = dom.getTapeValue(tapeNode, oldPosition);

	let {state, position, tape} = rules.advanceState(rulesNode, oldState, oldPosition, oldTape);
	dom.setTapeValue(tapeNode, oldPosition, tape);
	dom.setMachineState(machineNode, state, position);

	let time = dom.getTransitionTime(machineNode);
	await util.sleep(time);
	
	return (state != "H");
}

export async function loop(machineNode, tapeNode, rulesNode) {
	while (1) {
		let running = await transitionToNextState(machineNode, tapeNode, rulesNode);
		if (!running) { break; }
	}
}
