import * as THREE from 'three';
import LightBase from './lightBase.js';
import core from '../../core.js';

export default class AmbientLight extends LightBase {
    constructor(properties) {
        super(properties);
    }

    start() {
        super.start();

        this.light = new THREE.AmbientLight(this.properties.color, this.properties.intensity);
        core.scene.add(this.light);
    }

    update() {
        super.update();
    }
}