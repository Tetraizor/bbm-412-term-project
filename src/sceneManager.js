// sceneManager.js

class SceneManager {
    constructor() {
        this.activeScene = null; // This will hold the currently active scene
        this.scenes = [];
    }

    addScene(scene) {
        this.scenes.push(scene);
        this.activeScene = scene; // Automatically set the last added scene as the active one
    }

    setActiveScene(scene) {
        this.activeScene = scene;
    }

    getActiveScene() {
        return this.activeScene;
    }

    addObject(gameObject) {
        if (this.activeScene) {
            this.activeScene.add(gameObject);  // Ensure the object is added to the active scene
        } else {
            console.error("No active scene available.");
        }
    }
}

export const sceneManager = new SceneManager();
