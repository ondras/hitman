import "./machine.js";
import "./symbol.js";
import "./tape.js";
import "./rules.js";
import "./scene.js";
import "./instruction.js";

function getProperty(node, prop) {
	return getComputedStyle(node).getPropertyValue(prop);
}

function sleep(ms) {
	return new Promise(r => setTimeout(r, ms));
}

export async function transitionToNextState(machine, tape, rules) {
	let symbol = tape.getValue(machine.position);
	let instruction = rules.getInstruction(machine.state, symbol);

	tape.setValue(machine.position, instruction.symbol);
	machine.state = instruction.state;
	machine.position += (instruction.direction == "L" ? -1 : 1);

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
