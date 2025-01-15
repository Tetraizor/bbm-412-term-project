import Component from "./component.js";
import core from "../core.js";
import PhysicsBody from "./physicsBody.js";
import Renderer from "./renderer.js";
import * as THREE from "three";
import ResourceManager from "../resourceManager.js";
import ObjectSpawner from "./objectSpawner.js";
import { Vector3 } from "three";

export default class PlacableSpace extends Component {
  physicsBody = null;
  renderer = null;
  isHovering = false;
  cursor = null;
  cursorPosition = new THREE.Vector3();

  objectState = null;

  isSpawning = false;
  spawningObject = null;

  objectBeingSpawned = null;
  objectSpawnLocation = new Vector3();
  currentLocation = new Vector3();

  constructor() {
    super();
  }

  start() {
    this.physicsBody = this.gameObject.getComponent(PhysicsBody);
    this.renderer = this.gameObject.getComponent(Renderer);
    this.objectSpawner = core.objectSpawner;

    core.raycast.addListener(this.renderer.mesh, (result) => {
      this.checkHover(result);
    });

    core.inputManager.addListener("mouseDown", (event) => {
      if (this.isHovering && event.clickId === 0) {
        this.attemptSpawnObject({
          position:
            this.objectState?.point.add(new Vector3(0.0, 0.06, 0.0)) ||
            this.gameObject.transform.position,
        });
      }
    });

    core.inputManager.addListener("mouseUp", (event) => {
      this.objectBeingSpawned = null;
    });

    const cursorGeometry =
      ResourceManager.getModel("cursor").children[0].geometry;

    const cursorMaterial = new THREE.MeshBasicMaterial({
      opacity: 0.9,
      color: 0xddcccc,
      transparent: true,
      depthWrite: false,
    });

    this.cursor = new THREE.Mesh(cursorGeometry, cursorMaterial);
    this.cursor.renderOrder = 999;
    this.cursor.position.set(0, 0, 0);
    this.cursor.rotation.set(-Math.PI / 2, 0, 0);
    this.cursor.scale.set(0.25, 0.25, 1);

    core.scene.add(this.cursor);
    this.cursor.visible = false;

    core.gamePlayManager.registerPlacableSpace(this);
  }

  checkHover(result) {
    if (result.type == "enter") {
      if (!this.isSpawning) {
        return;
      }

      if (this.renderer.outlineMaterial) {
        this.renderer.toggleOutline(true);
      }

      this.cursorPosition.copy(result.intersect.point);
      this.cursorPosition.y += 0.1;
      this.cursor.position.copy(this.cursorPosition);

      this.cursor.visible = true;
      this.isHovering = true;
      this.objectState = result.intersect;
    }

    if (result.type == "exit") {
      if (this.renderer.outlineMaterial) {
        this.renderer.toggleOutline(false);
      }

      this.cursor.visible = false;
      this.isHovering = false;
      this.objectState = null;

      this.objectBeingSpawned = null;
    }

    if (result.type == "stay") {
      this.cursorPosition.copy(result.intersect.point);
      this.cursorPosition.y += 0.04;

      this.cursor.position.lerp(this.cursorPosition, 0.2);

      this.cursor.rotation.z += 0.01;
      this.cursor.scale
        .set(0.25, 0.25, 1)
        .multiplyScalar(1 + Math.sin(core.time / 250) * 0.1);

      this.objectState = result.intersect;

      if (this.objectBeingSpawned) {
        const positionDifference = this.cursorPosition
          .clone()
          .sub(this.objectBeingSpawned.transform.position);

        const direction = positionDifference.normalize();
        const targetAngle = Math.atan2(direction.x, direction.z) + Math.PI / 2;

        this.objectBeingSpawned.transform.setRotation(
          new Vector3(-Math.PI / 2, 0, targetAngle)
        );
      }
    }
  }

  attemptSpawnObject({ position }) {
    this.objectBeingSpawned = this.objectSpawner.spawnObject(
      position,
      this.spawningObject
    );

    core.gamePlayManager.acceptPurchase({ item: this.spawningObject });

    this.spawningObject = null;
    this.isSpawning = false;

    this.cursor.visible = false;
  }

  setSpawningObject(object) {
    this.spawningObject = object;
    this.isSpawning = true;
  }

  cancelSpawn() {
    this.spawningObject = null;
    this.isSpawning = false;

    this.cursor.visible = false;
  }
}
