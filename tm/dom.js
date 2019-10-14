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
	return node.querySelector(`[data-state="${state}"] [data-tape="${tape}"]`);
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
