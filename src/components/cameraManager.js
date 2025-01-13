import * as THREE from "three";

import Component from "./component.js";
import core from "../core.js";

import { Vector3 } from "three";

export default class CameraManager extends Component {
  coreCamera = null;
  velocity = new Vector3(0, 0, 0); // Velocity for smooth movement
  acceleration = 15; // Acceleration rate (units per second squared)
  deceleration = 25; // Deceleration rate (units per second squared)
  maxSpeed = 2; // Maximum speed (units per second)
  keys = {}; // To track key states

  mouseStart = { x: 0, y: 0 };
  mouseLastPosition = { x: 0, y: 0 };
  mouseDelta = { x: 0, y: 0 };
  isDragging = false;

  constructor() {
    super();
  }

  start() {
    this.coreCamera = core.camera;

    this.coreCamera.position.set(
      this.gameObject.transform.position.x,
      this.gameObject.transform.position.y,
      this.gameObject.transform.position.z
    );
    this.coreCamera.rotation.set(
      this.gameObject.transform.rotation.x,
      this.gameObject.transform.rotation.y,
      this.gameObject.transform.rotation.z
    );

    this.coreCamera.fov = 75;
    this.coreCamera.near = 0.01;
    this.coreCamera.far = 100;

    this.coreCamera.updateProjectionMatrix();

    document.addEventListener("keydown", (event) => {
      this.keys[event.key] = true;
    });

    document.addEventListener("keyup", (event) => {
      this.keys[event.key] = false;
    });

    document.getElementById("webgl").addEventListener("mousedown", (event) => {
      if (event.button === 2) {
        // Right mouse button
        this.mouseStart.x = event.clientX;
        this.mouseStart.y = event.clientY;

        this.isDragging = true;
      }
    });

    document.getElementById("webgl").addEventListener("mouseup", (event) => {
      if (event.button === 2) {
        // Right mouse button
        this.isDragging = false;
      }
    });

    document.getElementById("webgl").addEventListener("mousemove", (event) => {
      if (this.isDragging) {
        // Calculate mouse delta for both X and Y axes
        this.mouseDelta.x = event.clientX - this.mouseStart.x; // Horizontal movement (left-right)
        this.mouseDelta.y = event.clientY - this.mouseStart.y; // Vertical movement (up-down)

        // Calculate the change in pitch and yaw based on mouse delta
        const pitchChange = -this.mouseDelta.y * 0.002;
        const yawChange = -this.mouseDelta.x * 0.002;

        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(this.coreCamera.quaternion);
        forward.normalize();

        const right = new THREE.Vector3(1, 0, 0);
        right.applyQuaternion(this.coreCamera.quaternion);
        right.normalize();

        const up = new THREE.Vector3(0, 1, 0);
        up.applyQuaternion(this.coreCamera.quaternion);
        up.normalize();

        // Calculate the new pitch and yaw angles
        forward.applyAxisAngle(right, pitchChange);
        forward.applyAxisAngle(up, yawChange);

        this.coreCamera.lookAt(forward.clone().add(this.coreCamera.position));

        // Update mouse start position for next movement
        this.mouseStart.x = event.clientX;
        this.mouseStart.y = event.clientY;
      }
    });
  }

  update() {
    if (this.coreCamera == undefined || this.coreCamera == null) return;

    const deltaTime = core.deltaTime / 1000;

    // Get the forward, right, and up directions from the camera's local space
    const forward = new THREE.Vector3();
    this.coreCamera.getWorldDirection(forward); // Forward vector in world space
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, this.coreCamera.up); // Right vector (perpendicular to forward and up)
    right.normalize();

    const up = new THREE.Vector3();
    up.crossVectors(right, forward); // Up vector (perpendicular to forward and right)
    up.normalize();

    // Update velocity based on input and relative directions
    let movementVector = new THREE.Vector3();
    movementVector = forward
      .clone()
      .multiplyScalar((this.keys["w"] ? 1 : 0) - (this.keys["s"] ? 1 : 0))
      .add(
        right
          .clone()
          .multiplyScalar((this.keys["d"] ? 1 : 0) - (this.keys["a"] ? 1 : 0))
      );

    this.velocity.add(
      movementVector.multiplyScalar(this.acceleration * deltaTime)
    );

    // Decelerate when no keys are pressed
    if (
      !(this.keys["w"] || this.keys["s"] || this.keys["a"] || this.keys["d"])
    ) {
      const decelerationVector = this.velocity
        .clone()
        .normalize()
        .multiplyScalar(this.deceleration * deltaTime);
      decelerationVector.multiplyScalar(5);
      this.velocity.sub(decelerationVector);

      // Clamp velocity to zero when below a threshold
      if (this.velocity.length() < decelerationVector.length()) {
        this.velocity.set(0, 0, 0);
      }
    }

    // Clamp velocity to maxSpeed
    if (this.velocity.length() > this.maxSpeed) {
      this.velocity.normalize().multiplyScalar(this.maxSpeed);
    }

    // Update position using velocity
    this.gameObject.transform.position.x += this.velocity.x * deltaTime;
    this.gameObject.transform.position.y += this.velocity.y * deltaTime;
    this.gameObject.transform.position.z += this.velocity.z * deltaTime;

    if (this.gameObject.transform.position.x < -9)
      this.gameObject.transform.position.x = -9;
    if (this.gameObject.transform.position.x > 9)
      this.gameObject.transform.position.x = 9;
    if (this.gameObject.transform.position.z < -9)
      this.gameObject.transform.position.z = -9;
    if (this.gameObject.transform.position.z > 9)
      this.gameObject.transform.position.z = 9;
    if (this.gameObject.transform.position.y < -9)
      this.gameObject.transform.position.y = -9;
    if (this.gameObject.transform.position.y > 9)
      this.gameObject.transform.position.y = 9;

    // Update camera position and rotation
    this.coreCamera.position.set(
      this.gameObject.transform.position.x,
      this.gameObject.transform.position.y,
      this.gameObject.transform.position.z
    );

    this.gameObject.transform.setRotation(
      new Vector3(
        this.coreCamera.rotation.x,
        this.coreCamera.rotation.y,
        this.coreCamera.rotation.z
      )
    );
  }

  projectVector(velocity, forward) {
    const velocityVec = new THREE.Vector3(velocity.x, velocity.y, velocity.z);
    const forwardVec = new THREE.Vector3(forward.x, forward.y, forward.z);

    // Ensure the forward vector is normalized
    forwardVec.normalize();

    // Compute the projection of velocity onto forward
    const projection = forwardVec
      .clone()
      .multiplyScalar(velocityVec.dot(forwardVec));

    return projection;
  }
}
