import ResourceManager from "../resourceManager.js";
import Component from "./component.js";
import * as THREE from "three";
import core from "../core.js";

export default class Outline extends Component {
  renderer = null;
  mesh = null;

  constructor(renderer) {
    super();

    this.renderer = renderer;

    console.log(this.renderer.mesh.geometry);
    const geometry = ResourceManager.getModel("airship").children.find(
      (child) => child.name === "wing_l"
    ).geometry;
    const material = ResourceManager.getMaterial("outline");
    material.side = THREE.BackSide;

    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(1.05, 1.05, 1.05);

    this.mesh = mesh;
    core.createMesh(mesh);
  }

  onPositionChanged(position) {
    this.mesh.position.set(position.x, position.y, position.z);
  }

  onRotationChanged(rotation) {
    this.mesh.rotation.set(rotation.x, rotation.y, rotation.z);
  }

  onScaleChanged(scale) {
    this.mesh.scale.set(scale.x, scale.y, scale.z);
  }

  start() {
    this.gameObject.transform.addListener("onPositionChanged", (event) => {
      this.onPositionChanged(this.renderer.mesh.position);
    });

    this.gameObject.transform.addListener("onRotationChanged", (event) => {
      this.onRotationChanged(this.renderer.mesh.rotation);
    });

    this.gameObject.transform.addListener("onScaleChanged", (event) => {
      this.onScaleChanged(event.detail.scale.clone().multiplyScalar(1.05));
    });

    this.onPositionChanged(this.gameObject.transform.position);
    this.onRotationChanged(this.gameObject.transform.rotation);
  }

  destroy() {
    this.mesh.remove(this.mesh);
  }
}
