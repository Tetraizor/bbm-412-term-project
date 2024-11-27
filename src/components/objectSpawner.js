import Component from "./component.js";
import { Vector2, Vector3 } from "three";
import GameObject from "../gameObject.js";
import Renderer from "./renderer.js";
import engine from "../engine.js";

export default class ObjectSpawner extends Component {
    constructor() {
        super();
    }

    start() {
        window.addEventListener('mousedown', (event) => {
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            this.onClicked(new Vector2(mouseX, mouseY), event.button);
        });
    }

    onClicked(position, button) {
        // if (button !== 0) return;

        // // Create a new cube
        // const cube = new GameObject('Cube', [
        //     new Renderer('cube', 'ffff00'),
        // ], ['cube']);

        // cube.transform.position = new Vector3(1, 0, 0);
        // cube.transform.rotation = new Vector3(30, 20, 50);

        // engine.instantiate(cube);
    }
}