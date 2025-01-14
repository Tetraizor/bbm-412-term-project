import Component from "./component.js";
import core from "../core.js";
import Renderer from "./renderer.js";
import * as THREE from "three";
import InputManager from "../inputManager.js";

export default class Dropper extends Component {
  renderer = null;
  isHovering = false;

  constructor() {
    super();
  }

  start() {
    this.renderer = this.gameObject.getComponent(Renderer);

    core.raycast.addListener(this.renderer.mesh, (result) => {
      this.checkHover(result);
    });

    core.inputManager.addListener("mouseDown", (event) => {
      if (this.isHovering && event.clickId === 0) {
        this.drop();
      }
    });
  }

  checkHover(result) {
    if (result.type == "enter") {
      this.renderer.outlineMaterial.uniforms.outlineColor.value =
        this.renderer.highlightOutlineColor;
      this.renderer.material.uniforms.overlayColor.value = new THREE.Vector3(
        1.3,
        1.3,
        1.3
      );

      this.isHovering = true;
    }

    if (result.type == "exit") {
      this.renderer.outlineMaterial.uniforms.outlineColor.value =
        this.renderer.defaultOutlineColor;
      this.renderer.material.uniforms.overlayColor.value = new THREE.Vector3(
        1,
        1,
        1
      );

      this.isHovering = false;
    }
  }

  drop() {
    core.objectSpawner.spawnObject(
      this.gameObject.transform.position,
      "energySphere"
    );
  }
}
