import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";

export default {
  scene: null,
  camera: null,
  renderer: null,
  directionalLight: null,
  ambientLight: null,

  prerenderHooks: [],
  postrenderHooks: [],

  time: 0,
  lastTime: 0,
  deltaTime: 0,
  fps: 0,

  // Initialization of the Three.js setup
  initialize: function () {
    this._initializeScene();
    this._initializeCamera();
    this._initializeRenderer();

    this._checkWebGLSupport();
  },

  // Initialize the scene
  _initializeScene: function () {
    this.scene = new THREE.Scene();
  },

  // Initialize the camera
  _initializeCamera: function () {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5; // Set default camera position
  },

  // Initialize the renderer
  _initializeRenderer: function () {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    const container = document.getElementById("webgl");

    if (container) {
      container.appendChild(this.renderer.domElement);
    } else {
      console.error('Cannot find element with id "webgl"');
    }

    window.addEventListener("resize", () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  },

  // Check if WebGL2 is available and start rendering loop
  _checkWebGLSupport: function () {
    if (WebGL.isWebGL2Available()) {
      this._startRenderLoop();
    } else {
      this._displayWebGLWarning();
    }
  },

  // Start the rendering loop
  _startRenderLoop: function () {
    const targetFPS = 144;
    const frameTime = 1000 / targetFPS;
    let lastRenderTime = 0;

    const animate = () => {
      const currentTime = performance.now();
      const timeSinceLastRender = currentTime - lastRenderTime;

      if (timeSinceLastRender >= frameTime) {
        this.time = currentTime;
        this.deltaTime = this.time - this.lastTime;
        this.lastTime = this.time;

        this._runPreRenderHooks();
        this.renderer.render(this.scene, this.camera);
        this._runPostRenderHooks();

        lastRenderTime = currentTime;
      }

      this.fps = Math.round(1000 / timeSinceLastRender);

      // Continue the loop
      requestAnimationFrame(animate);
    };

    // Start the animation loop
    animate();
  },

  // Run all prerender hooks
  _runPreRenderHooks: function () {
    for (let hook of this.prerenderHooks) {
      hook();
    }
  },

  // Run all postrender hooks
  _runPostRenderHooks: function () {
    for (let hook of this.postrenderHooks) {
      hook();
    }
  },

  // Display WebGL2 error message
  _displayWebGLWarning: function () {
    const warning = WebGL.getWebGL2ErrorMessage();
    document.getElementById("container").appendChild(warning);
  },

  // Method to create a primitive in the scene
  createMesh(mesh) {
    if (mesh) {
      this.scene.add(mesh);
    } else {
      console.error("Cannot add mesh to scene: mesh is undefined");
    }
  },

  removeMesh(object3D) {
    if (!(object3D instanceof THREE.Object3D)) return false;

    // for better memory management and performance
    if (object3D.geometry) object3D.geometry.dispose();

    if (object3D.material) {
      if (object3D.material instanceof Array) {
        // for better memory management and performance
        object3D.material.forEach((material) => material.dispose());
      } else {
        // for better memory management and performance
        object3D.material.dispose();
      }
    }
    object3D.removeFromParent(); // the parent might be the scene or another Object3D, but it is sure to be removed this way
    return true;
  },

  // Add a prerender hook (called before rendering)
  addPreRenderHook: function (hook) {
    this.prerenderHooks.push(hook);
  },

  // Remove a prerender hook
  removePreRenderHook: function (hook) {
    const index = this.prerenderHooks.indexOf(hook);
    if (index !== -1) {
      this.prerenderHooks.splice(index, 1);
    }
  },

  // Add a postrender hook (called after rendering)
  addPostRenderHook: function (hook) {
    this.postrenderHooks.push(hook);
  },

  // Remove a postrender hook
  removePostRenderHook: function (hook) {
    const index = this.postrenderHooks.indexOf(hook);
    if (index !== -1) {
      this.postrenderHooks.splice(index, 1);
    }
  },
};
