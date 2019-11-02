export const TRANSITION = "--transition";

const STATES = {
	"robot": "🤖"
}

const SYMBOLS = {
	"robot": "💡"
}

export function getProperty(node, prop) {
	return getComputedStyle(node).getPropertyValue(prop);
}

export function getStateString(state, node) {
	let skin = node.runtime && node.runtime.skin;
	return STATES[skin] || state;
}

export function getSymbolString(symbol, node) {
	let skin = node.runtime && node.runtime.skin;
	return SYMBOLS[skin] || symbol;
}

export function getDirectionString(direction, node) {
	let skin = node.runtime && node.runtime.skin;

	if (skin == "plain") {
		return direction;
	} else {
		return {"L":"🡄","R":"🡆"}[direction];
	}
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

export class RuntimeAssociated extends HTMLElement {
	get runtime() { return this.closest("tm-runtime"); }

	constructor() {
		super();
		this._runtimeObserver = new MutationObserver(mutations => this.runtimeAttributeChangedCallback(mutations[0].attributeName));
	}

	connectedCallback() {
		if (this.runtime) {
			this._runtimeObserver.observe(this.runtime, {attributes:true});
			customElements.whenDefined("tm-runtime").then(() => this.runtimeConnectedCallback());
		}
	}

	disconnectedCallback() {
		this._runtimeObserver.disconnect();
	}

	runtimeConnectedCallback() {}
	runtimeAttributeChangedCallback(name) {}
}
