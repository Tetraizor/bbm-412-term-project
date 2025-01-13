import engine from "./engine.js";
import core from "./core.js";

import { Vector3 } from "three";
import * as THREE from "three";
import * as CANNON from "cannon-es";

import GameObject from "./gameObject.js";
import Renderer from "./components/renderer.js";
import ObjectSpawner from "./components/objectSpawner.js";
import CameraManager from "./components/cameraManager.js";
import AmbientLight from "./components/light/ambientLight.js";
import DirectionalLight from "./components/light/directionalLight.js";
import PhysicsBody from "./components/physicsBody.js";

import ResourceManager from "./resourceManager.js";
import UIManager from "./uiManager.js";
import Raycast from "./components/raycast.js";
import Airship from "./components/airship.js";

const uiManager = new UIManager();

function prerender() {
  cumulativeFPS += core.fps;
  FPSCount++;

  cumulativeMS += core.deltaTime;
  MSCount++;
}

let cumulativeFPS = 0;
let FPSCount = 0;

let cumulativeMS = 0;
let MSCount = 0;

async function start() {
  await initializeEngine();
  await loadResources();
  await createInitialScene();
  await createTemporarySceneObjects();
}

async function initializeEngine() {
  await engine.initialize();
  core.addPreRenderHook(prerender);

  setInterval(() => {
    document.getElementById("fpsCounter").innerHTML = `FPS: ${Math.round(
      cumulativeFPS / FPSCount
    )}`;
    document.getElementById("deltaCounter").innerHTML = `Delta: ${Math.round(
      cumulativeMS / MSCount
    )}ms`;

    cumulativeFPS = 0;
    FPSCount = 0;

    cumulativeMS = 0;
    MSCount = 0;
  }, 100);
}

async function loadResources() {
  // Load textures.
  await ResourceManager.loadTexture(
    "debugTexture",
    "../textures/debug/texture_09.png"
  );
  await ResourceManager.loadTexture("cursor", "../textures/cursor.png");
  await ResourceManager.loadTexture("tableTexture", "../textures/table.png");
  await ResourceManager.loadTexture("whiteTexture", "../textures/white.png");
  await ResourceManager.loadTexture("magnetTexture", "../textures/magnet.png");
  await ResourceManager.loadTexture("heightMap", "../textures/heightMap.png");

  // Load models.
  await ResourceManager.loadModel("table", "../models/table.fbx");
  await ResourceManager.loadModel("sea", "../models/sea.fbx");
  await ResourceManager.loadModel("magnet", "../models/magnet.fbx");
  await ResourceManager.loadModel("cursor", "../models/cursor.fbx");

  // Load materials.
  await ResourceManager.loadMaterial(
    "toon",
    "../materials/toonV.glsl",
    "../materials/toonF.glsl",
    {
      lightDirection: { value: new THREE.Vector3(1, 1, 1).normalize() },
      lightIntensity: { value: 1 },
      lightColor: { value: new THREE.Color(1, 1, 1) },
      ambientIntensity: { value: 0.0 },
      ambientColor: { value: new THREE.Color(1.0, 0.0, 0.2, 1.0) },
      baseTexture: { value: ResourceManager.getTexture("debugTexture") },
      baseColor: { value: new THREE.Color(1.0, 1.0, 1.0, 1.0) },
      time: { value: 0 },
      opacity: { value: 1 },
    }
  );

  await ResourceManager.loadMaterial(
    "lambertian",
    "../materials/lambertianV.glsl",
    "../materials/lambertianF.glsl",
    {
      lightPosition: { value: new THREE.Vector3(10, 10, 10) },
      lightColor: { value: new THREE.Color(1, 1, 1) },
      lightIntensity: { value: 1 },
      lightDirection: { value: new THREE.Vector3(1, 1, 1).normalize() },
      diffuseColor: { value: new THREE.Color(0.5, 0.5, 1) },
      ambientColor: { value: new THREE.Color(0.2, 0.2, 0.2) },
      ambientIntensity: { value: 0.01 },
      baseColor: { value: new THREE.Color(0.4, 0, 0.2, 1.0) },
      baseTexture: { value: ResourceManager.getTexture("debugTexture") },
      time: { value: 0 },
      opacity: { value: 1 },
    }
  );

  await ResourceManager.loadMaterial(
    "sea",
    "../materials/seaV.glsl",
    "../materials/seaF.glsl",
    {
      lightDirection: { value: new THREE.Vector3(1, 1, 1).normalize() },
      lightColor: { value: new THREE.Color(1, 1, 1) },
      lightIntensity: { value: 1 },
      ambientColor: { value: new THREE.Color(0.2, 0.2, 0.2) },
      ambientIntensity: { value: 0.0 },
      baseColor: { value: new THREE.Color(1.0, 1.0, 1.0, 1.0) },
      baseTexture: { value: ResourceManager.getTexture("debugTexture") },
      time: { value: 0 },
      opacity: { value: 1 },
      heightMap: { value: ResourceManager.getTexture("heightMap") },
    }
  );

  await ResourceManager.loadMaterial(
    "outline",
    "../materials/outlineV.glsl",
    "../materials/outlineF.glsl",
    {
      outlineThickness: { value: 0.02 },
      curvatureFactor: { value: 0.5 },
      distanceFactor: { value: 0.1 },
      outlineColor: { value: new THREE.Color(0.15, 0.15, 0.1) },
      // outlineColor: { value: new THREE.Color(1.0, 1.0, 1.0) },
    }
  );
}

async function createInitialScene() {
  const camera = new GameObject("Camera", [new CameraManager()], ["camera"]);
  camera.transform.setPosition(new Vector3(-4.7, 3.7, -4.5));
  camera.transform.setRotation(
    new Vector3(-2.324736956995415, -0.7327497832235694, -2.5226043559123186)
  );

  engine.instantiate(camera);

  const physicsPlane = new GameObject(
    "Plane",
    [
      new Renderer(
        new THREE.BoxGeometry(3, 0.1, 5.6),
        ResourceManager.getMaterial("lambertian")
      ),
      new PhysicsBody({
        mass: 0,
        shape: {
          type: "box",
          width: 1.5,
          height: 0.1,
          depth: 2.8,
        },
        showGizmo: false,
      }),
    ],
    ["plane"]
  );

  physicsPlane.getComponent(Renderer).material.uniforms.baseColor.value =
    new THREE.Color(1, 1, 1, 1);

  physicsPlane.transform.setPosition(new Vector3(0, 0, -0.4));
  physicsPlane.transform.setRotation(new Vector3(0, 0, 0));
  physicsPlane.transform.setScale(new Vector3(1, 1, 1));
  physicsPlane.getComponent(Renderer).mesh.visible = false;

  engine.instantiate(physicsPlane);

  const spawner = new GameObject("Spawner", [new ObjectSpawner()], ["spawner"]);

  engine.instantiate(spawner);

  const raycastManager = new GameObject(
    "RaycastManager",
    [
      new Raycast({
        camera: core.camera,
        objects: [physicsPlane.getComponent(Renderer).mesh],
        objectSpawner: spawner,
      }),
    ],
    ["raycast"]
  );

  engine.instantiate(raycastManager);

  const directionalLight = new GameObject(
    "DirectionalLight",
    [new DirectionalLight({ color: new THREE.Color(1, 1, 1), intensity: 0.5 })],
    ["directionalLight"]
  );

  directionalLight.transform.setPosition(new Vector3(0, 0, 0));
  directionalLight.transform.setRotation(
    new Vector3(-Math.PI / 4, 0, -Math.PI / 4)
  );

  const ambientLight = new GameObject(
    "AmbientLight",
    [
      new AmbientLight({
        color: new THREE.Color(240 / 255, 221 / 255, 180 / 255),
        intensity: 0.5,
      }),
    ],
    ["ambientLight"]
  );

  engine.instantiate(ambientLight);
  engine.instantiate(directionalLight);

  core.ambientLight = ambientLight;
  core.directionalLight = directionalLight;
}

async function createTemporarySceneObjects() {
  const lambertianMaterial = ResourceManager.getMaterial("lambertian");
  const toonMaterial = ResourceManager.getMaterial("toon");
  const seaMaterial = ResourceManager.getMaterial("sea");

  const sea = new GameObject(
    "Sea",
    [new Renderer(new THREE.PlaneGeometry(400, 400, 1000, 1000), seaMaterial)],
    ["sea"]
  );
  sea.transform.setPosition(new Vector3(0, -8, 0));
  sea.transform.setRotation(new Vector3(-Math.PI / 2, 0, 0));

  engine.instantiate(sea);

  const debugTexture = ResourceManager.getTexture("debugTexture");
  debugTexture.wrapS = THREE.RepeatWrapping;
  debugTexture.wrapT = THREE.RepeatWrapping;
  debugTexture.repeat.set(10, 10);

  await createAirship();
}

async function createAirship() {
  await ResourceManager.loadModel("airship", "../models/airship.fbx");
  const group = ResourceManager.getModel("airship");

  const bodyModel = group.children.find((child) => child.name === "body");
  const gearBackModel = group.children.find(
    (child) => child.name === "gear_back"
  );
  const gearBottomModel = group.children.find(
    (child) => child.name === "gear_bottom"
  );
  const gearSidesModel = group.children.find(
    (child) => child.name === "gear_sides"
  );
  const wheelModel = group.children.find((child) => child.name === "wheel");
  const wingLModel = group.children.find((child) => child.name === "wing_l");
  const wingRModel = group.children.find((child) => child.name === "wing_r");
  const exhaustModel = group.children.find((child) => child.name === "exhaust");
  const capacitorModel = group.children.find(
    (child) => child.name === "capacitor"
  );
  const dropperModel = group.children.find((child) => child.name === "dropper");

  await ResourceManager.loadTexture(
    "airshipTexture",
    "../textures/airship.png"
  );
  const airshipTexture = ResourceManager.getTexture("airshipTexture");
  airshipTexture.magFilter = THREE.NearestFilter;
  airshipTexture.minFilter = THREE.NearestFilter;

  const shipMaterial = ResourceManager.getMaterial("toon");
  shipMaterial.side = THREE.DoubleSide;
  shipMaterial.uniforms.baseTexture.value = airshipTexture;

  const gearBack = new GameObject(
    "AirshipGearBack",
    [new Renderer(gearBackModel, shipMaterial)],
    ["airship"]
  );

  const gearBottom = new GameObject(
    "AirshipGearBottom",
    [new Renderer(gearBottomModel, shipMaterial)],
    ["airship"]
  );

  const gearSides = new GameObject(
    "AirshipGearSides",
    [new Renderer(gearSidesModel, shipMaterial)],
    ["airship"]
  );

  const wheel = new GameObject(
    "AirshipWheel",
    [new Renderer(wheelModel, shipMaterial)],
    ["airship"]
  );

  const wingL = new GameObject(
    "AirshipWingL",
    [new Renderer(wingLModel, shipMaterial)],
    ["airship"]
  );

  const wingR = new GameObject(
    "AirshipWingR",
    [new Renderer(wingRModel, shipMaterial)],
    ["airship"]
  );

  const body = new GameObject(
    "AirshipBody",
    [
      new Renderer(bodyModel, shipMaterial),
      new Airship(wingL, wingR, gearSides, gearBottom, gearBack, wheel),
    ],
    ["airship"]
  );

  const exhaust = new GameObject(
    "AirshipExhaust",
    [new Renderer(exhaustModel, shipMaterial)],
    ["airship"]
  );

  const capacitor = new GameObject(
    "AirshipCapacitor",
    [new Renderer(capacitorModel, shipMaterial)],
    ["airship"]
  );

  const dropper = new GameObject(
    "AirshipDropper",
    [new Renderer(dropperModel, shipMaterial)],
    ["airship"]
  );

  body.transform.setPosition(new Vector3(0, 0.1, 0));
  gearBack.transform.setPosition(new Vector3(0, -1.12, 0));
  gearBottom.transform.setPosition(new Vector3(0, -3, 1.9));
  gearSides.transform.setPosition(new Vector3(0, -1.3, 0));
  wheel.transform.setPosition(new Vector3(0, 0, 0));
  wingL.transform.setPosition(new Vector3(3.5, -1.5, 0));
  wingR.transform.setPosition(new Vector3(-3.5, -1.5, 0));
  exhaust.transform.setPosition(new Vector3(0, 0, 0));
  capacitor.transform.setPosition(new Vector3(0, 0, 0));
  dropper.transform.setPosition(new Vector3(0, 0, 0));

  body.transform.setRotation(new Vector3(-Math.PI / 2, 0, Math.PI / 2));
  gearBack.transform.setRotation(new Vector3(-Math.PI / 2, 0, Math.PI / 2));
  gearBottom.transform.setRotation(new Vector3(-Math.PI / 2, 0, Math.PI / 2));
  gearSides.transform.setRotation(new Vector3(-Math.PI / 2, 0, Math.PI / 2));
  wheel.transform.setRotation(new Vector3(-Math.PI / 2, 0, Math.PI / 2));
  wingL.transform.setRotation(new Vector3(-Math.PI / 2, 0, Math.PI / 2));
  wingR.transform.setRotation(new Vector3(-Math.PI / 2, 0, Math.PI / 2));
  exhaust.transform.setRotation(new Vector3(-Math.PI / 2, 0, Math.PI / 2));
  capacitor.transform.setRotation(new Vector3(-Math.PI / 2, 0, Math.PI / 2));
  dropper.transform.setRotation(new Vector3(-Math.PI / 2, 0, Math.PI / 2));

  engine.instantiate(body);
  engine.instantiate(gearBack);
  engine.instantiate(gearBottom);
  engine.instantiate(gearSides);
  engine.instantiate(wheel);
  engine.instantiate(wingL);
  engine.instantiate(wingR);
  engine.instantiate(exhaust);
  engine.instantiate(capacitor);
  engine.instantiate(dropper);
}

await start();
