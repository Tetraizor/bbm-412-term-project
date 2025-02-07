import core from "./core.js";

export default class UIManager {
  constructor() {
    this.initialize();
  }

  states = {
    help: false,
    settings: false,
    won: false,
    lost: false,
  };

  buttons = {
    settingsButton: document.getElementById("settingsButton"),

    // Tabs
    tabButton1: document.getElementById("tabButton1"),
    tabButton2: document.getElementById("tabButton2"),
    tabButton3: document.getElementById("tabButton3"),

    // Buy Menu
    cancelButton: document.getElementById("cancelButton"),

    buyButton1: document.getElementById("buyButton1"),
    buyButton2: document.getElementById("buyButton2"),
    buyButton3: document.getElementById("buyButton3"),
    buyButton4: document.getElementById("buyButton4"),
    buyButton6: document.getElementById("buyButton6"),
    buyButton7: document.getElementById("buyButton7"),

    shaderButton1: document.getElementById("shaderButton1"),
    shaderButton2: document.getElementById("shaderButton2"),
  };

  panels = {
    help: {
      root: document.getElementById("help"),
    },
    won: {
      root: document.getElementById("won"),
    },
    lost: {
      root: document.getElementById("lost"),
    },
  };

  settings = {
    root: document.getElementById("settings"),
    state: false,
  };

  background = document.getElementsByClassName("modalController")[0];

  toggle(panel) {
    if (this.states[panel]) {
      this.panels[panel].root.classList.add("hidden");
    } else {
      for (let key in this.states) {
        if (key == panel) continue;

        const value = this.states[key];

        if (value) {
          this.toggle(key);
        }
      }

      this.panels[panel].root.classList.remove("hidden");
    }

    this.states[panel] = !this.states[panel];

    const isAnyPanelOpen = Object.values(this.states).some((state) => state);

    if (isAnyPanelOpen) {
      this.background.classList.remove("hidden");
    } else {
      this.background.classList.add("hidden");
    }
  }

  toggleForce(panel, state) {
    if (this.states[panel] != state) {
      this.toggle(panel);
    }
  }

  initialize() {
    document.addEventListener("keydown", (event) => {
      if (event.key == "h") {
        this.toggle("help");
      }

      if (event.key == "o") {
        core.gamePlayManager.won();
      }

      if (event.key == "Escape" || event.key == "Esc") {
        this.toggleSettings();
      }
    });

    for (let key in this.states) {
      this.toggleForce(key, false);
    }

    for (let key in this.buttons) {
      if (!this.buttons[key]) {
        console.error(`Button ${key} not found`);
        return;
      }

      this.buttons[key].addEventListener("click", () => {
        this.onButtonPressed(key);
      });
    }

    document
      .getElementById("exploreThisLevel")
      .addEventListener("click", () => {
        this.toggleForce("won", false);
        core.gamePlayManager.components = 999;
        core.gamePlayManager.updateUI();
      });

    document.getElementById("nextLevelButton").addEventListener("click", () => {
      const level = new URLSearchParams(window.location.search).get("level");
      const thisLevel = parseInt(level);

      if (thisLevel == 3) {
        window.location.href = "./index.html";
      } else {
        window.location.href = `./start.html?level=${thisLevel + 1}`;
      }
    });
  }

  toggleSettings() {
    this.settings.state = !this.settings.state;

    if (!this.settings.state) {
      this.settings.root.classList.remove("visible");
      this.buttons.settingsButton.classList.remove("active");
    } else {
      this.settings.root.classList.add("visible");
      this.buttons.settingsButton.classList.add("active");
    }
  }

  onButtonPressed(button) {
    switch (button) {
      case "settingsButton":
        this.toggleSettings();
        break;
      case "tabButton1":
        document.getElementById("tab1").classList.remove("hidden");
        document.getElementById("tab2").classList.add("hidden");
        document.getElementById("tab3").classList.add("hidden");

        document.getElementById("tabButton1").classList.add("active");
        document.getElementById("tabButton2").classList.remove("active");
        document.getElementById("tabButton3").classList.remove("active");
        break;
      case "tabButton2":
        document.getElementById("tab1").classList.add("hidden");
        document.getElementById("tab2").classList.remove("hidden");
        document.getElementById("tab3").classList.add("hidden");

        document.getElementById("tabButton1").classList.remove("active");
        document.getElementById("tabButton2").classList.add("active");
        document.getElementById("tabButton3").classList.remove("active");
        break;
      case "tabButton3":
        document.getElementById("tab1").classList.add("hidden");
        document.getElementById("tab2").classList.add("hidden");
        document.getElementById("tab3").classList.remove("hidden");

        document.getElementById("tabButton1").classList.remove("active");
        document.getElementById("tabButton2").classList.remove("active");
        document.getElementById("tabButton3").classList.add("active");
        break;
      case "buyButton1":
        core.gamePlayManager.buyItem({ item: "negativeMagnet" });
        break;
      case "buyButton2":
        core.gamePlayManager.buyItem({ item: "positiveMagnet" });
        break;
      case "buyButton3":
        core.gamePlayManager.buyItem({ item: "strongNegativeMagnet" });
        break;
      case "buyButton4":
        core.gamePlayManager.buyItem({ item: "strongPositiveMagnet" });
        break;
      case "buyButton6":
        core.gamePlayManager.buyItem({ item: "cube" });
        break;
      case "buyButton7":
        core.gamePlayManager.buyItem({ item: "ramp" });
        break;
      case "cancelButton":
        core.gamePlayManager.cancelPurchase();
        break;
      case "shaderButton1":
        core.gamePlayManager.setRenderingMode("toon");
        break;
      case "shaderButton2":
        core.gamePlayManager.setRenderingMode("lambertian");
        break;
    }
  }
}
