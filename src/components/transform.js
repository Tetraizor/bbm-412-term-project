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

  setPosition(position, source = null) {
    if (position == null || position == undefined) position = this.position;

    this.position = position;

    const event = new CustomEvent("onPositionChanged", {
      detail: {
        position: this.position,
        source: source,
      },
    });

    this.eventTarget.dispatchEvent(event);
  }

  setRotation(rotation, source = null) {
    if (rotation == null || rotation == undefined) rotation = this.rotation;

    this.rotation = rotation;

    const event = new CustomEvent("onRotationChanged", {
      detail: {
        rotation: this.rotation,
        source: source,
      },
    });

    this.eventTarget.dispatchEvent(event);
  }

  setScale(scale, source = null) {
    if (scale == null || scale == undefined) scale = this.scale;

    this.scale = scale;

    const event = new CustomEvent("onScaleChanged", {
      detail: {
        scale: this.scale,
        source: source,
      },
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
