import Component from "./component.js";
import { Vector3 } from "three";

export default class Transform extends Component {
  position = new Vector3(0, 0, 0);
  rotation = new Vector3(0, 0, 0);
  scale = new Vector3(1, 1, 1);

  eventTarget = new EventTarget();
  eventListeners = [];

  onPositionChange(callback) {
    this.positionEvent.addEventListener("onPositionChanged", (event) => {
      callback(event.detail.position);
    });
  }

  constructor(
    position = new Vector3(0, 0, 0),
    rotation = new Vector3(0, 0, 0),
    scale = new Vector3(1, 1, 1)
  ) {
    super();

    this.setPosition(position);
    this.setRotation(rotation);
    this.setScale(scale);
  }

  addListener(event, callback) {
    this.eventTarget.addEventListener(event, callback);
    this.eventListeners.push({ event, callback });
  }

  setPosition(position) {
    this.position = position;

    const event = new CustomEvent("onPositionChanged", {
      detail: { position: this.position },
    });

    this.eventTarget.dispatchEvent(event);
  }

  setRotation(rotation) {
    this.rotation = rotation;

    const event = new CustomEvent("onRotationChanged", {
      detail: { rotation: this.rotation },
    });

    this.eventTarget.dispatchEvent(event);
  }

  setScale(scale) {
    this.scale = scale;

    const event = new CustomEvent("onScaleChanged", {
      detail: { scale: this.scale },
    });

    this.eventTarget.dispatchEvent(event);
  }

  start() {}

  update() {}

  destroy() {
    this.eventListeners.forEach((listener) => {
      this.eventTarget.removeEventListener(listener.event, listener.callback);
    });
  }
}
