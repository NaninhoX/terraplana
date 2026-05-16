import { createRenderer } from './core/renderer.js';
import { createScene, camera } from './core/scene.js';
import { createOrbitControls } from './core/controls.js';
import { setupLighting } from './core/lighting.js';
import { createDisc } from './objects/disc.js';
import { createIceWall } from './objects/iceWall.js';
import { createSun, updateSunPosition, getSunLight } from './objects/sun.js';
import { createMoon, updateMoonPosition, getMoonHeight } from './objects/moon.js';
import { createStars } from './objects/stars.js';
import { createTropics } from './geometry/tropics.js';
import { createGrid } from './geometry/grid.js';
import { createLabels } from './geometry/labels.js';
import { DR, SUN_H } from './utils/constants.js';
import { sunRadius, moonRadius, sunAngle, moonAngle } from './utils/orbits.js';
import { initUI, updateUI } from './ui/elements.js';
import { initEvents, getTimeState, getAnimSpeed } from './ui/events.js';
import { startAnimation } from './animation/animate.js';

// Setup
const renderer = createRenderer();
document.getElementById('cv').appendChild(renderer.domElement);

const scene = createScene();
window.camera = camera; // exportar
const controls = createOrbitControls(camera, renderer.domElement);

setupLighting(scene);

// Criar objetos
createDisc(scene);
createIceWall(scene);
createStars(scene);
createTropics(scene);
createGrid(scene);
createLabels(scene);

// Sol e Lua
const sunGroup = createSun(scene);
const sunLight = getSunLight();
const moonGroup = createMoon(scene);

// UI
initUI();
initEvents();

// Animação
function update() {
    const { timeMin, dayYear, dayMoon } = getTimeState();
    const animSpeed = getAnimSpeed();
    
    // Posições
    const sr = sunRadius(dayYear);
    const sa = sunAngle(timeMin);
    const mr = moonRadius(dayMoon);
    const ma = moonAngle(timeMin);
    const moonHeight = getMoonHeight(dayMoon);
    
    updateSunPosition(sunGroup, sr, sa);
    updateMoonPosition(moonGroup, mr, ma, moonHeight);
    
    // Atualizar luz direcional
    if (sunLight) {
        sunLight.position.set(Math.cos(sa) * sr, SUN_H, Math.sin(sa) * sr);
        sunLight.target.position.set(0, 0, 0);
        sunLight.target.updateMatrixWorld();
    }
    
    // Atualizar UI
    updateUI(timeMin, dayYear, dayMoon);
}

// Iniciar
startAnimation(renderer, scene, camera, controls, update);
