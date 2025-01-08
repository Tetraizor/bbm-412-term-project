export default class UIManager {
  constructor() {
    this.initialize();
  }

  states = {
    help: false,
    settings: false,
  };

  panels = {
    help: {
      root: document.getElementById("help"),
    },
    settings: {
      root: document.getElementById("settings"),
    },
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

      if (event.key == "Escape" || event.key == "Esc") {
        this.toggle("settings");
      }
    });

    for (let key in this.states) {
      this.toggleForce(key, false);
    }
  }
}
