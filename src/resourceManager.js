import * as THREE from "three";

export default {
  materials: [],

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

  getMaterial: function (materialName) {
    return this.materials.find((material) => material.name === materialName);
  },
};
