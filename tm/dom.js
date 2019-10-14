export const POSITION = "--position";
export const TRANSITION = "--transition";

function getProperty(node, prop) {
	return getComputedStyle(node).getPropertyValue(prop);
}

export function getMachineState(node) {
	return {
		state: node.dataset.state,
		position: Number(getProperty(node, POSITION))
	}
}

export function setMachineState(node, state, position) {
	node.dataset.state = state;
	node.style.setProperty(POSITION, position);
}

export function getTapeValue(node, position) {
	let span = node.querySelector(`[data-position="${position}"]`);
	return (span ? span.dataset.value : "0");
}

export function setTapeValue(node, position, value) {
	let span = node.querySelector(`[data-position="${position}"]`);
	if (!span) {
		span = document.createElement("span");
		span.dataset.position = position;
		span.style.setProperty(POSITION, position);
		node.appendChild(span);
	}
	span.dataset.value = value;
}

export function getRuleNode(node, state, tape) {
	return node.querySelector(`[data-tape="${tape}"] [data-state="${state}"]`);
}

export function setRuleNode(node, str) {
	node.textContent = str;
}

export function getTransitionTime(machine) {
	return Number(getProperty(machine, TRANSITION));
}

export function bindInputAndProperty(input, node, property) {
	function inputToProperty() {
		node.style.setProperty(property, input.value);
	}
	function propertyToInput() {
		input.value = Number(getProperty(node, property));
	}

	input.addEventListener("input", inputToProperty);
	propertyToInput();
}

export function createMachine() {
	let node = document.createElement("div");
	node.className = "machine";
	node.dataset.state = "A";
	return node;
}

export function createTape() {
	let node = document.createElement("div");
	node.className = "tape";
	return node;
}

function indexToState(i) { return String.fromCharCode("A".charCodeAt(0) + i); }

export function createRules(numStates) {
	let node = document.createElement("table");
	node.className = "rules";

	let thead = document.createElement("thead");
	node.appendChild(thead);
	let tr = thead.insertRow();

	for (let state=-1;state<numStates;state++) {
		let td = tr.insertCell();
		if (state > -1) { td.dataset.state = indexToState(state); }
	}

	let tbody = document.createElement("tbody");
	node.appendChild(tbody);

	for (let tape=0;tape<=1;tape++) {
		let tr = tbody.insertRow();
		tr.dataset.tape = tape;

		for (let state=-1;state<numStates;state++) {
			let td = tr.insertCell();
			if (state > -1) {
				td.dataset.state = indexToState(state);
				td.textContent = `1L${indexToState(state)}`;
			} else {
				td.dataset.tape = tape;
			}
		}
	}

	return node;
}
