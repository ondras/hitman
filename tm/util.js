export function getStateString(state, node) {
	let scene = node.closest("tm-scene");
	let skin = (scene ? scene.skin : "");

	switch (skin) {
		case "robot": return "🤖"; break;
		default: return state; break;
	}
}

export function getSymbolString(symbol, node) {
	let scene = node.closest("tm-scene");
	let skin = (scene ? scene.skin : "");

	switch (skin) {
		case "robot": return "💡"; break;
		default: return symbol; break;
	}
}

export function getDirectionString(direction, node) {
	let scene = node.closest("tm-scene");
	let skin = (scene ? scene.skin : "");

	switch (skin) {
		case "robot": return {"L":"🡄","R":"🡆"}[direction]; break;
		default: return direction; break;
	}
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
//				console.log(this, name, value)
				return this.setAttribute(name, value);
			}
		}
	});
}

export class SceneAssociated extends HTMLElement {
	get scene() { return this.closest("tm-scene"); }
}
