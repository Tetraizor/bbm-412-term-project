import Transform from './components/transform.js';
import { sceneManager } from './sceneManager.js';

export default class GameObject {
    id = null;
    name = '';
    tags = [];
    components = [];
    birthTime = 0;
    scene = null;

    transform = null;

    constructor(name, components = [], tags = []) {
        this.name = name;
        this.tags = tags;

        // Ensure the transform is part of the components array
        this.transform = new Transform();
        this.components = [this.transform, ...components]; 

        // Assign components to this gameObject
        components.forEach(component => {
            component.gameObject = this;
        });

        // Automatically set the scene for this object if available in sceneManager
        sceneManager.addObject(this);

        // If active scene is available, set it
        this.setScene(sceneManager.getActiveScene());  
    }

    destroy() {
        this.components.forEach(component => {
            if (component.isComponent) {
                component.destroy();
            } else {
                console.error('Cannot destroy non-component');
            }
        });

        // Optional: Remove from the scene if needed
        if (this.scene) {
            this.scene.removeObject(this);
        }
    }

    start() {
        this.components.forEach(component => {
            if (component.isComponent) {
                component.start();
            } else {
                console.error('Cannot start non-component');
            }
        });
    }

    update() {
        this.components.forEach(component => {
            if (component.isComponent) {
                component.update();
            } else {
                console.error('Cannot update non-component');
            }
        });
    }

    // Get the component of a specific type
    getComponent(type) {
        if (typeof type !== 'function') {
            console.error(`Provided type is not a valid function. Got: ${typeof type}`);
            return null;
        }

        const component = this.components.find(component => component instanceof type);
        if (!component) {
            console.warn(`No component of type "${type.name}" found on ${this.name}.`);
        }
        return component;
    }

    // Set the scene for this object, can be called externally
    setScene(scene) {
        if (scene) {
            this.scene = scene;
            console.log(`Scene set for ${this.name}: ${scene.name}`);
        } else {
            console.error('Scene is undefined or not available.');
        }
    }

    // New method to find objects by tag in the scene
    static findObjectByTag(scene, tag) {
        const gameObject = scene.find(gameObject => gameObject.tags.includes(tag));
        if (!gameObject) {
            console.error(`No GameObject with tag "${tag}" found.`);
        }
        return gameObject;
    }
}
