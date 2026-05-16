import { SUN_H } from '../utils/constants.js';

let sunLight = null;

export function createSun(scene) {
    const sunGroup = new THREE.Group();
    
    // Núcleo do Sol
    const sunCore = new THREE.Mesh(
        new THREE.SphereGeometry(4, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xffee44 })
    );
    sunGroup.add(sunCore);
    
    // Camadas de glow
    [[5.5, 0xffee88, 0.35], [7, 0xff9900, 0.14], [9, 0xff6600, 0.06]].forEach(([r, c, o]) => {
        sunGroup.add(new THREE.Mesh(
            new THREE.SphereGeometry(r, 32, 32),
            new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, side: THREE.BackSide })
        ));
    });
    
    // Luz pontual do Sol
    sunLight = new THREE.PointLight(0xfff5e0, 100, 420, 1.0);
    sunGroup.add(sunLight);
    
    // Cone de luz
    const coneGroup = new THREE.Group();
    const coneMesh = new THREE.Mesh(
        new THREE.ConeGeometry(40, 40, 40, 1, true),
        new THREE.MeshBasicMaterial({
            color: 0xffe070,
            transparent: true,
            opacity: 0.12,
            side: THREE.DoubleSide,
            depthWrite: false
        })
    );
    coneMesh.position.y = -16;
    coneGroup.add(coneMesh);
    sunGroup.add(coneGroup);
    
    scene.add(sunGroup);
    return sunGroup;
}

export function getSunLight() {
    return sunLight;
}

export function updateSunPosition(sunGroup, radius, angle) {
    sunGroup.position.set(Math.cos(angle) * radius, SUN_H, Math.sin(angle) * radius);
}
