import * as util from "../util.js";

class Scene extends HTMLElement {
}

util.reflectAttribute(Scene, "skin");

["tape", "machine", "rules"].forEach(name => {
	Object.defineProperty(Scene.prototype, name, {
		get() { return this.querySelector(`tm-${name}`); }
	});
});

customElements.define("tm-scene", Scene);
