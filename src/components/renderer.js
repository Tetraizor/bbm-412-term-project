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
      this.onPositionChanged(event.detail.position);
    });

    this.gameObject.transform.addListener("onRotationChanged", (event) => {
      this.onRotationChanged(event.detail.rotation);
    });

    this.gameObject.transform.addListener("onScaleChanged", (event) => {
      this.onScaleChanged(event.detail.scale);
    });

    this.onPositionChanged(this.gameObject.transform.position);
    this.onRotationChanged(this.gameObject.transform.rotation);
    this.onScaleChanged(this.gameObject.transform.scale);

    core.directionalLight.transform.addListener(
      "onPositionChanged",
      (event) => {
        this.onLightPropertyChanged();
      }
    );

    core.ambientLight.transform.addListener("onPositionChanged", (event) => {
      this.onLightPropertyChanged();
    });

    this.onLightPropertyChanged();
  }

  onLightPropertyChanged() {
    if (core.directionalLight) {
      const directionalLight =
        core.directionalLight.getComponent(DirectionalLight).light;
      const lightDirection = directionalLight.target.position;

      lightDirection.sub(core.directionalLight.transform.position);
      lightDirection.normalize();

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
    }
  }

  update() {
    this.updateUniform("time", core.time / 1000);
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
