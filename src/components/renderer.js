import Component from "./component.js";
import * as THREE from "three";
import core from "../core.js";
import engine from "../engine.js";
import AmbientLight from "./light/ambientLight.js";
import DirectionalLight from "./light/directionalLight.js";

export default class Renderer extends Component {
  mesh = null;

  material = () => {
    return this.mesh.material;
  };
  geometry = () => {
    return this.mesh.geometry;
  };

  constructor(geometry, material) {
    super();

    if (!geometry || !material) {
      throw new Error("Renderer component requires a geometry and a material");
    }

    this.material = material;
    this.geometry = geometry;

    if (geometry.isObject3D) {
      this.geometry = geometry.children[0].geometry;
      this.mesh = new THREE.Mesh(geometry.children[0].geometry, this.material);

      core.createMesh(this.mesh);
    } else {
      this.geometry = geometry;
      this.mesh = new THREE.Mesh(this.geometry, this.material);

      core.createMesh(this.mesh);
    }
  }

  start() {}

  update() {
    this.mesh.position.set(
      this.gameObject.transform?.position.x,
      this.gameObject.transform?.position.y,
      this.gameObject.transform?.position.z
    );
    this.mesh.rotation.set(
      this.gameObject.transform?.rotation.x,
      this.gameObject.transform?.rotation.y,
      this.gameObject.transform?.rotation.z
    );
    this.mesh.scale.set(
      this.gameObject.transform?.scale.x,
      this.gameObject.transform?.scale.y,
      this.gameObject.transform?.scale.z
    );

    if (core.directionalLight) {
      const lightDirection =
        core.directionalLight.getComponent(DirectionalLight).light.target
          .position;
      lightDirection.sub(core.directionalLight.transform.position);

      lightDirection.normalize();

      this.updateUniform("time", core.time / 1000);

      this.updateUniform("lightDirection", lightDirection);

      this.updateUniform(
        "lightColor",
        core.directionalLight.getComponent(DirectionalLight).light.color
      );
      this.updateUniform(
        "lightIntensity",
        core.directionalLight.getComponent(DirectionalLight).light.intensity
      );
    }

    if (core.ambientLight) {
      this.updateUniform(
        "ambientColor",
        core.ambientLight.getComponent(AmbientLight).light.color
      );
      this.updateUniform(
        "ambientIntensity",
        core.ambientLight.getComponent(AmbientLight).light.intensity
      );
    }

    this.material.needsUpdate = true;
  }

  updateUniform(name, value) {
    if (this.material.uniforms?.hasOwnProperty(name)) {
      this.material.uniforms[name].value = value;
    }
  }

  destroy() {
    core.removeMesh(this.mesh);
  }
}
