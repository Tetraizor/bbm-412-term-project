import LightBase from "./lightBase.js";
import core from "../../core.js";
import * as THREE from "three";

export default class PointLight extends LightBase {
  constructor(properties) {
    super(properties);
  }

  start() {
    super.start();

    this.light = new THREE.PointLight(
      this.properties.color,
      this.properties.intensity
    );
    this.light.position.set(
      this.gameObject.transform.position.x,
      this.gameObject.transform.position.y,
      this.gameObject.transform.position.z
    );

    core.scene.add(this.light);
  }

  update() {
    super.update();

    if (this.light.color != this.properties.color) {
      this.light.color = this.properties.color;
    }

    if (this.light.intensity != this.properties.intensity) {
      this.light.intensity = this.properties.intensity;
    }
  }
}
