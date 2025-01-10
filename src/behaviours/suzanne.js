import Component from "../components/component.js";
import core from "../core.js";
import { Vector3 } from "three";

export default class Suzanne extends Component {
  speed = 0;

  constructor() {
    super();
  }

  start() {
    document.getElementById("webgl").addEventListener("mousedown", (event) => {
      if (event.button == 0) {
        if (this.speed == 0) {
          this.speed = this.speed + 0.001;
        } else {
          this.speed *= -1;
        }
      } else if (event.button == 2) {
        this.speed = 0;
      } else if (event.button == 1) {
        this.speed = 0;
        this.gameObject.transform.setRotation(new Vector3(Math.PI / -2, 0, 0));
      }
    });
  }

  update() {
    this.gameObject.transform.setRotation(
      new Vector3(
        this.gameObject.transform.rotation.x + this.speed * core.deltaTime,
        this.gameObject.transform.rotation.y + this.speed * core.deltaTime * 2,
        this.gameObject.transform.rotation.z
      )
    );
  }
}
