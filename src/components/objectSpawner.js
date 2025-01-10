import Component from "./component.js";
import { Vector2, Vector3 } from "three";
import GameObject from "../gameObject.js";
import Renderer from "./renderer.js";
import engine from "../engine.js";

export default class ObjectSpawner extends Component {
  constructor() {
    super();
  }

  start() {
    window.addEventListener("mousedown", (event) => {
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      this.onClicked(new Vector2(mouseX, mouseY), event.button);
    });
  }

  onClicked(position, button) {}
}
