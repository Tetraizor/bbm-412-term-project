import Component from "./component.js";
import ForceField from "./forceField.js";
import Magnet from "./magnet.js";
import core from "../core.js";

export default class GamePlayManager extends Component {
  magnets = [];
  spheres = [];
  forceFields = [];
  placableSpaces = [];

  itemDb = {
    negativeMagnet: {
      price: 5,
      type: "magnet",
      properties: {
        magnetType: "negative",
      },
    },
    positiveMagnet: {
      price: 5,
      type: "magnet",
      properties: {
        magnetType: "positive",
      },
    },
    spinningMagnet: {
      price: 10,
      type: "spinningMagnet",
      properties: {
        rotationSpeed: 0.1,
      },
    },
  };

  components = 32;
  spheresLeft = 5;

  buyingItem = null;

  constructor() {
    super();
  }

  registerSphere(sphere) {
    this.spheres.push(sphere);

    this.forceFields.forEach((forceField) => {
      forceField.registerSphere(sphere);
    });
  }

  registerPlacableSpace(space) {
    this.placableSpaces.push(space);
  }

  registerForceField(forceField) {
    this.forceFields.push(forceField);

    this.spheres.forEach((sphere) => {
      forceField.registerSphere(sphere);
    });
  }

  unregisterPlacableSpace(space) {
    this.placableSpaces = this.placableSpaces.filter((s) => s !== space);
  }

  unregisterForceField(forceField) {
    this.forceFields = this.forceFields.filter((field) => field !== forceField);
  }

  unregisterSphere(sphere) {
    this.spheres = this.spheres.filter((s) => s !== sphere);
  }

  buyItem({ item }) {
    const itemData = this.itemDb[item];

    if (!itemData) {
      console.log("Item " + item + " not found");
      return;
    }

    if (this.components < itemData.price) {
      console.log("Not enough components");
      return;
    }

    this.buyingItem = itemData;

    this.placableSpaces.forEach((space) => {
      space.setSpawningObject(itemData);
    });

    this.updateUI();
  }

  acceptPurchase({ item }) {
    this.components -= item.price;
    this.buyingItem = null;

    this.placableSpaces.forEach((space) => {
      space.cancelSpawn();
    });

    this.updateUI();
  }

  cancelPurchase() {
    this.buyingItem = null;

    this.placableSpaces.forEach((space) => {
      space.cancelSpawn();
    });

    this.updateUI();
  }

  updateUI() {
    // Spheres
    this.updateSphereUI();

    // Components
    document.getElementById("components").innerText =
      "Components Left: " + this.components;

    // Buy buttons
    if (this.buyingItem) {
      document.getElementById("cancelButton").classList.remove("hidden");
      document.getElementById("buyButtons").classList.add("hidden");
    } else {
      document.getElementById("cancelButton").classList.add("hidden");
      document.getElementById("buyButtons").classList.remove("hidden");
    }
  }

  updateSphereUI() {
    const sphere1 = document.getElementById("sphere1");
    const sphere2 = document.getElementById("sphere2");
    const sphere3 = document.getElementById("sphere3");
    const sphere4 = document.getElementById("sphere4");
    const sphere5 = document.getElementById("sphere5");

    sphere1.classList.remove("full");
    sphere2.classList.remove("full");
    sphere3.classList.remove("full");
    sphere4.classList.remove("full");
    sphere5.classList.remove("full");

    if (this.spheresLeft >= 1) {
      sphere1.classList.add("full");
    }

    if (this.spheresLeft >= 2) {
      sphere2.classList.add("full");
    }

    if (this.spheresLeft >= 3) {
      sphere3.classList.add("full");
    }

    if (this.spheresLeft >= 4) {
      sphere4.classList.add("full");
    }

    if (this.spheresLeft >= 5) {
      sphere5.classList.add("full");
    }
  }

  start() {
    this.updateUI();
  }

  update() {}
}
