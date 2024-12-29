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

import { loadTexture } from './loader.js';
import Ball from './behaviours/ball.js';
import Magnet from './behaviours/magnet.js';
import MagneticField from './behaviours/magneticField.js';

let scene, camera, renderer;

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
    engine.initialize();
    core.addPreRenderHook(prerender);

    // Sahne oluşturma
    scene = new THREE.Scene();

    // Kamera oluşturma
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer oluşturma
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    setInterval(() => {
        document.getElementById('fpsCounter').innerHTML = `FPS: ${Math.round(cumulativeFPS / FPSCount)}`;
        document.getElementById('deltaCounter').innerHTML = `Delta: ${Math.round(cumulativeMS / MSCount)}ms`;

        cumulativeFPS = 0;
        FPSCount = 0;

        cumulativeMS = 0;
        MSCount = 0;
    }, 100);

    // Kamera
    const cameraObject = new GameObject('Camera', [
        new CameraManager()
    ], ['camera']);
    cameraObject.transform.position = new Vector3(0, 2, 10);
    cameraObject.transform.lookAt(new Vector3(0, 1, 0));
    engine.instantiate(cameraObject);

    // Top Oluşturma
    const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const ballMaterial = new THREE.MeshLambertMaterial({ color: 0x00FF00 });
    const ball = new GameObject('Ball', [
        new Renderer(ballGeometry, ballMaterial),
        new Ball()
    ], ['ball']);
    ball.transform.position = new Vector3(0, 1, 0); // Yüksekliği biraz artırdım
    engine.instantiate(ball);

    // Manyetik Alanlar
    const magnet1 = new GameObject('Magnet1', [
        new Renderer(new THREE.BoxGeometry(0.2, 0.2, 0.6), new THREE.MeshLambertMaterial({ color: 0xFF0000 })),
        new Magnet()
    ], ['magnet']);
    magnet1.transform.position = new Vector3(2, 0, 0);
    engine.instantiate(magnet1);

    const magnet2 = new GameObject('Magnet2', [
        new Renderer(new THREE.BoxGeometry(0.2, 0.2, 0.6), new THREE.MeshLambertMaterial({ color: 0x0000FF })),
        new Magnet()
    ], ['magnet']);
    magnet2.transform.position = new Vector3(-2, 0, 0);
    engine.instantiate(magnet2);

    const magneticFieldObject = new GameObject('MagneticField', [
        new MagneticField(),
    ], ['magneticField']);
    engine.instantiate(magneticFieldObject);

    // Işıklandırma
    const directionalLight = new GameObject('DirectionalLight', [
        new DirectionalLight({ color: new THREE.Color(1, 1, 1), intensity: 1 })
    ], ['directionalLight']);
    directionalLight.transform.position = new Vector3(5, 5, 5);
    engine.instantiate(directionalLight);

    const ambientLight = new GameObject('AmbientLight', [
        new AmbientLight({ color: new THREE.Color(1, 1, 1), intensity: 0.5 })
    ], ['ambientLight']);
    engine.instantiate(ambientLight);

    // Zemin
    const plane = new GameObject('Plane', [
        new Renderer(new THREE.PlaneGeometry(10, 10), new THREE.MeshLambertMaterial({ color: 0xCCCCCC })),
    ], ['plane']);
    plane.transform.position = new Vector3(0, -0.5, 0);
    plane.transform.rotation = new Vector3(-Math.PI / 2, 0, 0);
    engine.instantiate(plane);

    // Oda
    const debugTexture = await loadTexture('../textures/debug/texture_09.png');
    debugTexture.wrapS = THREE.RepeatWrapping;
    debugTexture.wrapT = THREE.RepeatWrapping;
    debugTexture.repeat.set(5, 5);

    const room = new GameObject('Room', [
        new Renderer(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshLambertMaterial({ color: 0xFFFFFF, map: debugTexture, side: THREE.BackSide })),
    ], ['room']);
    engine.instantiate(room);

    // Animasyon Döngüsü
    function animate() {
        requestAnimationFrame(animate);

        // Topu döndürme
        ball.transform.rotation.x += 0.01;
        ball.transform.rotation.y += 0.01;

        renderer.render(scene, camera);
    }

    animate();
}

await start();
