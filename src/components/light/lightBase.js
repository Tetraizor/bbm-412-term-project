import Component from "../component.js";

export default class LightBase extends Component {
    light = null;
    properties = null;

    constructor(properties) {
        super();

        this.properties = properties;
    }

    start() {
    }

    update() {
        if (this.light == undefined || this.light == null) return;

        this.light.position.set(this.gameObject.transform.position.x, this.gameObject.transform.position.y, this.gameObject.transform.position.z);
        this.light.rotation.set(this.gameObject.transform.rotation.x, this.gameObject.transform.rotation.y, this.gameObject.transform.rotation.z);
    }
}