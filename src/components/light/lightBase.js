import Component from "../component.js";

export default class LightBase extends Component {
  light = null;
  properties = null;

  constructor(properties) {
    super();

    this.properties = properties;
  }

  start() {
    this.gameObject.transform.addListener("onPositionChanged", (event) => {
      this.onPositionChanged(event.detail.position);
    });

    this.gameObject.transform.addListener("onRotationChanged", (event) => {
      this.onRotationChanged(event.detail.rotation);
    });

    this.onPositionChanged(this.gameObject.transform.position);
    this.onRotationChanged(this.gameObject.transform.rotation);
  }

  onPositionChanged(position) {
    if (this.light == undefined || this.light == null) return;

    this.light.position.set(position.x, position.y, position.z);
  }

  onRotationChanged(rotation) {
    if (this.light == undefined || this.light == null) return;

    this.light.rotation.set(rotation.x, rotation.y, rotation.z);
  }

  update() {
    if (this.light == undefined || this.light == null) return;

    this.light.position.set(
      this.gameObject.transform.position.x,
      this.gameObject.transform.position.y,
      this.gameObject.transform.position.z
    );
    this.light.rotation.set(
      this.gameObject.transform.rotation.x,
      this.gameObject.transform.rotation.y,
      this.gameObject.transform.rotation.z
    );
  }
}
