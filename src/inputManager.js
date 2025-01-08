document.addEventListener("DOMContentLoaded", (event) => {
  // Mouse events
  document.getElementById("webgl").addEventListener("click", (event) => {
    console.log(`Mouse Clicked at: (${event.clientX}, ${event.clientY})`);
  });

  document.getElementById("webgl").addEventListener("mousemove", (event) => {
    console.log(`Mouse Moved to: (${event.clientX}, ${event.clientY})`);
  });

  // Keyboard events
  document.addEventListener("keydown", (event) => {
    console.log(`Key Pressed: ${event.key}`);
  });

  document.addEventListener("keyup", (event) => {
    console.log(`Key Released: ${event.key}`);
  });
});
