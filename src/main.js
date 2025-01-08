import engine from "./engine.js";
import core from "./core.js";

import { Vector3 } from "three";
import * as THREE from "three";

import GameObject from "./gameObject.js";
import Renderer from "./components/renderer.js";
import ObjectSpawner from "./components/objectSpawner.js";
import CameraManager from "./components/cameraManager.js";
import AmbientLight from "./components/light/ambientLight.js";
import DirectionalLight from "./components/light/directionalLight.js";

import Suzanne from "./behaviours/suzanne.js";
import resourceManager from "./resourceManager.js";
import GizmoRenderer from "./components/gizmoRenderer.js";
import UIManager from "./uiManager.js";

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
  engine.initialize();
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
  // Load models.
  await resourceManager.loadModel("suzanne", "../models/suzanne.fbx");

  // Load materials.
  await resourceManager.loadMaterial(
    "toon",
    "../materials/toonV.glsl",
    "../materials/toonF.glsl",
    {
      lightDirection: { value: new THREE.Vector3(1, 1, 1).normalize() },
      lightColor: { value: new THREE.Color(1, 1, 1) },
      lightIntensity: { value: 1 },
      ambientColor: { value: new THREE.Color(0.2, 0.2, 0.2) },
      threshold1: { value: 0.3 },
      threshold2: { value: 0.7 },
      ambientIntensity: { value: 0.0 },
      baseColor: { value: new THREE.Color(0.4, 0, 0.2) },
    }
  );

  await resourceManager.loadMaterial(
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
      baseColor: { value: new THREE.Color(0.4, 0, 0.2) },
    }
  );

  // Load textures.
  await resourceManager.loadTexture(
    "debugTexture",
    "../textures/debug/texture_09.png"
  );
}

async function createInitialScene() {
  const spawner = new GameObject("Spawner", [new ObjectSpawner()], ["spawner"]);

  engine.instantiate(spawner);

  const camera = new GameObject("Camera", [new CameraManager()], ["camera"]);
  camera.transform.position = new Vector3(0, 0, 5);

  engine.instantiate(camera);

  const directionalLight = new GameObject(
    "DirectionalLight",
    [new DirectionalLight({ color: new THREE.Color(1, 1, 1), intensity: 1 })],
    ["directionalLight"]
  );

  directionalLight.transform.position = new Vector3(3, 3, 3);
  directionalLight.transform.rotation = new Vector3(
    -Math.PI / 4,
    Math.PI / 4,
    0
  );

  engine.instantiate(directionalLight);
}

async function createTemporarySceneObjects() {
  const lambertianMaterial = resourceManager.getMaterial("lambertian");
  const toonMaterial = resourceManager.getMaterial("toon");
  const suzanneModel = resourceManager.getModel("suzanne");

  const suzanne1 = new GameObject(
    "Suzanne1",
    [new Renderer(suzanneModel, lambertianMaterial), new Suzanne()],
    ["suzanne"]
  );

  const suzanne2 = new GameObject(
    "Suzanne2",
    [new Renderer(suzanneModel, toonMaterial), new Suzanne()],
    ["suzanne"]
  );

  suzanne1.transform.position = new Vector3(2, 0, 0);
  suzanne1.transform.rotation = new Vector3(-Math.PI / 2, 0, 0);

  suzanne2.transform.position = new Vector3(-2, 0, 0);
  suzanne2.transform.rotation = new Vector3(-Math.PI / 2, 0, 0);

  engine.instantiate(suzanne1);
  engine.instantiate(suzanne2);

  const plane = new GameObject(
    "Plane",
    [
      new Renderer(
        new THREE.PlaneGeometry(4, 4),
        resourceManager.getMaterial("lambertian")
      ),
    ],
    ["plane"]
  );

  plane.getComponent(Renderer).material.uniforms.baseColor.value =
    new THREE.Color(1, 1, 1);

  plane.transform.position = new Vector3(0, -2, 0);
  plane.transform.rotation = new Vector3(-(Math.PI / 2), 0, 0);

  engine.instantiate(plane);

  const ambientLight = new GameObject(
    "AmbientLight",
    [
      new AmbientLight({
        color: new THREE.Color(242 / 255, 231 / 255, 206 / 255),
        intensity: 0.15,
      }),
    ],
    ["ambientLight"]
  );

  const directionalLight = new GameObject(
    "DirectionalLight",
    [
      new DirectionalLight({
        color: new THREE.Color(1, 1, 1),
        intensity: 1,
      }),
      new GizmoRenderer(),
    ],
    ["directionalLight"]
  );

  engine.instantiate(ambientLight);
  engine.instantiate(directionalLight);

  core.ambientLight = ambientLight;
  core.directionalLight = directionalLight;

  directionalLight.transform.position = new Vector3(0, 0, 0);

  const debugTexture = resourceManager.getTexture("debugTexture");
  debugTexture.wrapS = THREE.RepeatWrapping;
  debugTexture.wrapT = THREE.RepeatWrapping;
  debugTexture.repeat.set(10, 10);

  const room = new GameObject(
    "Room",
    [
      new Renderer(
        new THREE.BoxGeometry(20, 20, 20),
        new THREE.MeshLambertMaterial({
          color: 0xffffff,
          map: debugTexture,
          side: THREE.BackSide,
        })
      ),
    ],
    ["room"]
  );

  engine.instantiate(room);
}

await start();
