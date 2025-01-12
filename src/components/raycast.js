import Component from "./component.js";
import * as THREE from "three";
import core from "../core.js";
import resourceManager from "../resourceManager.js";

export default class Raycast extends Component {
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  camera = null;
  objects = [];

  cursorPosition = new THREE.Vector3();

  cursor = null;

  constructor({ camera, objects }) {
    super();

    this.camera = camera;
    this.objects = objects;
  }

  start() {
    const cursorGeometry =
      resourceManager.getModel("cursor").children[0].geometry;
    const cursorMaterial = new THREE.MeshBasicMaterial({
      opacity: 0.5,
      color: 0x999999,
    });

    cursorGeometry.renderOrder = 999;

    this.cursor = new THREE.Mesh(cursorGeometry, cursorMaterial);
    this.cursor.position.set(0, 0, 0);
    this.cursor.rotation.set(-Math.PI / 2, 0, 0);
    this.cursor.scale.set(0.25, 0.25, 1);
    core.scene.add(this.cursor);

    core.inputManager.addListener("mouseMove", (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
  }

  update() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.objects);

    const oldState = this.cursor.visible;
    this.cursor.visible = false;

    if (intersects.length > 0) {
      const intersect = intersects[0];
      this.cursorPosition.copy(intersect.point);
      this.cursorPosition.y += 0.04;

      if (!oldState) {
        this.cursor.position.copy(intersect.point);
      }

      this.cursor.visible = true;
    }

    this.cursor.position.lerp(this.cursorPosition, 0.2);

    this.cursor.rotation.z += 0.01;
    this.cursor.scale
      .set(0.25, 0.25, 1)
      .multiplyScalar(1 + Math.sin(core.time / 250) * 0.1);
  }
}
