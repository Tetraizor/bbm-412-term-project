import * as THREE from "three";
import LightBase from "./lightBase.js";
import core from "../../core.js";
import { hexToRgb, rgbToHex } from "../../utils/colorUtils.js";
import Renderer from "../renderer.js";

export default class AmbientLight extends LightBase {
  intensity = 0;
  baseIntensity = 0.4;
  color = 0xffffff;

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

    this.color = rgbToHex(0.56, 0.76, 0.89, true);

    document
      .getElementById("lightIntensity")
      .addEventListener("input", (event) => {
        this.intensity = event.target.value * this.baseIntensity;
      });
  }

  updateAmbientColor(color) {
    const intString = "0x" + rgbToHex(color.x, color.y, color.z, true);
    this.color = parseInt(intString);
  }

  update() {
    super.update();

    if (this.light.color != this.color) {
      this.light.color = new THREE.Color(this.color);

      core.gamePlayManager.renderers.forEach((renderer) => {
        renderer.onLightPropertyChanged();
      });

      core.cloud.getComponent(Renderer).material.uniforms.ambientColor.value =
        hexToRgb(this.color);
    }

    if (this.light.intensity != this.intensity) {
      this.light.intensity = this.intensity;

      core.gamePlayManager.renderers.forEach((renderer) => {
        renderer.onLightPropertyChanged();
      });
    }
  }
}
