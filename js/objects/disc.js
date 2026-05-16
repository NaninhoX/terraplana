import { DR } from '../utils/constants.js';
import { createProceduralTexture } from '../utils/texture.js';

export function createDisc(scene) {
    const discTexture = createProceduralTexture();
    
    const disc = new THREE.Mesh(
        new THREE.CylinderGeometry(DR, DR, 2, 256, 1),
        new THREE.MeshStandardMaterial({
            map: discTexture,
            roughness: 0.55,
            metalness: 0.05,
            emissive: 0x1a3050,
            emissiveIntensity: 0.2
        })
    );
    disc.receiveShadow = true;
    disc.castShadow = false;
    scene.add(disc);
    
    // Borda do disco
    const edgeMat = new THREE.MeshStandardMaterial({ color: 0x2a4020, roughness: 0.95 });
    const edgeRing = new THREE.Mesh(new THREE.CylinderGeometry(DR, DR, 2, 128, 1, true), edgeMat);
    scene.add(edgeRing);
    
    // Atmosfera (anel suave)
    const atmosphereRing = new THREE.Mesh(
        new THREE.CylinderGeometry(DR + 3, DR + 3, 1.5, 128, 1, false),
        new THREE.MeshBasicMaterial({ color: 0x2288ff, transparent: true, opacity: 0.055 })
    );
    atmosphereRing.position.y = 1.6;
    scene.add(atmosphereRing);
    
    return disc;
}
