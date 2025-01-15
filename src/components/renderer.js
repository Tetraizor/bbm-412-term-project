import Component from "./component.js";
import * as THREE from "three";
import core from "../core.js";
import AmbientLight from "./light/ambientLight.js";
import DirectionalLight from "./light/directionalLight.js";
import ResourceManager from "../resourceManager.js";

export default class Renderer extends Component {
  mesh = null;
  material = null;
  outlineMesh = null;
  outlineMaterial = null;

  OUTLINE_THICKNESS = 1.01;
  outlineOverride = 1;

  defaultOverlayColor = new THREE.Vector3(1.4, 1.4, 1.4);

  defaultOutlineColor = new THREE.Vector3(0.15, 0.15, 0.1);
  highlightOutlineColor = new THREE.Vector3(1, 1, 0.5);

  targetOverlayColor = new THREE.Vector3(1, 1, 1);
  targetOutlineColor = new THREE.Vector3(1, 1, 1);

  constructor({
    geometry,
    material,
    outlineOverride = 1,
    hideOutline = false,
    defaultOverlayColor = new THREE.Vector3(1.4, 1.4, 1.4),
    highlightOutlineColor = new THREE.Vector3(1, 1, 0.5),
  }) {
    super();

    if (!geometry || !material) {
      throw new Error("Renderer component requires a geometry and a material");
    }

    this.material = material;
    this.outlineOverride = outlineOverride;
    this.hideOutline = hideOutline;
    this.defaultOverlayColor = defaultOverlayColor;
    this.highlightOutlineColor = highlightOutlineColor;

    if (geometry.isObject3D) {
      this.mesh = new THREE.Mesh(geometry.geometry, this.material);

      core.createMesh(this.mesh);
    } else {
      this.geometry = geometry;
      this.mesh = new THREE.Mesh(this.geometry, this.material);

      core.createMesh(this.mesh);
    }
  }

  onPositionChanged(position) {
    this.mesh.position.set(position.x, position.y, position.z);
    this.outlineMesh?.position.set(position.x, position.y, position.z);
  }

  onRotationChanged(rotation) {
    this.mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    this.outlineMesh?.rotation.set(rotation.x, rotation.y, rotation.z);
  }

  onScaleChanged(scale) {
    this.mesh.scale.set(scale.x, scale.y, scale.z);
    this.outlineMesh?.scale.set(scale.x, scale.y, scale.z);
    this.outlineMesh?.scale.multiplyScalar(
      this.OUTLINE_THICKNESS * this.outlineOverride
    );
  }

  start() {
    // Add outline shader
    if (!this.hideOutline) {
      const outlineMaterial = ResourceManager.getMaterial("outline", true);
      outlineMaterial.side = THREE.BackSide;
      outlineMaterial.uniforms.outlineThickness.value =
        1 - this.OUTLINE_THICKNESS * this.outlineOverride;
      outlineMaterial.uniforms.outlineColor.value = this.defaultOutlineColor;

      const outlineMesh = new THREE.Mesh(this.mesh.geometry, outlineMaterial);

      outlineMesh.position.copy(this.mesh.position);
      outlineMesh.rotation.copy(this.mesh.rotation);
      outlineMesh.scale.copy(this.mesh.scale);

      this.outlineMaterial = outlineMaterial;
      this.outlineMesh = outlineMesh;

      core.createMesh(outlineMesh);
    }

    if (this.material.uniforms.overlayColor) {
      this.material.uniforms.overlayColor.value = new THREE.Vector3(1, 1, 1);
      this.targetOverlayColor = new THREE.Vector3(1, 1, 1);
    }

    if (this.outlineMaterial?.uniforms.outlineColor) {
      this.outlineMaterial.uniforms.outlineColor.value =
        this.defaultOutlineColor;
      this.targetOutlineColor = this.defaultOutlineColor;
    }

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

  toggleOutline(state) {
    if (state) {
      this.targetOutlineColor = this.highlightOutlineColor;
      this.targetOverlayColor = this.defaultOverlayColor;
    } else {
      this.targetOutlineColor = new THREE.Vector3(0, 0, 0);
      this.targetOverlayColor = new THREE.Vector3(1, 1, 1);
    }
  }

  update() {
    if (this.outlineMaterial) {
      this.outlineMaterial.uniforms.outlineColor.value.lerp(
        this.targetOutlineColor,
        0.3
      );
    }

    if (this.material.uniforms.overlayColor) {
      this.material.uniforms.overlayColor.value.lerp(
        this.targetOverlayColor,
        0.3
      );
    }

    this.updateUniform("time", core.time / 1000);
  }

  updateUniform(name, value) {
    if (this.material.uniforms?.hasOwnProperty(name)) {
      this.material.uniforms[name].value = value;
    }
  }

  destroy() {
    super.destroy();

    core.removeMesh(this.mesh);
    core.removeMesh(this.outlineMesh);
  }
}
