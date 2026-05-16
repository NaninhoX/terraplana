import { MOON_H_BASE } from '../utils/constants.js';

export function createMoon(scene) {
    const moonGroup = new THREE.Group();
    
    const moonMesh = new THREE.Mesh(
        new THREE.SphereGeometry(3, 32, 32),
        new THREE.MeshStandardMaterial({
            color: 0xaabccc,
            roughness: 0.9,
            metalness: 0,
            emissive: 0x101820,
            emissiveIntensity: 0.18
        })
    );
    moonGroup.add(moonMesh);
    
    // Glow da Lua
    moonGroup.add(new THREE.Mesh(
        new THREE.SphereGeometry(3.2, 32, 32),
        new THREE.MeshBasicMaterial({
            color: 0x6688aa,
            transparent: true,
            opacity: 0.07,
            side: THREE.BackSide
        })
    ));
    
    scene.add(moonGroup);
    return { moonGroup, moonMesh };
}

export function updateMoonPosition(moonGroup, radius, angle, height) {
    moonGroup.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
}

export function setMoonEclipseColor(moonMesh, isEclipse) {
    if (isEclipse) {
        moonMesh.material.color.setHex(0xaa5533);
        moonMesh.material.emissiveIntensity = 0.15;
    } else {
        moonMesh.material.color.setHex(0xaabccc);
        moonMesh.material.emissiveIntensity = 0.18;
    }
}

export function getMoonHeight(moonDay) {
    const phase = Math.cos(((moonDay - 1) / 28) * Math.PI * 2);
    return MOON_H_BASE + MOON_H_VARIATION * phase;
}
