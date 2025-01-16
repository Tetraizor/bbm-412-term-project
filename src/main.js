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
import Lava from "./components/lava.js";

import ResourceManager from "./resourceManager.js";
import UIManager from "./uiManager.js";
import Raycast from "./components/raycast.js";
import Airship from "./components/airship.js";
import Dropper from "./components/dropper.js";
import PlacableSpace from "./components/placableSpace.js";
import GamePlayManager from "./components/gameplayManager.js";
import Vacuum from "./components/vacuum.js";
import AudioManager from "./components/audioManager.js";

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

  const level = new URLSearchParams(window.location.search).get("level");
  if (level) {
    createLevel(level);
  } else {
    createLevel(1);
  }
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
  await ResourceManager.loadTexture(
    "positiveMagnetTexture",
    "../textures/magnetPositive.png"
  );
  await ResourceManager.loadTexture(
    "negativeMagnetTexture",
    "../textures/magnetNegative.png"
  );
  await ResourceManager.loadTexture("heightMap", "../textures/heightMap.png");
  await ResourceManager.loadTexture(
    "forceFieldTexture",
    "../textures/forceField.png"
  );
  await ResourceManager.loadTexture("lava", "../textures/lava.jpg");
  await ResourceManager.loadTexture(
    "strongPositiveMagnetTexture",
    "../textures/positiveStrongMagnet.png"
  );
  await ResourceManager.loadTexture(
    "strongNegativeMagnetTexture",
    "../textures/negativeStrongMagnet.png"
  );
  await ResourceManager.loadTexture("metal", "../textures/metal.jpg");
  await ResourceManager.loadTexture("names", "../textures/names.jpg");

  // Load models.
  await ResourceManager.loadModel("table", "../models/table.fbx");
  await ResourceManager.loadModel("sea", "../models/sea.fbx");
  await ResourceManager.loadModel("magnet", "../models/magnet.fbx");
  await ResourceManager.loadModel("cursor", "../models/cursor.fbx");
  await ResourceManager.loadModel("forceField", "../models/forceField.fbx");
  await ResourceManager.loadModel("cone", "../models/cone.fbx");
  await ResourceManager.loadModel("lava1", "../models/lava1.fbx");
  await ResourceManager.loadModel("lava2", "../models/lava2.fbx");
  await ResourceManager.loadModel("strongMagnet", "../models/strongMagnet.fbx");
  await ResourceManager.loadModel("cube", "../models/cube.fbx");
  await ResourceManager.loadModel("ramp", "../models/ramp.fbx");
  await ResourceManager.loadModel("names", "../models/names.fbx");

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
      textureOffset: { value: new THREE.Vector2(0, 0) },
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
      ambientColor: { value: new THREE.Color(0.2, 0.2, 0.2) },
      ambientIntensity: { value: 0.01 },
      baseColor: { value: new THREE.Color(1.0, 1.0, 1.0) },
      baseTexture: { value: ResourceManager.getTexture("whiteTexture") },
      overlayColor: { value: new THREE.Color(1.0, 1.0, 1.0, 1.0) },
      textureOffset: { value: new THREE.Vector2(0, 0) },
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
      overlayColor: { value: new THREE.Color(1.0, 1.0, 1.0, 1.0) },
      textureOffset: { value: new THREE.Vector2(0, 0) },
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
      overlayColor: { value: new THREE.Color(1.0, 1.0, 1.0, 1.0) },
      outlineColor: { value: new THREE.Color(0.15, 0.15, 0.1) },
      textureOffset: { value: new THREE.Vector2(0, 0) },
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
      overlayColor: { value: new THREE.Color(1.0, 1.0, 1.0, 1.0) },
      length: { value: 1 },
    }
  );
}

async function createInitialScene() {
  core.uiManager = new UIManager();

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
        lambertMaterial: ResourceManager.getMaterial("lambertian"),
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

  const physicsPlane2 = new GameObject(
    "Plane",
    [
      new Renderer({
        geometry: new THREE.BoxGeometry(2.8, 0.1, 5.4),
        material: ResourceManager.getMaterial("toon"),
        lambertMaterial: ResourceManager.getMaterial("lambertian"),
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

  physicsPlane2.getComponent(Renderer).material.uniforms.baseColor.value =
    new THREE.Color(1, 1, 1, 1);

  physicsPlane2.transform.setPosition(new Vector3(4, 0, -0.3));
  physicsPlane2.transform.setRotation(new Vector3(0, 0, 0));
  physicsPlane2.transform.setScale(new Vector3(1, 1, 1));
  physicsPlane2.getComponent(Renderer).mesh.visible = false;

  engine.instantiate(physicsPlane2);

  const boundary1 = new GameObject(
    "Boundary1",
    [
      new Renderer({
        geometry: new THREE.BoxGeometry(0.1, 0.18, 6),
        material: ResourceManager.getMaterial("toon"),
        lambertMaterial: ResourceManager.getMaterial("lambertian"),
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
        lambertMaterial: ResourceManager.getMaterial("lambertian"),
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
        lambertMaterial: ResourceManager.getMaterial("lambertian"),
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
        lambertMaterial: ResourceManager.getMaterial("lambertian"),
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

  const audioManager = new GameObject(
    "AudioManager",
    [new AudioManager()],
    ["audioManager"]
  );

  engine.instantiate(audioManager);
  core.audioManager = audioManager.getComponent(AudioManager);

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

  const vacuum = new GameObject(
    "Vacuum",
    [
      new PhysicsBody({
        mass: 0,
        shape: {
          type: "box",
          width: 0.3,
          height: 0.3,
          depth: 0.3,
        },
        showGizmo: core.debugMode,
        collisionResponse: false,
      }),
      new Vacuum(),
    ],
    ["vacuum"]
  );

  vacuum.transform.setPosition(new Vector3(-1, 0.4, -2.5));

  engine.instantiate(vacuum);

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

  const namesModel = ResourceManager.getModel("names");
  const namesMaterial = ResourceManager.getMaterial("toon").clone();
  namesMaterial.uniforms.baseColor.value = new THREE.Color(1, 0.4, 0.4);
  namesMaterial.uniforms.baseTexture.value =
    ResourceManager.getTexture("names");

  const namesMaterialLambert =
    ResourceManager.getMaterial("lambertian").clone();
  namesMaterialLambert.uniforms.baseColor.value = new THREE.Color(1, 0.4, 0.4);
  namesMaterialLambert.uniforms.baseTexture.value =
    ResourceManager.getTexture("names");

  const names = new GameObject(
    "Names",
    [
      new Renderer({
        geometry: namesModel.children[0].geometry,
        material: namesMaterial,
        lambertMaterial: namesMaterialLambert,
        hideOutline: true,
      }),
    ],
    ["names"]
  );

  names.transform.setPosition(new Vector3(10, 10, 10));
  names.transform.setRotation(new Vector3(-Math.PI / 2, 0, 0));
  names.transform.setScale(new Vector3(1, 1, 1));

  engine.instantiate(names);
}

async function createTemporarySceneObjects() {
  const seaMaterial = ResourceManager.getMaterial("sea");
  seaMaterial.transparent = true;
  seaMaterial.zWrite = false;

  const sea = new GameObject(
    "Sea",
    [
      new Renderer({
        geometry: new THREE.PlaneGeometry(400, 400, 1000, 1000),
        material: seaMaterial,
        lambertMaterial: seaMaterial,
      }),
    ],
    ["sea"]
  );
  sea.transform.setPosition(new Vector3(0, -8, 0));
  sea.transform.setRotation(new Vector3(-Math.PI / 2, 0, 0));

  sea.getComponent(Renderer).mesh.renderOrder = 999;

  engine.instantiate(sea);

  core.cloud = sea;

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

  const shipLambertianMaterial = ResourceManager.getMaterial("lambertian");

  shipLambertianMaterial.side = THREE.DoubleSide;
  shipLambertianMaterial.uniforms.baseTexture.value = airshipTexture;

  const gearBack = new GameObject(
    "AirshipGearBack",
    [
      new Renderer({
        geometry: gearBackModel,
        material: shipMaterial,
        lambertMaterial: shipLambertianMaterial,
      }),
    ],
    ["airship"]
  );

  const gearBottom = new GameObject(
    "AirshipGearBottom",
    [
      new Renderer({
        geometry: gearBottomModel,
        material: shipMaterial.clone(),
        lambertMaterial: shipLambertianMaterial,
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
        lambertMaterial: shipLambertianMaterial,
      }),
    ],
    ["airship"]
  );

  const wheel = new GameObject(
    "AirshipWheel",
    [
      new Renderer({
        geometry: wheelModel,
        material: shipMaterial.clone(),
        lambertMaterial: shipLambertianMaterial,
      }),
    ],
    ["airship"]
  );

  const wingL = new GameObject(
    "AirshipWingL",
    [
      new Renderer({
        geometry: wingLModel,
        material: shipMaterial.clone(),
        lambertMaterial: shipLambertianMaterial,
      }),
    ],
    ["airship"]
  );

  const wingR = new GameObject(
    "AirshipWingR",
    [
      new Renderer({
        geometry: wingRModel,
        material: shipMaterial.clone(),
        lambertMaterial: shipLambertianMaterial,
      }),
    ],
    ["airship"]
  );

  const body = new GameObject(
    "AirshipBody",
    [
      new Renderer({
        geometry: bodyModel,
        material: shipMaterial.clone(),
        lambertMaterial: shipLambertianMaterial,
      }),
      new Airship(wingL, wingR, gearSides, gearBottom, gearBack, wheel),
    ],
    ["airship"]
  );

  const exhaust = new GameObject(
    "AirshipExhaust",
    [
      new Renderer({
        geometry: exhaustModel,
        material: shipMaterial.clone(),
        lambertMaterial: shipLambertianMaterial,
      }),
    ],
    ["airship"]
  );

  const capacitor = new GameObject(
    "AirshipCapacitor",
    [
      new Renderer({
        geometry: capacitorModel,
        material: shipMaterial.clone(),
        lambertMaterial: shipLambertianMaterial,
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
        lambertMaterial: shipLambertianMaterial,
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

function createLevel(id) {
  switch (id) {
    case "1":
      createLevel1();
      break;
    case "2":
      createLevel2();
      break;
    case "3":
      createLevel3();
      break;
  }
}

function createLevel0() {
  core.gamePlayManager.components = 999;
}

function createLevel1() {
  core.gamePlayManager.components = 40;

  const lavaTexture = ResourceManager.getTexture("lava");
  lavaTexture.wrapS = THREE.RepeatWrapping;
  lavaTexture.wrapT = THREE.RepeatWrapping;
  lavaTexture.repeat.set(1, 1);

  lavaTexture.minFilter = THREE.LinearFilter;
  lavaTexture.magFilter = THREE.LinearFilter;

  const lavaLambertian = ResourceManager.getMaterial("lambertian");
  lavaLambertian.uniforms.baseTexture.value = lavaTexture;

  const lavaToon = ResourceManager.getMaterial("toon");
  lavaToon.uniforms.baseTexture.value = lavaTexture;

  const lava1 = new GameObject(
    "Lava1",
    [
      new Renderer({
        geometry: ResourceManager.getModel("lava1").children[0].geometry,
        material: lavaToon,
        lambertMaterial: lavaLambertian,
      }),
      new PhysicsBody({
        mass: 0,
        shape: {
          type: "custom",
        },
        geometry: ResourceManager.getModel("lava1").children[0].geometry,
        showGizmo: core.debugMode,
        collisionResponse: false,
      }),
      new Lava(),
    ],
    ["lava1"]
  );

  lava1.transform.setPosition(new Vector3(-1.4, 0.2, 0));
  lava1.transform.setScale(new Vector3(1, 1, 1));
  lava1.transform.setRotation(new Vector3(-Math.PI / 2, 0, 0));

  engine.instantiate(lava1);
}

function createLevel2() {
  core.gamePlayManager.components = 60;

  const lavaTexture = ResourceManager.getTexture("lava");
  lavaTexture.wrapS = THREE.RepeatWrapping;
  lavaTexture.wrapT = THREE.RepeatWrapping;
  lavaTexture.repeat.set(1, 1);

  lavaTexture.minFilter = THREE.LinearFilter;
  lavaTexture.magFilter = THREE.LinearFilter;

  const lavaLambertian = ResourceManager.getMaterial("lambertian");
  lavaLambertian.uniforms.baseTexture.value = lavaTexture;

  const lavaToon = ResourceManager.getMaterial("toon");
  lavaToon.uniforms.baseTexture.value = lavaTexture;

  const lava2 = new GameObject(
    "Lava1",
    [
      new Renderer({
        geometry: ResourceManager.getModel("lava2").children[0].geometry,
        material: lavaToon,
        lambertMaterial: lavaLambertian,
      }),
      new PhysicsBody({
        mass: 0,
        shape: {
          type: "custom",
        },
        geometry: ResourceManager.getModel("lava2").children[0].geometry,
        showGizmo: core.debugMode,
        collisionResponse: false,
      }),
      new Lava(),
    ],
    ["lava2"]
  );

  lava2.transform.setPosition(new Vector3(-1.4, 0, -1));
  lava2.transform.setScale(new Vector3(1, 1, 1));
  lava2.transform.setRotation(new Vector3(-Math.PI / 2, 0, 0));

  engine.instantiate(lava2);
}

function createLevel3() {
  core.gamePlayManager.components = 120;

  const lavaTexture = ResourceManager.getTexture("lava");
  lavaTexture.wrapS = THREE.RepeatWrapping;
  lavaTexture.wrapT = THREE.RepeatWrapping;
  lavaTexture.repeat.set(1, 1);

  lavaTexture.minFilter = THREE.LinearFilter;
  lavaTexture.magFilter = THREE.LinearFilter;

  const lavaLambertian = ResourceManager.getMaterial("lambertian");
  lavaLambertian.uniforms.baseTexture.value = lavaTexture;

  const lavaToon = ResourceManager.getMaterial("toon");
  lavaToon.uniforms.baseTexture.value = lavaTexture;

  const lava2 = new GameObject(
    "Lava1",
    [
      new Renderer({
        geometry: ResourceManager.getModel("lava2").children[0].geometry,
        material: lavaToon,
        lambertMaterial: lavaLambertian,
      }),
      new PhysicsBody({
        mass: 0,
        shape: {
          type: "custom",
        },
        geometry: ResourceManager.getModel("lava2").children[0].geometry,
        showGizmo: core.debugMode,
        collisionResponse: false,
      }),
      new Lava(),
    ],
    ["lava2"]
  );

  lava2.transform.setPosition(new Vector3(-1.4, 0, 2));
  lava2.transform.setScale(new Vector3(1, 1, 1));
  lava2.transform.setRotation(new Vector3(-Math.PI / 2, 0, 0));

  engine.instantiate(lava2);

  const lava1 = new GameObject(
    "Lava1",
    [
      new Renderer({
        geometry: ResourceManager.getModel("lava1").children[0].geometry,
        material: lavaToon,
        lambertMaterial: lavaLambertian,
      }),
      new PhysicsBody({
        mass: 0,
        shape: {
          type: "custom",
        },
        geometry: ResourceManager.getModel("lava1").children[0].geometry,
        showGizmo: core.debugMode,
        collisionResponse: false,
      }),
      new Lava(),
    ],
    ["lava1"]
  );

  lava1.transform.setPosition(new Vector3(-1.4, 0.2, -0.5));
  lava1.transform.setScale(new Vector3(1, 1, 1));
  lava1.transform.setRotation(new Vector3(-Math.PI / 2, 0, 0));

  engine.instantiate(lava1);

  const lava3 = new GameObject(
    "lava3",
    [
      new Renderer({
        geometry: ResourceManager.getModel("lava1").children[0].geometry,
        material: lavaToon,
        lambertMaterial: lavaLambertian,
      }),
      new PhysicsBody({
        mass: 0,
        shape: {
          type: "custom",
        },
        geometry: ResourceManager.getModel("lava1").children[0].geometry,
        showGizmo: core.debugMode,
        collisionResponse: false,
      }),
      new Lava(),
    ],
    ["lava3"]
  );

  lava3.transform.setPosition(new Vector3(1.4, 0.2, -2));
  lava3.transform.setScale(new Vector3(1, 1, 1));
  lava3.transform.setRotation(new Vector3(-Math.PI / 2, Math.PI, 0));

  engine.instantiate(lava3);
}

await start();
