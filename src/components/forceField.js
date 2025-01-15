import Component from "./component.js";
import Magnet from "./magnet.js";
import Renderer from "./renderer.js";
import core from "../core.js";
import ResourceManager from "../resourceManager.js";
import * as THREE from "three";
import { Vector3 } from "three";
import PhysicsBody from "./physicsBody.js";

export default class ForceField extends Component {
  renderer = null;
  magnet = null;
  mesh = null;
  material = null;
  body = null;

  fieldDirection = new Vector3(0, 0, 1);

  length = 3;
  width = 0.5;

  effectedList = [];

  constructor({ magnet, length = 2, width = 1 }) {
    super();

    this.magnet = magnet;
    this.length = length;
    this.width = width;

    const texture = ResourceManager.getTexture("forceFieldTexture");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);

    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    const material = ResourceManager.getMaterial("forceField");
    material.uniforms.width.value = this.width;
    material.uniforms.length.value = this.length;
    material.uniforms.baseTexture.value = texture;
    material.uniforms.opacity.value = 0.5;
    material.uniforms.direction.value = true;
    material.depthWrite = false;

    const model = ResourceManager.getModel("forceField").children[0].geometry;

    const mesh = new THREE.Mesh(model, material);
    mesh.renderOrder = 1;

    this.mesh = mesh;
    this.material = material;

    core.scene.add(mesh);
  }

  start() {
    this.renderer = this.gameObject.getComponent(Renderer);
    this.body = this.gameObject.getComponent(PhysicsBody).body;

    console.log(this.body);

    this.magnet.gameObject.transform.addListener(
      "onPositionChanged",
      (event) => {
        this.updateForceField({ position: event.detail.position });
      }
    );

    this.magnet.gameObject.transform.addListener(
      "onRotationChanged",
      (event) => {
        this.updateForceField({ rotation: event.detail.rotation });
      }
    );

    this.updateForceField();
    this.mesh.scale.set(this.length, this.width, 1);
  }

  update() {
    this.material.uniforms.time.value = core.time / 1000;
  }

  updateForceField({ position, rotation } = {}) {
    if (position) {
      const directionVector = new Vector3(
        Math.sin(this.magnet.gameObject.transform.rotation.z - Math.PI / 2),
        0,
        Math.cos(this.magnet.gameObject.transform.rotation.z - Math.PI / 2)
      );

      const forceFieldPosition = new Vector3(
        this.magnet.gameObject.transform.position.x,
        this.magnet.gameObject.transform.position.y,
        this.magnet.gameObject.transform.position.z
      ).add(directionVector.multiplyScalar(this.length / 2));

      this.gameObject.transform.setPosition(
        new Vector3(
          forceFieldPosition.x,
          forceFieldPosition.y,
          forceFieldPosition.z
        )
      );

      this.mesh.position.set(
        forceFieldPosition.x,
        forceFieldPosition.y,
        forceFieldPosition.z
      );
    }

    if (rotation) {
      this.mesh.rotation.set(
        this.magnet.gameObject.transform.rotation.x,
        this.magnet.gameObject.transform.rotation.y,
        this.magnet.gameObject.transform.rotation.z
      );

      this.gameObject.transform.setRotation(
        new Vector3(
          this.magnet.gameObject.transform.rotation.x,
          this.magnet.gameObject.transform.rotation.y,
          this.magnet.gameObject.transform.rotation.z
        )
      );

      this.fieldDirection = new Vector3(
        Math.sin(this.magnet.gameObject.transform.rotation.z - Math.PI / 2),
        0,
        Math.cos(this.magnet.gameObject.transform.rotation.z - Math.PI / 2)
      );
    }
  }

  registerSphere(sphere) {
    const sphereBody = sphere.gameObject.getComponent(PhysicsBody).body;

    core.world.addEventListener("beginContact", (event) => {
      const { bodyA, bodyB } = event;

      if (
        (bodyA === sphereBody && bodyB === this.body) ||
        (bodyB === sphereBody && bodyA === this.body)
      ) {
        this.effectedList.push(sphere);
      }
    });

    core.world.addEventListener("endContact", (event) => {
      const { bodyA, bodyB } = event;

      if (
        (bodyA === sphereBody && bodyB === this.body) ||
        (bodyB === sphereBody && bodyA === this.body)
      ) {
        if (this.effectedList.includes(sphere)) {
          this.effectedList.splice(this.effectedList.indexOf(sphere), 1);
        }
      }
    });
  }

  update() {
    this.material.uniforms.time.value = core.time / 1000;

    this.effectedList.forEach((sphere) => {
      sphere.physicsBody.body.applyForce(
        this.fieldDirection.normalize().multiplyScalar(0.5)
      );
    });
  }
}
