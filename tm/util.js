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

export function reflectAttribute(Ctor, name, def=null) {
	Object.defineProperty(Ctor.prototype, name, {
		get() {
			if (this.hasAttribute(name)) {
				let value = this.getAttribute(name);
				return (def === null ? value : def.constructor(value));
			} else {
				return def;
			}
		},
		set(value) {
			if (value === null) {
				return this.removeAttribute(name);
			} else {
				return this.setAttribute(name, value);
			}
		}
	});
}

function getProperty(node, prop) {
	return getComputedStyle(node).getPropertyValue(prop);
}
