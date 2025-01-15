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

    strongMagnetPositive: null,
    strongMagnetNegative: null,
    strongMagnetPositiveLambertian: null,
    strongMagnetNegativeLambertian: null,

    rampMaterial: null,
    rampLambertianMaterial: null,

    cubeMaterial: null,
    cubeLambertianMaterial: null,
  };

  models = {
    magnet: null,
    strongMagnet: null,
    cube: null,
    ramp: null,
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

    // Strong Magnets
    const strongMagnetTexturePositive = ResourceManager.getTexture(
      "strongPositiveMagnetTexture"
    );
    strongMagnetTexturePositive.magFilter =
      strongMagnetTexturePositive.minFilter = THREE.NearestFilter;

    const strongMagnetTextureNegative = ResourceManager.getTexture(
      "strongNegativeMagnetTexture"
    );
    strongMagnetTextureNegative.magFilter =
      strongMagnetTextureNegative.minFilter = THREE.NearestFilter;

    this.materials.strongMagnetPositive = ResourceManager.getMaterial("toon");
    this.materials.strongMagnetNegative =
      ResourceManager.getMaterial("toon").clone();

    this.materials.strongMagnetPositiveLambertian =
      ResourceManager.getMaterial("lambertian").clone();
    this.materials.strongMagnetNegativeLambertian =
      ResourceManager.getMaterial("lambertian").clone();
    this.materials.strongMagnetNegativeLambertian.uniforms.baseTexture.value =
      strongMagnetTextureNegative;
    this.materials.strongMagnetPositiveLambertian.uniforms.baseTexture.value =
      strongMagnetTexturePositive;

    this.models.strongMagnet =
      ResourceManager.getModel("strongMagnet").children[0].geometry;

    // Ramp
    this.models.ramp = ResourceManager.getModel("ramp").children[0].geometry;
    this.materials.rampMaterial = ResourceManager.getMaterial("toon");
    this.materials.rampMaterial.uniforms.baseTexture.value =
      ResourceManager.getTexture("metal");

    this.materials.rampLambertianMaterial =
      ResourceManager.getMaterial("lambertian");
    this.materials.rampLambertianMaterial.uniforms.baseTexture.value =
      ResourceManager.getTexture("metal");

    this.materials.rampMaterial.uniforms.baseTexture.value.wrapS =
      this.materials.rampMaterial.uniforms.baseTexture.value.wrapT =
        THREE.RepeatWrapping;

    this.materials.rampMaterial.uniforms.baseTexture.value.magFilter =
      this.materials.rampMaterial.uniforms.baseTexture.value.minFilter =
        THREE.NearestFilter;

    // Cube
    this.models.cube = ResourceManager.getModel("cube").children[0].geometry;
    this.materials.cubeMaterial = ResourceManager.getMaterial("toon");
    this.materials.cubeMaterial.uniforms.baseTexture.value =
      ResourceManager.getTexture("metal");
    this.materials.cubeMaterial.uniforms.baseTexture.value.wrapS =
      this.materials.cubeMaterial.uniforms.baseTexture.value.wrapT =
        THREE.RepeatWrapping;

    this.materials.cubeMaterial.uniforms.baseTexture.value.magFilter =
      this.materials.cubeMaterial.uniforms.baseTexture.value.minFilter =
        THREE.NearestFilter;

    this.materials.cubeLambertianMaterial =
      ResourceManager.getMaterial("lambertian");
    this.materials.cubeLambertianMaterial.uniforms.baseTexture.value =
      ResourceManager.getTexture("metal");
  }

  spawnObject(position, object) {
    switch (object.type) {
      case "magnet":
        return this.createMagnet({ position, object });
      case "strongMagnet":
        return this.createStrongMagnet({ position, object });
      case "energySphere":
        return this.createEnergySphere();
      case "ramp":
        return this.createRamp({ position, object });
      case "cube":
        return this.createCube({ position, object });
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

  createRamp({ position, object }) {
    core.audioManager.playSFX("metalPlace");

    const ramp = new GameObject(
      "Ramp",
      [
        new Renderer({
          geometry: this.models.ramp,
          material: this.materials.rampMaterial,
          lambertMaterial: this.materials.rampLambertianMaterial,
        }),
        new PhysicsBody({
          mass: 0,
          geometry: this.models.ramp,
          shape: { type: "custom" },
          showGizmo: core.debugMode,
        }),
      ],
      ["ramp"]
    );

    ramp.transform.setPosition(position);
    ramp.transform.setRotation(new Vector3(0, 0, 0));

    engine.instantiate(ramp);

    return ramp;
  }

  createCube({ position, object }) {
    core.audioManager.playSFX("metalPlace");

    const cube = new GameObject(
      "cube",
      [
        new Renderer({
          geometry: this.models.cube,
          material: this.materials.cubeMaterial,
          lambertMaterial: this.materials.cubeLambertianMaterial,
        }),
        new PhysicsBody({
          mass: 0,
          geometry: this.models.cube,
          shape: { type: "custom" },
          showGizmo: core.debugMode,
        }),
      ],
      ["cube"]
    );

    cube.transform.setPosition(position);
    cube.transform.setRotation(new Vector3(0, 0, 0));

    engine.instantiate(cube);

    return cube;
  }

  createStrongMagnet({ position, object }) {
    core.audioManager.playSFX("metalPlace");

    const magnetMaterial =
      object.properties.magnetType === "negative"
        ? this.materials.strongMagnetNegative.clone()
        : this.materials.strongMagnetPositive.clone();
    const magnetLambertMaterial =
      object.properties.magnetType === "negative"
        ? this.materials.strongMagnetNegativeLambertian.clone()
        : this.materials.strongMagnetPositiveLambertian.clone();

    const magnet = new GameObject(
      "Strong Magnet",
      [
        new Renderer({
          geometry: this.models.strongMagnet,
          outlineOverride: 1.05,
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
        new Magnet({
          type: object.properties.magnetType,
          strong: true,
          width: 0.5,
          height: 1.8,
        }),
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
