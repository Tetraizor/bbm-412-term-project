import Component from "./component.js";
import ForceField from "./forceField.js";
import Magnet from "./magnet.js";
import core from "../core.js";
import UIManager from "../uiManager.js";

export default class GamePlayManager extends Component {
  magnets = [];
  spheres = [];
  forceFields = [];
  placableSpaces = [];
  lava = [];
  vacuum = null;

  renderers = [];

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
    strongPositiveMagnet: {
      price: 10,
      type: "strongMagnet",
      properties: {
        magnetType: "positive",
        strength: 2,
      },
    },
    strongNegativeMagnet: {
      price: 10,
      type: "strongMagnet",
      properties: {
        magnetType: "negative",
        strength: 2,
      },
    },
    spinningMagnet: {
      price: 10,
      type: "spinningMagnet",
      properties: {
        rotationSpeed: 0.1,
      },
    },
    cube: {
      price: 5,
      type: "cube",
    },
    ramp: {
      price: 5,
      type: "ramp",
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

    this.vacuum.registerSphere(sphere);

    this.lava.forEach((lava) => {
      lava.registerSphere(sphere);
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

  registerLava(lava) {
    this.lava.push(lava);

    this.spheres.forEach((sphere) => {
      lava.registerSphere(sphere);
    });
  }

  registerVacuum(vacuum) {
    this.vacuum = vacuum;

    this.spheres.forEach((sphere) => {
      vacuum.registerSphere(sphere);
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

    this.forceFields.forEach((forceField) => {
      forceField.unregisterSphere(sphere);
    });
    this.vacuum.unregisterSphere(sphere);
    this.lava.forEach((lava) => {
      lava.unregisterSphere(sphere);
    });
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

    // Render Mode Buttons
    if (this.renderingMode === "toon") {
      document.getElementById("shaderButton1").classList.add("active");
      document.getElementById("shaderButton2").classList.remove("active");
    } else {
      document.getElementById("shaderButton1").classList.remove("active");
      document.getElementById("shaderButton2").classList.add("active");
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

    setTimeout(() => {
      console.log("Setting rendering mode to lambertian");
      this.setRenderingMode("lambertian");
    }, 300);
  }

  gameRunning = true;

  update() {
    if (this.gameRunning) {
      if (core.time < 10000) {
        document.getElementById("timer").innerText =
          "Time: 0" + (core.time / 1000).toFixed(2);
      } else {
        document.getElementById("timer").innerText =
          "Time: " + (core.time / 1000).toFixed(2);
      }
    }
  }

  registerRenderer(renderer) {
    this.renderers.push(renderer);
    renderer.changeRendererType(this.renderingMode);
  }

  renderingMode = "toon";

  setRenderingMode(rendering) {
    if (rendering == this.renderingMode) {
      return;
    }

    if (this.renderingMode === "toon") {
      this.renderingMode = "lambertian";
    } else {
      this.renderingMode = "toon";
    }

    if (this.renderingMode === "toon") {
      this.renderers.forEach((renderer) => {
        renderer.changeRendererType("toon");
      });
    } else {
      this.renderers.forEach((renderer) => {
        renderer.changeRendererType("lambertian");
      });
    }

    this.updateUI();
  }

  won() {
    console.log("You won!");
    core.audioManager.playSFX("won");

    core.uiManager.toggle("won");

    let score = this.spheresLeft * 1000;
    score += this.components * 50;
    score += 2000 - 20 * (core.time / 1000);

    document.getElementById("score").innerText = score.toFixed(0);
    document.getElementById("spheresLeft").innerText =
      this.spheresLeft.toFixed(0).toString() + " seconds";
    document.getElementById("componentsLeft").innerText =
      this.components.toFixed(0);
    document.getElementById("timeLeft").innerText = (core.time / 1000).toFixed(
      2
    );

    this.gameRunning = false;
  }

  loose() {
    console.log("You lost!");

    core.uiManager.toggle("lost");

    this.gameRunning;
  }
}
