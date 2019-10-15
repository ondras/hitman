export function sleep(ms) {
	return new Promise(r => setTimeout(r, ms));
}

export function getProperty(node, prop) {
	return getComputedStyle(node).getPropertyValue(prop);
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

export function indexToState(i) { return String.fromCharCode("A".charCodeAt(0) + i); }

export function reflectAttribute(Ctor, name, def=null) {
	Object.defineProperty(Ctor.prototype, name, {
		get() {
			if (this.hasAttribute(name)) {
				let value = this.getAttribute(name);
				if (typeof(def) == "number") { value = Number(value); }
				return value;
			} else {
				return def;
			}
		},
		set(value) { return this.setAttribute(name, value); }
	});
}

export const TRANSITION = "--transition";

export function getTransitionTime(machine) {
	return Number(getProperty(machine, TRANSITION));
}

