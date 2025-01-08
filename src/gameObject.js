import Transform from "./components/transform.js";

export default class GameObject {
  id = null;
  name = "";
  tags = [];
  components = [];
  birthTime = 0;

  transform = null;

  constructor(name, components = [], tags = []) {
    this.name = name;

    this.transform = new Transform();
    this.components = [this.transform, ...components]; // Ensure transform is part of the components array

    this.tags = tags;

    components.forEach((component) => {
      component.gameObject = this;
    });
  }

  getComponent(type) {
    return this.components.find((component) => component instanceof type);
  }

  destroy() {
    this.components.forEach((component) => {
      if (component.isComponent) {
        component.destroy();
      } else {
        console.error("Cannot destroy non-component");
      }
    });
  }

  start() {
    this.components.forEach((component) => {
      if (component.isComponent) {
        component.start();
      } else {
        console.error("Cannot start non-component");
      }
    });
  }

  update() {
    this.components.forEach((component) => {
      if (component.isComponent) {
        component.update();
      } else {
        component.update();
      }
    });
  }
}
