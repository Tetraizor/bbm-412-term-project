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

export default class ObjectSpawner extends Component {
  materials = {
    magnet: null,
  };

  models = {
    magnet: null,
  };

  constructor() {
    super();
  }

  start() {
    this.materials.magnet = ResourceManager.getMaterial("toon");
    this.models.magnet =
      ResourceManager.getModel("magnet").children[0].geometry;

    const magnetTexture = ResourceManager.getTexture("magnetTexture");
    magnetTexture.magFilter = magnetTexture.minFilter = THREE.NearestFilter;

    this.materials.magnet.uniforms.baseTexture.value =
      ResourceManager.getTexture("magnetTexture");
  }

  spawnObject(position, object, properties) {
    switch (object) {
      case "magnet":
        const magnet = new GameObject(
          "Magnet",
          [
            new Renderer({
              geometry: this.models.magnet,
              material: this.materials.magnet.clone(),
              outlineOverride: 1.15,
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
            new Magnet(properties.magnetType),
          ],
          ["magnet"]
        );

        magnet.transform.setPosition(position);
        magnet.transform.setRotation(new Vector3(-Math.PI / 2, 0, 0));

        engine.instantiate(magnet);

        return magnet;
        break;
      case "energySphere":
        return createEnergySphere();
        break;
    }
  }
}

function createEnergySphere() {
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

  return sphere;
}
