import Component from "../components/component.js";
import core from "../core.js";
import { Vector3 } from "three";

export default class Suzanne extends Component {
  speed = 0;

  constructor() {
    super();
  }

  start() {}

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
