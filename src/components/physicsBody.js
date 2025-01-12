import Component from "./component.js";
import * as CANNON from "cannon-es";
import { Vector3, Euler, Quaternion } from "three";
import core from "../core.js";
import GizmoRenderer from "./gizmoRenderer.js";
import { getRandomHexColor } from "../utils/colorUtils.js";

export default class PhysicsBody extends Component {
  mass = 0;
  body = null;
  shape = null;
  shapeWrapper = null;
  showGizmo = false;

  constructor({ mass = 0, shape = null, showGizmo = false }) {
    super();

    this.mass = mass;
    this.showGizmo = showGizmo;
    this.shapeWrapper = shape;

    switch (shape.type) {
      case "box":
        this.shape = new CANNON.Box(
          new CANNON.Vec3(shape.width, shape.height, shape.depth)
        );
        break;
      case "sphere":
        this.shape = new CANNON.Sphere(shape.radius);
        break;
      case "plane":
        this.shape = new CANNON.Plane(new CANNON.Vec3());
        break;
    }

    this.body = new CANNON.Body({
      mass: this.mass,
      shape: this.shape,
    });

    core.world.addBody(this.body);

    switch (this.shape.type) {
    }
  }

  start() {
    switch (this.shapeWrapper.type) {
      case "box":
        if (this.showGizmo) {
          this.gameObject.addComponent(
            new GizmoRenderer({
              color: getRandomHexColor(),
              type: "box",
              width: this.shapeWrapper.width * 2,
              height: this.shapeWrapper.height * 2,
              length: this.shapeWrapper.depth * 2,
            })
          );
        }
        break;
      case "sphere":
        if (this.showGizmo) {
          this.gameObject.addComponent(
            new GizmoRenderer({
              color: getRandomHexColor(),
              type: "sphere",
              radius: this.shape.radius,
            })
          );
        }
        break;
      case "plane":
        if (this.showGizmo) {
          this.gameObject.addComponent(
            new GizmoRenderer({
              color: getRandomHexColor(),
              type: "plane",
              width: 1,
              height: 1,
            })
          );
        }
        break;
    }

    this.gameObject.transform.addListener("onPositionChanged", (event) => {
      if (event.detail.source === "physicsBody") return;

      this.body.position.set(
        event.detail.position.x,
        event.detail.position.y,
        event.detail.position.z
      );
    });

    this.gameObject.transform.addListener("onRotationChanged", (event) => {
      if (event.detail.source === "physicsBody") return;

      this.body.quaternion.setFromEuler(
        event.detail.rotation.x,
        event.detail.rotation.y,
        event.detail.rotation.z
      );
    });

    this.body.position.set(
      this.gameObject.transform.position.x,
      this.gameObject.transform.position.y,
      this.gameObject.transform.position.z
    );

    this.body.quaternion.setFromEuler(
      this.gameObject.transform.rotation.x,
      this.gameObject.transform.rotation.y,
      this.gameObject.transform.rotation.z
    );
  }

  update() {
    this.gameObject.transform.setPosition(
      new Vector3(
        this.body.position.x,
        this.body.position.y,
        this.body.position.z
      ),
      "physicsBody"
    );

    this.gameObject.transform.setRotation(
      new Euler().setFromQuaternion(
        new Quaternion(
          this.body.quaternion.x,
          this.body.quaternion.y,
          this.body.quaternion.z,
          this.body.quaternion.w
        )
      ),
      "physicsBody"
    );
  }
}
