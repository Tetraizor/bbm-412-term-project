import * as THREE from "three";
import core from "../../core.js";

import LightBase from "./lightBase.js";

export default class DirectionalLight extends LightBase {
  constructor(properties) {
    super(properties);
  }

  start() {
    super.start();

    this.light = new THREE.DirectionalLight(0xffffff, 1);
    this.light.position.set(
      this.gameObject.transform.position.x,
      this.gameObject.transform.position.y,
      this.gameObject.transform.position.z
    );

    this.light.target.rotation.set(
      this.gameObject.transform.rotation.x,
      this.gameObject.transform.rotation.y,
      this.gameObject.transform.rotation.z
    );

    document.getElementById("lightX").addEventListener("input", (event) => {
      this.gameObject.transform.rotation.x = (event.target.value * Math.PI) / 2;
    });

    document.getElementById("lightY").addEventListener("input", (event) => {
      this.gameObject.transform.rotation.y = (event.target.value * Math.PI) / 2;
    });

    document.getElementById("lightZ").addEventListener("input", (event) => {
      this.gameObject.transform.rotation.z = (event.target.value * Math.PI) / 2;
    });

    core.scene.add(this.light);
  }

  update() {
    super.update();

    if (
      this.light.position.x != this.gameObject.transform.position.x ||
      this.light.position.y != this.gameObject.transform.position.y ||
      this.light.position.z != this.gameObject.transform.position.z
    ) {
      this.light.position.set(
        this.gameObject.transform.position.x,
        this.gameObject.transform.position.y,
        this.gameObject.transform.position.z
      );
    }

    if (
      this.light.target.rotation.x != this.gameObject.transform.rotation.x ||
      this.light.target.rotation.y != this.gameObject.transform.rotation.y ||
      this.light.target.rotation.z != this.gameObject.transform.rotation.z
    ) {
      this.light.target.rotation.set(
        this.gameObject.transform.rotation.x,
        this.gameObject.transform.rotation.y,
        this.gameObject.transform.rotation.z
      );
    }

    if (this.light.color != this.properties.color) {
      this.light.color = this.properties.color;
    }

    if (this.light.intensity != this.properties.intensity) {
      this.light.intensity = this.properties.intensity;
    }

    const rotation = this.gameObject.transform.rotation;
    const euler = new THREE.Euler(rotation.x, rotation.y, rotation.z, "XYZ");
    const lightDirection = new THREE.Vector3(0, 0, 1);
    lightDirection.applyEuler(euler);

    this.light.target.position.set(
      this.gameObject.transform.position.x + lightDirection.x,
      this.gameObject.transform.position.y + lightDirection.y,
      this.gameObject.transform.position.z + lightDirection.z
    );
  }
}
