import * as THREE from "three";
import Component from "./component.js";
import core from "../core.js";

export default class GizmoRenderer extends Component {
  mesh = null;

  length = 5;
  hexColor = 0xff0000;

  arrow = null;

  constructor(color = 0xff0000, length = 1) {
    super();
    this.color = color;
    this.length = length;
  }

  start() {
    super.start();

    this.arrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0),
      this.length,
      this.hexColor
    );

    core.scene.add(this.arrow);
  }

  update() {
    super.update();

    // this.gameObject.transform.rotation.z += 0.01;
    // this.gameObject.transform.rotation.x += (core.deltaTime / 1000) * Math.PI;
    // this.gameObject.transform.rotation.y += (core.deltaTime / 1000) * Math.PI;

    this.arrow.rotation.set(
      this.gameObject.transform.rotation.x,
      this.gameObject.transform.rotation.y,
      this.gameObject.transform.rotation.z
    );

    this.arrow.position.set(
      this.gameObject.transform.position.x,
      this.gameObject.transform.position.y,
      this.gameObject.transform.position.z
    );
  }

  destroy() {
    super.destroy();
  }
}
