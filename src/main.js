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
import Dropper from "./components/dropper.js";
import PlacableSpace from "./components/placableSpace.js";
import GamePlayManager from "./components/gameplayManager.js";

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
  await ResourceManager.loadTexture(
    "forceFieldTexture",
    "../textures/forceField.png"
  );

  // Load models.
  await ResourceManager.loadModel("table", "../models/table.fbx");
  await ResourceManager.loadModel("sea", "../models/sea.fbx");
  await ResourceManager.loadModel("magnet", "../models/magnet.fbx");
  await ResourceManager.loadModel("cursor", "../models/cursor.fbx");
  await ResourceManager.loadModel("forceField", "../models/forceField.fbx");

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
      overlayColor: { value: new THREE.Color(1.0, 1.0, 1.0, 1.0) },
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

  await ResourceManager.loadMaterial(
    "forceField",
    "../materials/forceFieldV.glsl",
    "../materials/forceFieldF.glsl",
    {
      baseTexture: { value: ResourceManager.getTexture("forceFieldTexture") },
      time: { value: 0 },
      opacity: { value: 0.5 },
      speed: { value: 0.5 },
      direction: { value: false },
      width: { value: 1 },
      length: { value: 1 },
    }
  );
}

async function createInitialScene() {
  const gamePlayManager = new GameObject(
    "GamePlayManager",
    [new GamePlayManager()],
    ["gamePlayManager"]
  );

  engine.instantiate(gamePlayManager);
  core.gamePlayManager = gamePlayManager.getComponent(GamePlayManager);

  const camera = new GameObject("Camera", [new CameraManager()], ["camera"]);
  camera.transform.setPosition(new Vector3(-4.7, 3.7, -4.5));
  camera.transform.setRotation(
    new Vector3(-2.324736956995415, -0.7327497832235694, -2.5226043559123186)
  );

  engine.instantiate(camera);

  const physicsPlane = new GameObject(
    "Plane",
    [
      new Renderer({
        geometry: new THREE.BoxGeometry(2.8, 0.1, 5.4),
        material: ResourceManager.getMaterial("toon"),
        hideOutline: true,
      }),
      new PhysicsBody({
        mass: 0,
        shape: {
          type: "box",
          width: 1.4,
          height: 0.1,
          depth: 2.7,
        },
        showGizmo: false,
      }),
      new PlacableSpace(),
    ],
    ["plane"]
  );

  physicsPlane.getComponent(Renderer).material.uniforms.baseColor.value =
    new THREE.Color(1, 1, 1, 1);

  physicsPlane.transform.setPosition(new Vector3(0, 0, -0.3));
  physicsPlane.transform.setRotation(new Vector3(0, 0, 0));
  physicsPlane.transform.setScale(new Vector3(1, 1, 1));
  physicsPlane.getComponent(Renderer).mesh.visible = false;

  engine.instantiate(physicsPlane);

  const boundary1 = new GameObject(
    "Boundary1",
    [
      new Renderer({
        geometry: new THREE.BoxGeometry(0.1, 0.18, 6),
        material: ResourceManager.getMaterial("toon"),
        hideOutline: true,
      }),
      new PhysicsBody({
        mass: 0,
        shape: {
          type: "box",
          width: 0.05,
          height: 0.15,
          depth: 2.7,
        },
        showGizmo: core.debugMode,
      }),
    ],
    ["boundary"]
  );
  const boundary2 = new GameObject(
    "Boundary1",
    [
      new Renderer({
        geometry: new THREE.BoxGeometry(0.1, 0.18, 6),
        material: ResourceManager.getMaterial("toon"),
        hideOutline: true,
      }),
      new PhysicsBody({
        mass: 0,
        shape: {
          type: "box",
          width: 0.05,
          height: 0.15,
          depth: 2.7,
        },
        showGizmo: core.debugMode,
      }),
    ],
    ["boundary"]
  );
  const boundary3 = new GameObject(
    "Boundary1",
    [
      new Renderer({
        geometry: new THREE.BoxGeometry(0.1, 0.18, 6),
        material: ResourceManager.getMaterial("toon"),
        hideOutline: true,
      }),
      new PhysicsBody({
        mass: 0,
        shape: {
          type: "box",
          width: 0.05,
          height: 0.15,
          depth: 1.4,
        },
        showGizmo: core.debugMode,
      }),
    ],
    ["boundary"]
  );
  const boundary4 = new GameObject(
    "Boundary1",
    [
      new Renderer({
        geometry: new THREE.BoxGeometry(0.1, 0.2, 6),
        material: ResourceManager.getMaterial("toon"),
        hideOutline: true,
      }),
      new PhysicsBody({
        mass: 0,
        shape: {
          type: "box",
          width: 0.05,
          height: 0.15,
          depth: 1.4,
        },
        showGizmo: core.debugMode,
      }),
    ],
    ["boundary"]
  );

  boundary1.transform.setPosition(new Vector3(-1.45, 0.25, -0.3));
  boundary1.transform.setRotation(new Vector3(0, 0, 0));
  boundary1.transform.setScale(new Vector3(1, 1, 1));
  boundary1.getComponent(Renderer).mesh.visible = false;

  boundary2.transform.setPosition(new Vector3(1.45, 0.25, -0.3));
  boundary2.transform.setRotation(new Vector3(0, 0, 0));
  boundary2.transform.setScale(new Vector3(1, 1, 1));
  boundary2.getComponent(Renderer).mesh.visible = false;

  boundary3.transform.setPosition(new Vector3(0, 0.25, -3));
  boundary3.transform.setRotation(new Vector3(0, Math.PI / 2, 0));
  boundary3.transform.setScale(new Vector3(1, 1, 1));
  boundary3.getComponent(Renderer).mesh.visible = false;

  boundary4.transform.setPosition(new Vector3(0, 0.25, 2.4));
  boundary4.transform.setRotation(new Vector3(0, Math.PI / 2, 0));
  boundary4.transform.setScale(new Vector3(1, 1, 1));
  boundary4.getComponent(Renderer).mesh.visible = false;

  engine.instantiate(boundary1);
  engine.instantiate(boundary2);
  engine.instantiate(boundary3);
  engine.instantiate(boundary4);

  const spawner = new GameObject("Spawner", [new ObjectSpawner()], ["spawner"]);

  engine.instantiate(spawner);

  const raycastManager = new GameObject(
    "RaycastManager",
    [
      new Raycast({
        camera: core.camera,
        objects: [physicsPlane.getComponent(Renderer).mesh],
      }),
    ],
    ["raycast"]
  );

  engine.instantiate(raycastManager);
  core.raycast = raycastManager.getComponent(Raycast);
  core.objectSpawner = spawner.getComponent(ObjectSpawner);

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
    [
      new Renderer({
        geometry: new THREE.PlaneGeometry(400, 400, 1000, 1000),
        material: seaMaterial,
      }),
    ],
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
    [new Renderer({ geometry: gearBackModel, material: shipMaterial })],
    ["airship"]
  );

  const gearBottom = new GameObject(
    "AirshipGearBottom",
    [
      new Renderer({
        geometry: gearBottomModel,
        material: shipMaterial.clone(),
      }),
    ],
    ["airship"]
  );

  const gearSides = new GameObject(
    "AirshipGearSides",
    [
      new Renderer({
        geometry: gearSidesModel,
        material: shipMaterial.clone(),
      }),
    ],
    ["airship"]
  );

  const wheel = new GameObject(
    "AirshipWheel",
    [new Renderer({ geometry: wheelModel, material: shipMaterial.clone() })],
    ["airship"]
  );

  const wingL = new GameObject(
    "AirshipWingL",
    [new Renderer({ geometry: wingLModel, material: shipMaterial.clone() })],
    ["airship"]
  );

  const wingR = new GameObject(
    "AirshipWingR",
    [new Renderer({ geometry: wingRModel, material: shipMaterial.clone() })],
    ["airship"]
  );

  const body = new GameObject(
    "AirshipBody",
    [
      new Renderer({ geometry: bodyModel, material: shipMaterial.clone() }),
      new Airship(wingL, wingR, gearSides, gearBottom, gearBack, wheel),
    ],
    ["airship"]
  );

  const exhaust = new GameObject(
    "AirshipExhaust",
    [new Renderer({ geometry: exhaustModel, material: shipMaterial.clone() })],
    ["airship"]
  );

  const capacitor = new GameObject(
    "AirshipCapacitor",
    [
      new Renderer({
        geometry: capacitorModel,
        material: shipMaterial.clone(),
      }),
    ],
    ["airship"]
  );

  const dropper = new GameObject(
    "AirshipDropper",
    [
      new Renderer({
        geometry: dropperModel,
        material: shipMaterial.clone(),
        outlineOverride: 1.005,
      }),
      new Dropper(),
    ],
    ["airship"]
  );

  body.transform.setPosition(new Vector3(0, 0.1, 0));
  gearBack.transform.setPosition(new Vector3(0, -1.12, 0));
  gearBottom.transform.setPosition(new Vector3(0, -3, 1.9));
  gearSides.transform.setPosition(new Vector3(0, -1.3, 0));
  wheel.transform.setPosition(new Vector3(0, 0, 0));
  wingL.transform.setPosition(new Vector3(3.5, -1.2, 0));
  wingR.transform.setPosition(new Vector3(-3.5, -1.2, 0));
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

export { createEnergySphere };
