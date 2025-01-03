import Component from "../components/component.js";
import core from '../core.js';

export default class Suzanne extends Component {
    speed = 0;

    constructor() {
        super();
    }

    start() {
        document.addEventListener('click', () => {
            this.speed = this.speed + .001;
        });
    }

    update() {
        this.gameObject.transform.rotation.y += (this.speed * core.deltaTime);
    }
}