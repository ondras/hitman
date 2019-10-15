import * as util from "./util.js";

class Scene extends HTMLElement {}
util.reflectAttribute(Scene, "skin");

customElements.define("tm-scene", Scene);
