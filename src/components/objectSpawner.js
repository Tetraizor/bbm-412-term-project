import Component from "./component.js";
import { Vector2, Vector3 } from "three";
import GameObject from "../gameObject.js";
import Renderer from "./renderer.js";
import engine from "../engine.js";
import ResourceManager from "../resourceManager.js";
import PhysicsBody from "./physicsBody.js";
import core from "../core.js";
import * as THREE from "three";
import EnergySphere from "./energySphere.js";
import Magnet from "./magnet.js";
import Raycast from "./raycast.js";
import ForceField from "./forceField.js";

export default class ObjectSpawner extends Component {
  materials = {
    magnetPositive: null,
    magnetNegative: null,
    magnetPositiveLambertian: null,
    magnetNegativeLambertian: null,
  };

  models = {
    magnet: null,
  };

  constructor() {
    super();
  }

  start() {
    this.materials.magnetPositive = ResourceManager.getMaterial("toon");
    this.materials.magnetNegative = ResourceManager.getMaterial("toon").clone();

    this.materials.magnetPositiveLambertian =
      ResourceManager.getMaterial("lambertian").clone();
    this.materials.magnetNegativeLambertian =
      ResourceManager.getMaterial("lambertian").clone();
    this.materials.magnetNegativeLambertian.uniforms.baseTexture.value =
      ResourceManager.getTexture("negativeMagnetTexture");
    this.materials.magnetPositiveLambertian.uniforms.baseTexture.value =
      ResourceManager.getTexture("positiveMagnetTexture");

    this.models.magnet =
      ResourceManager.getModel("magnet").children[0].geometry;

    const magnetTexturePositive = ResourceManager.getTexture(
      "positiveMagnetTexture"
    );
    magnetTexturePositive.magFilter = magnetTexturePositive.minFilter =
      THREE.NearestFilter;

    this.materials.magnetPositive.uniforms.baseTexture.value =
      magnetTexturePositive;

    const magnetTextureNegative = ResourceManager.getTexture(
      "negativeMagnetTexture"
    );
    magnetTextureNegative.magFilter = magnetTextureNegative.minFilter =
      THREE.NearestFilter;

    this.materials.magnetNegative.uniforms.baseTexture.value =
      magnetTextureNegative;
  }

  spawnObject(position, object) {
    switch (object.type) {
      case "magnet":
        return this.createMagnet({ position, object });
      case "energySphere":
        return this.createEnergySphere();
    }
  }

  createMagnet({ position, object }) {
    core.audioManager.playSFX("metalPlace");

    const magnetMaterial =
      object.properties.magnetType === "negative"
        ? this.materials.magnetNegative.clone()
        : this.materials.magnetPositive.clone();
    const magnetLambertMaterial =
      object.properties.magnetType === "negative"
        ? this.materials.magnetNegativeLambertian.clone()
        : this.materials.magnetPositiveLambertian.clone();

    const magnet = new GameObject(
      "Magnet",
      [
        new Renderer({
          geometry: this.models.magnet,
          outlineOverride: 1.15,
          material: magnetMaterial,
          lambertMaterial: magnetLambertMaterial,
          defaultOverlayColor: new THREE.Vector3(1.8, 1.3, 1.3),
          highlightOutlineColor: new THREE.Vector3(1, 0.3, 0.3),
        }),
        new PhysicsBody({
          mass: 0,
          shape: {
            type: "box",
            width: 0.2,
            height: 0.17,
            depth: 0.05,
          },
          showGizmo: core.debugMode,
        }),
        new Magnet({ type: object.properties.magnetType }),
      ],
      ["magnet"]
    );

    magnet.transform.setPosition(position);
    magnet.transform.setRotation(new Vector3(-Math.PI / 2, 0, 0));

    engine.instantiate(magnet);

    return magnet;
  }

  createEnergySphere() {
    const material = ResourceManager.getMaterial("toon");
    material.uniforms.baseColor.value = new THREE.Color(0.7, 0.65, 0.65);
    material.uniforms.opacity.value = 1.0;
    material.uniforms.baseTexture.value =
      ResourceManager.getTexture("whiteTexture");

    const materialShell = material.clone();
    materialShell.uniforms.baseColor.value = new THREE.Color(3, 3, 1.6);
    materialShell.uniforms.opacity.value = 0.1;
    materialShell.depthWrite = false;
    material.uniforms.baseTexture.value =
      ResourceManager.getTexture("whiteTexture");

    const sphereShell = new GameObject(
      "EnergySphereShell",
      [
        new Renderer({
          geometry: new THREE.SphereGeometry(0.12, 12, 12),
          material: materialShell,
          lambertMaterial: ResourceManager.getMaterial("lambertian"),
        }),
      ],
      ["energySphere"]
    );

    sphereShell.getComponent(Renderer).mesh.renderOrder = 99;

    const sphere = new GameObject(
      "EnergySphere",
      [
        new Renderer({
          geometry: new THREE.SphereGeometry(0.08, 12, 12),
          material,
          lambertMaterial: ResourceManager.getMaterial("lambertian"),
        }),
        new PhysicsBody({
          mass: 1,
          shape: { type: "sphere", radius: 0.08 },
          showGizmo: core.debugMode,
        }),
        new EnergySphere({ shell: sphereShell }),
      ],
      ["energySphere"]
    );

    sphere.transform.setPosition(new Vector3(0, 1.45, 2.2));
    sphere.transform.setRotation(new Vector3(0, 0, 0));

    engine.instantiate(sphere);
    engine.instantiate(sphereShell);

    core.gamePlayManager.registerSphere(sphere.getComponent(EnergySphere));

    return sphere;
  }
}
