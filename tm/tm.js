import "./elements/symbol.js";
import "./elements/state.js";
import "./elements/machine.js";
import "./elements/direction.js";
import "./elements/tape.js";
import "./elements/rules.js";
import "./elements/scene.js";
import "./elements/controls.js";

function getProperty(node, prop) {
	return getComputedStyle(node).getPropertyValue(prop);
}

function sleep(ms) {
	return new Promise(r => setTimeout(r, ms));
}

export async function transitionToNextState(machine, tape, rules) {
	let symbol = tape.getValue(machine.position);

	let instruction = rules.getInstruction(machine.state, symbol);

	tape.setValue(machine.position, instruction.symbol.value);
	machine.state = instruction.state.value;
	machine.position += (instruction.direction.value == "L" ? -1 : 1);

	let time = Number(getProperty(machine, "--transition"));
	await sleep(time);

	return (machine.state != "H");
}

export async function loop(machine, tape, rules) {
	while (1) {
		let running = await transitionToNextState(machine, tape, rules);
		if (!running) { break; }
	}
}
