import Component from "./component.js";
import ForceField from "./forceField.js";

export default class GamePlayManager extends Component {
  magnets = [];
  spheres = [];
  forceFields = [];

  constructor() {
    super();
  }

  registerSphere(sphere) {
    this.spheres.push(sphere);

    this.forceFields.forEach((forceField) => {
      forceField.registerSphere(sphere);
    });
  }

  registerForceField(forceField) {
    this.forceFields.push(forceField);

    this.spheres.forEach((sphere) => {
      forceField.registerSphere(sphere);
    });
  }

  start() {}

  update() {}
}
