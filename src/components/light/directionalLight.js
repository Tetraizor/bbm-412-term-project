import * as THREE from "three";
import core from "../../core.js";

import LightBase from "./lightBase.js";
import AmbientLight from "./ambientLight.js";

import { Color, Euler, Vector3, Quaternion } from "three";
import {
  hexToVec3,
  lerp3Colors,
  rgbToHex,
  lerpColors,
} from "../../utils/colorUtils.js";

export default class DirectionalLight extends LightBase {
  color = 0x000000;
  intensity = 1;
  sun = null;
  distance = 60;
  direction = new Vector3(0.3, 1, 0.3);

  constructor(properties) {
    super(properties);

    this.light = new THREE.DirectionalLight(0xffffff, 1);
  }

  start() {
    super.start();

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
      this.direction.x = event.target.value;
    });

    document.getElementById("lightY").addEventListener("input", (event) => {
      this.direction.y = event.target.value;
    });

    document.getElementById("lightZ").addEventListener("input", (event) => {
      this.direction.z = event.target.value;
    });

    document
      .getElementById("lightIntensity")
      .addEventListener("input", (event) => {
        this.intensity = event.target.value;
      });

    this.direction.x = document.getElementById("lightX").value;
    this.direction.y = document.getElementById("lightY").value;
    this.direction.z = document.getElementById("lightZ").value;

    core.scene.add(this.light);

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(5, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );

    sun.position.set(
      this.gameObject.transform.position.x,
      this.gameObject.transform.position.y,
      this.gameObject.transform.position.z
    );

    this.sun = sun;
    core.scene.add(sun);
  }

  update() {
    super.update();

    if (this.light.color != this.color) {
      core.gamePlayManager.renderers.forEach((renderer) => {
        renderer.onLightPropertyChanged();
      });
    }

    if (this.light.intensity != this.intensity) {
      this.light.intensity = this.intensity;

      core.gamePlayManager.renderers.forEach((renderer) => {
        renderer.onLightPropertyChanged();
      });
    }

    const yaw = Math.atan2(this.direction.z, this.direction.x) - Math.PI / 2;
    const pitch = Math.asin(-this.direction.y);
    const roll = 0;

    this.gameObject.transform.setRotation(new Vector3(pitch, yaw, roll));

    this.sun.position.set(
      this.gameObject.transform.position.x + this.direction.x * this.distance,
      this.gameObject.transform.position.y + this.direction.y * this.distance,
      this.gameObject.transform.position.z + this.direction.z * this.distance
    );

    const sunHeight = this.sun.position.y;
    const normalizedSunHeight =
      (sunHeight + this.distance) / (this.distance * 2);

    const modifiedNormalized = Math.max(normalizedSunHeight * 3 - 1, 0) / 2;

    const sunColor = lerp3Colors(
      hexToVec3("1e2a3a", true),
      hexToVec3("ffd27f", true),
      hexToVec3("ddddcc", true),
      modifiedNormalized
    );

    core.skyboxMaterial.uniforms.color1.value = lerp3Colors(
      new Vector3(0.01, 0.08, 0.19),
      new Vector3(0.98, 0.54, 0.33),
      new Vector3(0.56, 0.76, 0.89),
      modifiedNormalized
    );

    core.skyboxMaterial.uniforms.color2.value = lerp3Colors(
      new Vector3(0.04, 0.16, 0.31),
      new Vector3(198 / 255, 56 / 255, 63 / 255),
      new Vector3(0.7, 0.8, 0.9),
      modifiedNormalized
    );

    const fogColor = lerpColors(
      core.skyboxMaterial.uniforms.color1.value,
      core.skyboxMaterial.uniforms.color2.value,
      0.5
    );

    if (core.ambientLight) {
      core.ambientLight.getComponent(AmbientLight).updateAmbientColor(fogColor);
    } else {
      console.error("Ambient light not found");
    }

    this.color = rgbToHex(sunColor.x, sunColor.y, sunColor.z, true);
    this.sun.material.color = new Color(sunColor.x, sunColor.y, sunColor.z);

    this.light.target.position.set(
      this.gameObject.transform.position.x + this.direction.x,
      this.gameObject.transform.position.y + this.direction.y,
      this.gameObject.transform.position.z + this.direction.z
    );
  }
}
