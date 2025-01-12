import Component from "./component.js";
import { Vector3 } from "three";
import core from "../core.js";

export default class Airship extends Component {
  speed = 0;
  direction = new Vector3(0, 0, 0);

  wingL = null;
  wingR = null;
  gearSide = null;
  gearBottom = null;
  gearBack = null;
  wheel = null;

  constructor(wingL, wingR, gearSide, gearBottom, gearBack, wheel) {
    super();

    this.wingL = wingL;
    this.wingR = wingR;
    this.gearSide = gearSide;
    this.gearBottom = gearBottom;
    this.gearBack = gearBack;
    this.wheel = wheel;
  }

  start() {}

  update() {
    const wingY = (Math.sin((4 * core.time) / 1000) * Math.PI) / 6;
    this.wingL.transform.setRotation(
      new Vector3(
        this.wingL.transform.rotation.x,
        wingY,
        this.wingL.transform.rotation.z
      )
    );

    const wingYR = (Math.sin(Math.PI + (4 * core.time) / 1000) * Math.PI) / 6;
    this.wingR.transform.setRotation(
      new Vector3(
        this.wingR.transform.rotation.x,
        wingYR,
        this.wingR.transform.rotation.z
      )
    );

    this.gearSide.transform.setRotation(
      new Vector3(
        this.gearSide.transform.rotation.x + (3 * core.deltaTime) / 1000,
        this.gearSide.transform.rotation.y,
        this.gearSide.transform.rotation.z
      )
    );

    this.gearBottom.transform.setRotation(
      new Vector3(
        this.gearBottom.transform.rotation.x,
        this.gearBottom.transform.rotation.y + (3 * core.deltaTime) / 1000,
        this.gearBottom.transform.rotation.z
      )
    );

    this.gearBack.transform.setRotation(
      new Vector3(
        this.gearBack.transform.rotation.x,
        this.gearBack.transform.rotation.y + (3 * core.deltaTime) / 1000,
        this.gearBack.transform.rotation.z
      )
    );

    this.wheel.transform.setRotation(
      new Vector3(
        this.wheel.transform.rotation.x,
        this.wheel.transform.rotation.y + (3 * core.deltaTime) / 1000,
        this.wheel.transform.rotation.z
      )
    );
  }
}
