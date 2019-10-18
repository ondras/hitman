import * as util from "../util.js";

class Scene extends HTMLElement {
	static get observedAttributes() { return ["skin"]; }

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "skin":
				// tohle je takovy blby: explicitni volani, nemusej byt jeste upgradovany...
				[...this.querySelectorAll("tm-machine, tm-state, tm-symbol, tm-direction")].forEach(node => node.updateContent());
			break;
		}
	}
}

util.reflectAttribute(Scene, "skin");

["tape", "machine", "rules", "stats"].forEach(name => {
	Object.defineProperty(Scene.prototype, name, {
		get() { return this.querySelector(`tm-${name}`); }
	});
});

customElements.define("tm-scene", Scene);
