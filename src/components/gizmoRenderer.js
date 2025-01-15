import * as THREE from "three";
import Component from "./component.js";
import core from "../core.js";

export default class GizmoRenderer extends Component {
  mesh = null;

  length = 1;
  width = 1;
  height = 1;
  radius = 1;

  color = 0xff0000;

  type = "arrow";

  arrow = null;
  plane = null;
  box = null;

  constructor(gizmo) {
    super();
    this.color = gizmo.color;
    this.length = gizmo.length;
    this.width = gizmo.width;
    this.height = gizmo.height;
    this.type = gizmo.type;
    this.radius = gizmo.radius;
  }

  createArrow() {
    this.arrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0),
      this.length,
      this.color
    );

    core.scene.add(this.arrow);

    this.gameObject.transform.addListener("onPositionChanged", (event) => {
      this.arrow.position.set(
        event.detail.position.x,
        event.detail.position.y,
        event.detail.position.z
      );
    });

    this.gameObject.transform.addListener("onRotationChanged", (event) => {
      this.arrow.rotation.set(
        event.detail.rotation.x,
        event.detail.rotation.y,
        event.detail.rotation.z
      );
    });

    this.gameObject.transform.addListener("onScaleChanged", (event) => {
      this.arrow.scale.set(
        event.detail.scale.x,
        event.detail.scale.y,
        event.detail.scale.z
      );
    });

    this.gameObject.transform.setPosition();
    this.gameObject.transform.setRotation();
    this.gameObject.transform.setScale();
  }

  createPlane() {
    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(this.length, this.width),
      new THREE.MeshBasicMaterial({
        color: this.color,
        side: THREE.DoubleSide,
        wireframe: true,
        wireframeLinewidth: 4,
      })
    );

    core.scene.add(this.plane);

    this.gameObject.transform.addListener("onPositionChanged", (event) => {
      this.plane.position.set(
        event.detail.position.x,
        event.detail.position.y,
        event.detail.position.z
      );
    });

    this.gameObject.transform.addListener("onRotationChanged", (event) => {
      this.plane.rotation.set(
        event.detail.rotation.x,
        event.detail.rotation.y,
        event.detail.rotation.z
      );
    });

    this.gameObject.transform.addListener("onScaleChanged", (event) => {
      this.plane.scale.set(
        event.detail.scale.x,
        event.detail.scale.y,
        event.detail.scale.z
      );
    });

    this.gameObject.transform.setPosition();
    this.gameObject.transform.setRotation();
    this.gameObject.transform.setScale();
  }

  createSphere() {
    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius, 32, 32),
      new THREE.MeshBasicMaterial({ color: this.color, wireframe: true })
    );

    core.scene.add(this.sphere);

    this.gameObject.transform.addListener("onPositionChanged", (event) => {
      this.sphere.position.set(
        event.detail.position.x,
        event.detail.position.y,
        event.detail.position.z
      );
    });

    this.gameObject.transform.addListener("onRotationChanged", (event) => {
      this.sphere.rotation.set(
        event.detail.rotation.x,
        event.detail.rotation.y,
        event.detail.rotation.z
      );
    });

    this.gameObject.transform.addListener("onScaleChanged", (event) => {
      this.sphere.scale.set(
        event.detail.scale.x,
        event.detail.scale.y,
        event.detail.scale.z
      );
    });

    this.gameObject.transform.setPosition();
    this.gameObject.transform.setRotation();
    this.gameObject.transform.setScale();
  }

  createBox() {
    this.box = new THREE.Mesh(
      new THREE.BoxGeometry(this.width, this.height, this.length, 4, 4, 4),
      new THREE.MeshBasicMaterial({ color: this.color, wireframe: true })
    );

    core.scene.add(this.box);

    this.gameObject.transform.addListener("onPositionChanged", (event) => {
      this.box.position.set(
        event.detail.position.x,
        event.detail.position.y,
        event.detail.position.z
      );
    });

    this.gameObject.transform.addListener("onRotationChanged", (event) => {
      this.box.rotation.set(
        event.detail.rotation.x,
        event.detail.rotation.y,
        event.detail.rotation.z
      );
    });

    this.gameObject.transform.addListener("onScaleChanged", (event) => {
      this.box.scale.set(
        event.detail.scale.x,
        event.detail.scale.y,
        event.detail.scale.z
      );
    });

    this.gameObject.transform.setPosition();
    this.gameObject.transform.setRotation();
    this.gameObject.transform.setScale();
  }

  start() {
    super.start();

    switch (this.type) {
      case "arrow":
        this.createArrow();
        break;
      case "plane":
        this.createPlane();
        break;
      case "box":
        this.createBox();
        break;
      case "sphere":
        this.createSphere();
        break;
    }
  }

  update() {
    super.update();
  }

  destroy() {
    super.destroy();

    switch (this.type) {
      case "arrow":
        core.scene.remove(this.arrow);
        break;
      case "plane":
        core.scene.remove(this.plane);
        break;
      case "box":
        core.scene.remove(this.box);
        break;
      case "sphere":
        core.scene.remove(this.sphere);
    }
  }
}
