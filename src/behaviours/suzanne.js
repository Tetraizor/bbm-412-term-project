import Component from "../components/component.js";
import core from '../core.js';

export default class Suzanne extends Component {
    constructor() {
        super();
    }

    start() {
    }

    update() {
        this.gameObject.transform.rotation.y += (.001 * core.deltaTime);
    }
}