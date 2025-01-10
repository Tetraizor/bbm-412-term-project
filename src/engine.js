import core from "./core.js";

const gameObjects = [];
const instantiationQueue = [];
const destructionQueue = [];

export default {
  // Getters
  gameObjects: () => gameObjects,

  // Engine Lifecycle
  initialize: async function () {
    core.addPreRenderHook(prerender);
    core.addPostRenderHook(postrender);

    await core.initialize();

    // Post initialization
    document
      .getRootNode()
      .addEventListener("contextmenu", (event) => event.preventDefault());
  },

  // GameObject Management
  instantiate: function (gameObject) {
    gameObject.id = crypto.randomUUID();
    gameObject.birthTime = core.time;

    instantiationQueue.push(gameObject);
  },
  destroy: function (id) {
    const objectId = this.findObjectById(id);

    if (objectId) {
      destructionQueue.push(objectId);
      return true;
    } else {
      return false;
    }
  },
  findObjectById: function (id) {
    return gameObjects.find((obj) => obj.id === id);
  },
  findObjectByName: function (name) {
    return gameObjects.find((obj) => obj.name === name);
  },
};

function prerender() {
  // Process destruction queue
  while (destructionQueue.length > 0) {
    const gameObject = destructionQueue.shift();
    gameObject.destroy();

    gameObjects.splice(gameObjects.indexOf(gameObject), 1);
  }

  // Process instantiation queue
  while (instantiationQueue.length > 0) {
    const gameObject = instantiationQueue.shift();
    gameObjects.push(gameObject);

    gameObject.start();
  }

  // Update all game objects
  for (let i = 0; i < gameObjects.length; i++) {
    gameObjects[i].update();
  }
}

function postrender() {}
