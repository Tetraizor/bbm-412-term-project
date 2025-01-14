import Component from "./component.js";
import * as THREE from "three";
import core from "../core.js";
import ResourceManager from "../resourceManager.js";
import ObjectSpawner from "./objectSpawner.js";

export default class Raycast extends Component {
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  camera = null;
  objects = [];

  cursorPosition = new THREE.Vector3();

  cursor = null;

  objectListeners = [];
  lastObjectStates = {};

  constructor({ camera, objects }) {
    super();

    this.camera = camera;
    this.objects = objects;
  }

  start() {
    core.inputManager.addListener("mouseMove", (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      this.cursorPosition.x = this.mouse.x;
      this.cursorPosition.y = this.mouse.y;
      this.cursorPosition.z = 0;
    });
  }

  addListener(object, callback) {
    this.objectListeners.push({ object, callback });
  }

  checkIntersection(object, callback) {
    this.lastObjectStates[object.id] =
      this.lastObjectStates[object.id] || false;
  }

  update() {
    const currentObjectStates = {};

    this.objectListeners.forEach((listener) => {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObject(listener.object);

      // Set object state to raycast result
      let objectState = null;

      if (intersects.length > 0) {
        objectState = intersects[0];
      }

      currentObjectStates[listener.object.id] = objectState;
    });

    this.objectListeners.forEach((listener) => {
      const currentState = currentObjectStates[listener.object.id];
      const lastState = this.lastObjectStates[listener.object.id];

      if (currentState && !lastState) {
        listener.callback({ intersect: currentState, type: "enter" });
      } else if (!currentState && lastState) {
        listener.callback({ intersect: currentState, type: "exit" });
      } else if (currentState && lastState) {
        listener.callback({ intersect: currentState, type: "stay" });
      }
    });

    this.lastObjectStates = currentObjectStates;
  }
}
