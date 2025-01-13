import Component from "./component.js";
import { Vector2, Vector3 } from "three";
import GameObject from "../gameObject.js";
import Renderer from "./renderer.js";
import engine from "../engine.js";
import ResourceManager from "../resourceManager.js";
import PhysicsBody from "./physicsBody.js";
import core from "../core.js";
import * as THREE from "three";

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

  spawnObject(position, object) {
    switch (object) {
      case "magnet":
        const magnet = new GameObject(
          "Magnet",
          [
            new Renderer(this.models.magnet, this.materials.magnet, 1.15),
            new PhysicsBody({
              mass: 0,
              shape: {
                type: "box",
                width: 0.2,
                height: 0.2,
                depth: 0.04,
              },
              showGizmo: core.debugMode,
            }),
          ],
          ["magnet"]
        );

        magnet.transform.setPosition(position);
        magnet.transform.setRotation(new Vector3(-Math.PI / 2, 0, 0));

        engine.instantiate(magnet);
        break;
      case "energySphere":
        createEnergySphere();
        break;
    }
  }
}

function createEnergySphere() {
  const material = ResourceManager.getMaterial("toon");
  material.uniforms.baseColor.value = new THREE.Color(0.2, 0.9, 1);
  material.uniforms.opacity.value = 0.8;
  material.uniforms.baseTexture.value =
    ResourceManager.getTexture("whiteTexture");

  const materialShell = material.clone();
  materialShell.uniforms.baseColor.value = new THREE.Color(0.4, 0.9, 1);
  materialShell.uniforms.opacity.value = 0.5;
  materialShell.depthWrite = false;

  const sphereShell = new GameObject(
    "EnergySphereShell",
    [new Renderer(new THREE.SphereGeometry(0.12, 12, 12), materialShell)],
    ["energySphere"]
  );

  sphereShell.getComponent(Renderer).mesh.renderOrder = 99;

  const sphere = new GameObject(
    "EnergySphere",
    [
      new Renderer(new THREE.SphereGeometry(0.08, 12, 12), material),
      new PhysicsBody({
        mass: 1,
        shape: { type: "sphere", radius: 0.08 },
      }),
      new EnergySphere({ shell: sphereShell }),
    ],
    ["energySphere"]
  );

  sphere.transform.setPosition(new Vector3(0, 1, 2));
  sphere.transform.setRotation(new Vector3(0, 0, 0));

  engine.instantiate(sphere);
  engine.instantiate(sphereShell);
}
