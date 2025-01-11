import Component from "./component.js";
import * as CANNON from "cannon-es";
import { Vector3, Euler, Quaternion } from "three";
import core from "../core.js";
import GizmoRenderer from "./gizmoRenderer.js";

export default class PhysicsBody extends Component {
  mass = 0;
  body = null;
  shape = null;
  shapeWrapper = null;

  constructor({ mass = 0, shape = null, showGizmo = false }) {
    super();

    this.mass = mass;

    if (showGizmo) {
      const gizmo = new GizmoRenderer(0x00ff00, 1);
      this.gameObject.addComponent(gizmo);
    }

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
        this.gameObject.addComponent(
          new GizmoRenderer({
            color: 0x00ff00,
            type: "box",
            width: this.shape.halfExtents.x * 2,
            height: this.shape.halfExtents.y * 2,
            depth: this.shape.halfExtents.z * 2,
          })
        );
        break;
      case "sphere":
        this.gameObject.addComponent(
          new GizmoRenderer({
            color: 0x00ff00,
            type: "sphere",
            radius: this.shape.radius,
          })
        );
        break;
      case "plane":
        this.gameObject.addComponent(
          new GizmoRenderer({
            color: 0x00ff00,
            type: "plane",
            width: 1,
            height: 1,
          })
        );
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
    this.body.velocity.set(1, this.body.velocity.y, this.body.velocity.z);

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
