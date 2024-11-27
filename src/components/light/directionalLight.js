import * as THREE from "three";
import core from "../../core.js";

import LightBase from "./lightBase.js";

export default class DirectionalLight extends LightBase {
    constructor(properties) {
        super(properties);
    }

    start() {
        super.start();

        this.light = new THREE.DirectionalLight(0xffffff, 1);
        this.light.position.set(this.gameObject.transform.position.x, this.gameObject.transform.position.y, this.gameObject.transform.position.z);

        core.scene.add(this.light);
    }

    update() {
        super.update();

        if (this.light.position.x != this.gameObject.transform.position.x ||
            this.light.position.y != this.gameObject.transform.position.y ||
            this.light.position.z != this.gameObject.transform.position.z) {
            this.light.position.set(this.gameObject.transform.position.x, this.gameObject.transform.position.y, this.gameObject.transform.position.z);
        }

        if (this.light.color != this.properties.color) {
            this.light.color = this.properties.color;
        }

        if (this.light.intensity != this.properties.intensity) {
            this.light.intensity = this.properties.intensity;
        }
    }
}