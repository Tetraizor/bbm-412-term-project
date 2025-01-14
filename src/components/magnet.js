import Component from "./component.js";
import { runForSeconds } from "../utils/asyncUtils.js";
import { Vector3 } from "three";
import core from "../core.js";
import Raycast from "./raycast.js";
import Renderer from "./renderer.js";

export default class Magnet extends Component {
  start() {
    // Make grow animation.
    this.gameObject.transform.scale.set(0.1, 0.1, 0.1);

    runForSeconds(0.4, (timeLeft) => {
      const elapsed = 0.4 - timeLeft;
      const elapsedNormal = elapsed / 0.4;

      let scale = 1;
      if (elapsedNormal < 0.7) {
        scale = (elapsedNormal * 1.1) / 0.7;
      } else {
        const progress = (elapsedNormal - 0.7) / 0.3;
        scale = 1.1 - progress * 0.1;
      }

      this.gameObject.transform.setScale(new Vector3(scale, scale, scale));
    });

    core.raycast.addListener(
      this.gameObject.getComponent(Renderer).mesh,
      (result) => {
        if (result.type === "enter") {
          this.gameObject.getComponent(Renderer).toggleOutline(true);
        }

        if (result.type === "exit") {
          this.gameObject.getComponent(Renderer).toggleOutline(false);
        }
      }
    );
  }
}
