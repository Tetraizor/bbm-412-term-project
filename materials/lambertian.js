import * as THREE from 'three';

export default async function lambertian() {
    const vertex = await ((await fetch('./materials/lambertianV.glsl')).text());
    const fragment = await ((await fetch('./materials/lambertianF.glsl')).text());

    return new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        name: 'Lambertian',
        glslVersion: THREE.GLSL3,
        uniforms: {
            lightPosition: { value: new THREE.Vector3(30, 30, 30) },
            ambientColor: { value: new THREE.Color(0.0, 0.0, 0.0) },
            baseColor: { value: new THREE.Color(1.0, 1.0, 1.0) },
        }
    });
}