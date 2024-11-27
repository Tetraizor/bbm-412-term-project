import Component from './component.js';
import { Vector3 } from 'three';

export default class Transform extends Component {
    position = new Vector3(0, 0, 0);
    rotation = new Vector3(0, 0, 0);

    constructor(position = new Vector3(0, 0, 0), rotation = new Vector3(0, 0, 0)) {
        super();
        this.position = position;
        this.rotation = rotation;
    }

    start() {

    }

    update() {

    }
}