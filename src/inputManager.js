export default class InputManager {
  addListener(event, callback) {
    switch (event) {
      case "mouseMove":
        document
          .getElementById("webgl")
          .addEventListener("mousemove", (event) => {
            callback({
              clientX: event.clientX,
              clientY: event.clientY,
            });
          });
        break;
      case "mouseDown":
        document
          .getElementById("webgl")
          .addEventListener("mousedown", (event) => {
            callback({
              clientX: event.clientX,
              clientY: event.clientY,
              clickId: event.button,
            });
          });
        break;
      case "mouseUp":
        document
          .getElementById("webgl")
          .addEventListener("mouseup", (event) => {
            callback({
              clientX: event.clientX,
              clientY: event.clientY,
              clickId: event.button,
            });
          });
        break;
    }
  }
}
