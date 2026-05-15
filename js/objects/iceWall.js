import * as THREE from 'three';
import { ICE_H, ICE_IR, ICE_OR } from '../utils/constants.js';

export function createIceWall(scene) {
    const iceGroup = new THREE.Group();
    
    // Parede principal
    const iceWall = new THREE.Mesh(
        new THREE.CylinderGeometry(ICE_OR, ICE_OR + 2, ICE_H, 128, 1, true),
        new THREE.MeshStandardMaterial({
            color: 0xc0e0ff,
            roughness: 0.38,
            metalness: 0.12,
            emissive: 0x1a3860,
            emissiveIntensity: 0.25,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
        })
    );
    iceWall.position.y = ICE_H / 2 - 1;
    iceGroup.add(iceWall);
    
    // Anel superior
    const iceRing = new THREE.Mesh(
        new THREE.RingGeometry(ICE_IR, ICE_OR + 2, 128),
        new THREE.MeshStandardMaterial({
            color: 0xd8eeff,
            roughness: 0.3,
            metalness: 0.15,
            emissive: 0x2050a0,
            emissiveIntensity: 0.1
        })
    );
    iceRing.rotation.x = -Math.PI / 2;
    iceRing.position.y = 1.1;
    iceGroup.add(iceRing);
    
    // Picos de gelo
    for (let i = 0; i < 90; i++) {
        const a = (i / 90) * Math.PI * 2;
        const h = 2 + Math.random() * 9;
        const r = ICE_IR + 2 + Math.random() * 5;
        const spike = new THREE.Mesh(
            new THREE.ConeGeometry(0.25 + Math.random() * 0.5, h, 5),
            new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(0.6, 0.35, 0.68 + Math.random() * 0.2),
                roughness: 0.28,
                metalness: 0.22,
                transparent: true,
                opacity: 0.85
            })
        );
        spike.position.set(Math.cos(a) * r, 1 + h / 2, Math.sin(a) * r);
        spike.rotation.y = Math.random() * Math.PI;
        iceGroup.add(spike);
    }
    
    scene.add(iceGroup);
    return iceGroup;
}
