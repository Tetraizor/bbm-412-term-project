import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import * as THREE from 'three';

export function loadFBX(path) {
    return new Promise((resolve, reject) => {
        const loader = new FBXLoader();
        loader.load(
            path,
            (object) => {
                resolve(object); // Resolve the Promise with the loaded object
            },
            undefined, // Optional progress callback
            (error) => {
                reject(error); // Reject the Promise if an error occurs
            }
        );
    });
}

export function loadTexture(path) {
    return new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader();
        loader.load(
            path,
            (texture) => {
                resolve(texture); // Resolve the Promise with the loaded texture
            },
            undefined, // Optional progress callback
            (error) => {
                reject(error); // Reject the Promise if an error occurs
            }
        );
    });
}