import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import * as THREE from "three";

export default {
  materials: [],
  models: [],
  textures: [],

  loadMaterial: async function (
    materialName,
    vertexUrl,
    fragmentUrl,
    uniforms = {}
  ) {
    const vertexSrc = await fetch(vertexUrl).then((res) => res.text());
    const fragmentSrc = await fetch(fragmentUrl).then((res) => res.text());

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexSrc,
      fragmentShader: fragmentSrc,
    });

    this.materials.push({
      name: materialName,
      material: material,
    });

    return material;
  },

  loadModel: async function (name, url) {
    const loader = new FBXLoader();
    const model = await new Promise((resolve, reject) => {
      loader.load(
        url,
        (object) => {
          this.models.push({
            name: name,
            model: object,
          });
          resolve(object);
        },
        undefined,
        (error) => {
          reject(error);
        }
      );
    });

    this.models.push({
      name: name,
      model: model,
    });

    return model;
  },

  loadTexture: async function (name, url) {
    const loader = new THREE.TextureLoader();
    const texture = await new Promise((resolve, reject) => {
      loader.load(
        url,
        (texture) => {
          this.textures.push({
            name: name,
            texture: texture,
          });
          resolve(texture);
        },
        undefined,
        (error) => {
          reject(error);
        }
      );
    });

    return texture;
  },

  getModel: function (modelName) {
    return this.models.find((model) => model.name === modelName)?.model;
  },

  getMaterial: function (materialName) {
    return this.materials
      .find((material) => material.name === materialName)
      ?.material.clone();
  },

  getTexture: function (textureName) {
    return this.textures.find((texture) => texture.name === textureName)
      ?.texture;
  },
};
