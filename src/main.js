import engine from './engine.js';
import core from './core.js';

import { Vector3 } from 'three';
import * as THREE from 'three';

import GameObject from './gameObject.js';
import Renderer from './components/renderer.js';
import ObjectSpawner from './components/objectSpawner.js';
import CameraManager from './components/cameraManager.js';
import AmbientLight from './components/light/ambientLight.js';
import DirectionalLight from './components/light/directionalLight.js';

import { loadFBX, loadTexture } from './loader.js';
import Suzanne from './behaviours/suzanne.js';
import Ball from './behaviours/ball.js';
import Magnet from './behaviours/magnet.js';
import MagneticField from './behaviours/magneticField.js';

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

const scene = [];

async function start() {
    engine.initialize();
    core.addPreRenderHook(prerender);

    setInterval(() => {
        document.getElementById('fpsCounter').innerHTML = `FPS: ${Math.round(cumulativeFPS / FPSCount)}`;
        document.getElementById('deltaCounter').innerHTML = `Delta: ${Math.round(cumulativeMS / MSCount)}ms`;

        cumulativeFPS = 0;
        FPSCount = 0;

        cumulativeMS = 0;
        MSCount = 0;
    }, 100);

    const spawner = new GameObject('Spawner', [
        new ObjectSpawner(),
    ], ['spawner']);

    engine.instantiate(spawner);

    const camera = new GameObject('Camera', [
        new CameraManager()
    ], ['camera']);
    camera.transform.position = new Vector3(0, 0, 5);

    engine.instantiate(camera);
    
    // Create Magnet
    const magnet1 = new GameObject('Magnet', [
        new Renderer(new THREE.BoxGeometry(0.2, 0.2, 0.6), new THREE.MeshLambertMaterial({ color: 0xFF0000 })),
        new Magnet()
    ], ['magnet']);
    magnet1.setScene(scene);
    magnet1.transform.position = new Vector3(2, 0, 0);
    engine.instantiate(magnet1);

    const magnet2 = new GameObject('Magnet', [
        new Renderer(new THREE.BoxGeometry(0.2, 0.2, 0.6), new THREE.MeshLambertMaterial({ color: 0x0000FF })),
        new Magnet()
    ], ['magnet']);
    magnet2.setScene(scene);
    magnet2.transform.position = new Vector3(-2, 0, 0);
    engine.instantiate(magnet2);

    // Create a GameObject that will manage the magnetic field
    const magneticFieldObject = new GameObject("MagneticField", [
        new MagneticField(),
    ], ["magneticField"]);
    magneticFieldObject.setScene(scene);
    // Add it to the scene
    engine.instantiate(magneticFieldObject);

    // Create Ball
    const ballMaterial = new THREE.MeshLambertMaterial({ color: 0x00FF00 });
    const ballModel = await loadFBX('../models/ball.fbx');
    const ball = new GameObject('Ball', [
        new Renderer(ballModel, ballMaterial),
        new Ball()
    ], ['ball']);
    ball.setScene(scene);
    ball.transform.position = new Vector3(0, 0, 0);
    engine.instantiate(ball);


    const directionalLight = new GameObject('DirectionalLight', [
        new DirectionalLight({ color: new THREE.Color(1, 1, 1), intensity: 1 })
    ], ['directionalLight']);

    directionalLight.transform.position = new Vector3(3, 3, 3);
    directionalLight.transform.rotation = new Vector3(-Math.PI / 4, Math.PI / 4, 0);

    engine.instantiate(directionalLight);

    const plane = new GameObject('Plane', [
        new Renderer(new THREE.PlaneGeometry(4, 4), new THREE.MeshLambertMaterial({ color: 0xFFFFFF })),
    ], ['plane']);

    plane.transform.position = new Vector3(0, -2, 0);
    plane.transform.rotation = new Vector3(-(Math.PI / 2), 0, 0);

    engine.instantiate(plane);

    const ambientLight = new GameObject('AmbientLight', [
        new AmbientLight({ color: new THREE.Color(242 / 255, 231 / 255, 206 / 255), intensity: 1 })
    ], ['ambientLight']);

    engine.instantiate(ambientLight);

    const debugTexture = await loadTexture('../textures/debug/texture_09.png');
    debugTexture.wrapS = THREE.RepeatWrapping;
    debugTexture.wrapT = THREE.RepeatWrapping;
    debugTexture.repeat.set(10, 10);

    const room = new GameObject('Room', [
        new Renderer(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshLambertMaterial({ color: 0xFFFFFF, map: debugTexture, side: THREE.BackSide })),
    ], ['room']);

    engine.instantiate(room);
}

await start();