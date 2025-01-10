import * as THREE from "three";
import LightBase from "./lightBase.js";
import core from "../../core.js";

export default class AmbientLight extends LightBase {
  constructor(properties) {
    super(properties);

    this.light = new THREE.AmbientLight(
      this.properties.color,
      this.properties.intensity
    );
    core.scene.add(this.light);
  }

  start() {
    super.start();
  }

  update() {
    super.update();
  }
}
