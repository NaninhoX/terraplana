import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ── RENDERER ──
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('cv').appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 2000);
camera.position.set(0, 140, 190);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 30;
controls.maxDistance = 700;

window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});

// ── CONSTANTS ──
const DR = 100;          // disc radius
const AR = 3;            // arctic inner radius
const R_CANCER = 38;     // Tropic of Cancer radius
const R_EQUATOR = 55;    // Equator radius
const R_CAPRI = 72;      // Tropic of Capricorn radius
const SUN_H = 28;           // Altura FIXA do Sol
const MOON_H_BASE = 28;     // Altura base da Lua (mesma do Sol)
const MOON_H_VARIATION = 12; // Variação de altura (sobe +12, desce -12)

// ── LIGHTING ──
// Ambiente baixo para sombras profundas
scene.add(new THREE.AmbientLight(0x224455, 0.018));

// Hemisférica baixa para contraste
const hemi = new THREE.HemisphereLight(0x88aacc, 0x224466, 0.65);
scene.add(hemi);

// Luz direcional do Sol com shadow map ampliado
const sunDirectionalLight = new THREE.DirectionalLight(0xffeedd, 0.01);
sunDirectionalLight.castShadow = true;
sunDirectionalLight.position.set(0, SUN_H, 0);
sunDirectionalLight.target.position.set(0, 0, 0);

// AUMENTAR a área da sombra para cobrir TODO o disco
sunDirectionalLight.shadow.mapSize.width = 2048;
sunDirectionalLight.shadow.mapSize.height = 2048;
sunDirectionalLight.shadow.camera.near = 0.5;
sunDirectionalLight.shadow.camera.far = 200;
sunDirectionalLight.shadow.camera.left = -120;   // 👈 COBRE O DISCO INTEIRO
sunDirectionalLight.shadow.camera.right = 120;   // 👈 (DR=100, então 120 sobra)
sunDirectionalLight.shadow.camera.top = 120;
sunDirectionalLight.shadow.camera.bottom = -120;
scene.add(sunDirectionalLight);
scene.add(sunDirectionalLight.target);

// Luz de preenchimento baixíssima para não clarear demais
const fillLight = new THREE.PointLight(0x6688aa, 0.12);
fillLight.position.set(0, 15, 0);
scene.add(fillLight);

// ── STARS ──
const starGroup = new THREE.Group();
scene.add(starGroup);
(() => {
    const N = 6000, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
        const r = 700 + Math.random() * 300,
            t = Math.random() * Math.PI * 2,
            p = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(p) * Math.cos(t);
        pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
        pos[i * 3 + 2] = r * Math.cos(p);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    starGroup.add(new THREE.Points(g,
        new THREE.PointsMaterial({ color: 0xffffff, size: 0.85, sizeAttenuation: true, transparent: true, opacity: 0.82 })));
})();

// ── TEXTURA PROCEDURAL DO DISCO ──
function createProceduralTexture() {
    const canvasTex = document.createElement('canvas');
    canvasTex.width = 1024;
    canvasTex.height = 1024;
    const ctx = canvasTex.getContext('2d');
    
    // Fundo oceano
    ctx.fillStyle = '#2a6a9a';
    ctx.fillRect(0, 0, canvasTex.width, canvasTex.height);
    
    // Gradiente
    const grad = ctx.createLinearGradient(0, 0, canvasTex.width, canvasTex.height);
    grad.addColorStop(0, '#1a5a8a');
    grad.addColorStop(1, '#3a7aaa');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasTex.width, canvasTex.height);
    
    // Continentes
    ctx.fillStyle = '#8B5A2B';
    ctx.beginPath();
    ctx.ellipse(350, 450, 130, 110, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(550, 400, 140, 120, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(280, 300, 150, 130, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(700, 350, 200, 150, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(750, 650, 90, 70, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Ártico
    ctx.fillStyle = '#c9ddee';
    ctx.beginPath();
    ctx.arc(512, 512, 120, 0, Math.PI * 2);
    ctx.fill();
    
    // Detalhes
    ctx.fillStyle = '#c9a87b';
    ctx.beginPath();
    ctx.ellipse(400, 580, 80, 60, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(600, 600, 70, 55, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Ruído
    ctx.globalCompositeOperation = 'overlay';
    for (let i = 0; i < 8000; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.1})`;
        ctx.fillRect(Math.random() * canvasTex.width, Math.random() * canvasTex.height, 2, 2);
    }
    ctx.globalCompositeOperation = 'source-over';
    
    const texture = new THREE.CanvasTexture(canvasTex);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 1);
    return texture;
}

const discTexture = createProceduralTexture();

// ── DISC (TERRA) ──
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
disc.receiveShadow = true;   // 👈 RECEBER SOMBRA (já tem)
disc.castShadow = false;      // 👈 NÃO PROJETAR SOMBRA
scene.add(disc);

// Borda do disco
const edgeMat = new THREE.MeshStandardMaterial({ color: 0x2a4020, roughness: 0.95 });
const edgeRing = new THREE.Mesh(new THREE.CylinderGeometry(DR, DR, 2, 128, 1, true), edgeMat);
scene.add(edgeRing);

// ── ANTARCTICA ICE WALL ──
const iceGroup = new THREE.Group();
scene.add(iceGroup);
const ICE_H = 12, ICE_IR = DR, ICE_OR = DR + 8;

const iceWall = new THREE.Mesh(
    new THREE.CylinderGeometry(ICE_OR, ICE_OR + 2, ICE_H, 128, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xc0e0ff, roughness: 0.38, metalness: 0.12,
        emissive: 0x1a3860, emissiveIntensity: 0.25, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
);
iceWall.position.y = ICE_H / 2 - 1;
iceGroup.add(iceWall);

const iceRingMesh = new THREE.Mesh(
    new THREE.RingGeometry(ICE_IR, ICE_OR + 2, 128),
    new THREE.MeshStandardMaterial({ color: 0xd8eeff, roughness: 0.3, metalness: 0.15, emissive: 0x2050a0, emissiveIntensity: 0.1 })
);
iceRingMesh.rotation.x = -Math.PI / 2;
iceRingMesh.position.y = 1.1;
iceGroup.add(iceRingMesh);

// Picos de gelo
for (let i = 0; i < 90; i++) {
    const a = (i / 90) * Math.PI * 2, h = 2 + Math.random() * 9, r = ICE_IR + 2 + Math.random() * 5;
    const spike = new THREE.Mesh(
        new THREE.ConeGeometry(0.25 + Math.random() * 0.5, h, 5),
        new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(0.6, 0.35, 0.68 + Math.random() * 0.2), roughness: 0.28, metalness: 0.22, transparent: true, opacity: 0.85 })
    );
    spike.position.set(Math.cos(a) * r, 1 + h / 2, Math.sin(a) * r);
    spike.rotation.y = Math.random() * Math.PI;
    iceGroup.add(spike);
}

// ── GRID LINES ──
const gridGroup = new THREE.Group();
scene.add(gridGroup);
const Y0 = 1.15;
const gMat = new THREE.LineBasicMaterial({ color: 0x2255aa, transparent: true, opacity: 0.4 });

for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const points = [
        new THREE.Vector3(Math.cos(a) * AR, Y0, Math.sin(a) * AR),
        new THREE.Vector3(Math.cos(a) * DR, Y0, Math.sin(a) * DR)
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    gridGroup.add(new THREE.Line(geometry, gMat));
}

[14, 28, 42, 62, 78, 92].forEach(r => {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * r, Y0, Math.sin(a) * r));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(pts);
    gridGroup.add(new THREE.Line(geometry, gMat));
});

// ── TROPICS & EQUATOR ──
const tropicsGroup = new THREE.Group();
scene.add(tropicsGroup);
const YL = 1.2;

function circleLine(r, c, op = 1) {
    const pts = [];
    for (let i = 0; i <= 200; i++) {
        const a = (i / 200) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * r, YL, Math.sin(a) * r));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(pts);
    return new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: c, transparent: op < 1, opacity: op }));
}

tropicsGroup.add(circleLine(R_CANCER, 0xff6600, 0.9));
tropicsGroup.add(circleLine(R_EQUATOR, 0x00ff88, 0.9));
tropicsGroup.add(circleLine(R_CAPRI, 0x2299ff, 0.9));

// ── LABELS (CSS2D) ──
const labelsGroup = new THREE.Group();
scene.add(labelsGroup);

function makeLabel(txt, color = '#fff', bg = 'rgba(0,0,0,0.7)', fs = 23) {
    const cv = document.createElement('canvas');
    cv.width = 512;
    cv.height = 60;
    const cx = cv.getContext('2d');
    cx.fillStyle = bg;
    cx.roundRect(0, 3, 512, 54, 7);
    cx.fill();
    cx.font = `bold ${fs}px monospace`;
    cx.fillStyle = color;
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText(txt, 256, 30);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true }));
    sp.scale.set(20, 2.4, 1);
    return sp;
}

// Helper para roundRect
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.moveTo(x + r, y);
        this.lineTo(x + w - r, y);
        this.quadraticCurveTo(x + w, y, x + w, y + r);
        this.lineTo(x + w, y + h - r);
        this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        this.lineTo(x + r, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - r);
        this.lineTo(x, y + r);
        this.quadraticCurveTo(x, y, x + r, y);
        return this;
    };
}

const lCancer = makeLabel('Trópico de Câncer', '#ff8844');
lCancer.position.set(R_CANCER + 1, YL + 1, 0);
labelsGroup.add(lCancer);

const lEquat = makeLabel('Equador', '#44ffaa');
lEquat.position.set(-(R_EQUATOR + 1), YL + 1, 0);
labelsGroup.add(lEquat);

const lCapri = makeLabel('Trópico de Capricórnio', '#44aaff');
lCapri.position.set(R_CAPRI + 1, YL + 1, 0);
labelsGroup.add(lCapri);

const lNP = makeLabel('Polo Norte (Ártico)', '#cce0ff', 'rgba(0,0,50,0.7)', 27);
lNP.position.set(0, YL + 3, 0);
labelsGroup.add(lNP);

const lAnt = makeLabel('MURALHA DA ANTÁRTIDA', '#aaddff', 'rgba(0,15,35,0.8)', 27);
lAnt.position.set(-(DR + 4), YL + ICE_H + 1, 0);
labelsGroup.add(lAnt);

// ── NORTH POLE MARKER ──
const poleMat = new THREE.MeshStandardMaterial({ color: 0xff3333, emissive: 0xcc0000, emissiveIntensity: 0.6 });
const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 11, 10), poleMat);
pole.position.y = 1 + 5.5;
scene.add(pole);

const poleCap = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 10),
    new THREE.MeshStandardMaterial({ color: 0xff1111, emissive: 0xff0000, emissiveIntensity: 0.9 }));
poleCap.position.y = 1 + 11.3;
scene.add(poleCap);

// ── SUN ──
const sunGroup = new THREE.Group();
scene.add(sunGroup);

const sunCore = new THREE.Mesh(new THREE.SphereGeometry(4, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xffee44 }));
sunGroup.add(sunCore);

[[5.5, 0xffee88, 0.35], [7, 0xff9900, 0.14], [9, 0xff6600, 0.06]].forEach(([r, c, o]) => {
    sunGroup.add(new THREE.Mesh(new THREE.SphereGeometry(r, 32, 32),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, side: THREE.BackSide })));
});

const sunLight = new THREE.PointLight(0xfff5e0, 100, 420, 1.0);
sunGroup.add(sunLight);

// Cone de luz
const coneGroup = new THREE.Group();
sunGroup.add(coneGroup);
const coneMesh = new THREE.Mesh(
    new THREE.ConeGeometry(40, 40, 40, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xffe070, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false })
);
coneMesh.position.y = -16;
coneGroup.add(coneMesh);

const sunLabel = makeLabel('☀ Sol', '#ffee44', 'rgba(50,25,0,0.75)', 27);
sunLabel.position.y = 6;
sunGroup.add(sunLabel);

// ── MOON ──
const moonGroup = new THREE.Group();
scene.add(moonGroup);
const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xaabccc, roughness: 0.9, metalness: 0, emissive: 0x101820, emissiveIntensity: 0.18 }));
moonGroup.add(moonMesh);
moonGroup.add(new THREE.Mesh(new THREE.SphereGeometry(3.2, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x6688aa, transparent: true, opacity: 0.07, side: THREE.BackSide })));
const moonLabel = makeLabel('☽ Lua', '#99bbdd', 'rgba(0,8,25,0.75)', 27);
moonLabel.position.y = 4.5;
moonGroup.add(moonLabel);

// ── ATMOSPHERE RING ──
const atmosphereRing = new THREE.Mesh(
    new THREE.CylinderGeometry(DR + 3, DR + 3, 1.5, 128, 1, false),
    new THREE.MeshBasicMaterial({ color: 0x2288ff, transparent: true, opacity: 0.055 })
);
atmosphereRing.position.y = 1.6;
scene.add(atmosphereRing);

// ── STATE ──
let timeMin = 720;      // minutes (0–1440) - começa ao meio-dia
let dayYear = 1;
let dayMoon = 1;
let animSpeed = 0;      // minutes per second of real time (0 = pausado)
let lastTimestamp = 0;
let accumulatedDelta = 0;

// Velocidades disponíveis (em minutos virtuais por segundo real)
const speedLevels = {
    '0': 0,      // Pausado
    '60': 60,    // 1 min virtual por segundo real (1x)
    '600': 600,  // 10x
    '3600': 3600, // 60x
    '21600': 21600, // 360x
    '86400': 86400 // 1 dia virtual por segundo (1440x)
};

// ── HELPERS ──
function sunRadius(dy) {
    const phase = Math.cos(((dy - 1) / 365 - 0.47) * 2 * Math.PI);
    const mid = (R_CANCER + R_CAPRI) / 2;
    const half = (R_CAPRI - R_CANCER) / 2;
    return mid - phase * half;
}

function moonRadius(dm) {
    const phase = Math.cos(((dm - 1) / 28) * 2 * Math.PI);
    const mid = (R_CANCER + R_CAPRI) / 2;
    const half = (R_CAPRI - R_CANCER) / 2;
    return mid - phase * half * 0.65;
}

// Função para calcular altura da Lua baseada no dia lunar
function getMoonHeight(moonDay) {
    // Lua Cheia (dia 14) → mais ALTA (+12)
    // Lua Nova (dia 0/28) → mais BAIXA (-12)
    const phase = Math.cos(((moonDay - 1) / 28) * Math.PI * 2);
    // phase = +1 em Lua Cheia, -1 em Lua Nova
    return MOON_H_BASE + MOON_H_VARIATION * phase;
}

// ── FUNÇÃO PARA VERIFICAR ECLIPSE LUNAR (CORRIGIDA) ──
function checkLunarEclipse() {
    const sunAnglePos = sunAngle(timeMin);
    const moonAnglePos = moonAngle(timeMin);
    const moonHeight = getMoonHeight(dayMoon);
    
    // Alinhamento OPOSTO (diferença de 180°)
    let angleDiff = Math.abs(moonAnglePos - sunAnglePos) % (Math.PI * 2);
    if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
    const isOpposite = angleDiff > Math.PI - 0.15 && angleDiff < Math.PI + 0.15;
    
    // Condição: Lua Cheia (altura alta) E lados opostos
    const isFullMoon = moonHeight > 35;
    const isLunarEclipse = isFullMoon && isOpposite;
    
    if (isLunarEclipse) {
        // Lua de sangue: reflexão da luz solar na Terra
        // Cor avermelhada porque a luz refletida no disco (terra, oceanos, continentes)
        moonMesh.material.color.setHex(0xaa5533);
        moonMesh.material.emissiveIntensity = 0.15;
        return true;
    }
    return false;
}

// ── FUNÇÃO PARA VERIFICAR ECLIPSE SOLAR ──
function checkSolarEclipse() {
    const sunAnglePos = sunAngle(timeMin);
    const moonAnglePos = moonAngle(timeMin);
    const moonHeight = getMoonHeight(dayMoon);
    
    // Alinhamento no MESMO lado (diferença pequena)
    let angleDiff = Math.abs(moonAnglePos - sunAnglePos) % (Math.PI * 2);
    const isAligned = angleDiff < 0.1 || (Math.PI * 2 - angleDiff) < 0.1;
    
    // Eclipse solar: Lua mais baixa E mesmo lado
    const isLowMoon = moonHeight < SUN_H - 6;
    const isSolarEclipse = isAligned && isLowMoon;
    
    if (isSolarEclipse) {
        // Sol escurece
        sunLight.intensity = 15;
        sunDirectionalLight.intensity = 0.15;
        return true;
    } else {
        sunLight.intensity = 100;
        sunDirectionalLight.intensity = 2.2;
        return false;
    }
}

function sunAngle(tm) { return (tm / 1440) * Math.PI * 2; }
function moonAngle(tm) { return (tm / 1440) * Math.PI * 2 * 1.035; }

function seasonName(d) {
    if (d < 80 || d >= 355) return 'Inverno N / Verão S';
    if (d < 172) return 'Primavera N / Outono S';
    if (d < 266) return 'Verão N / Inverno S';
    return 'Outono N / Primavera S';
}

function moonPhase(dm) {
    const t = ((dm - 1) % 28) / 28;
    if (t < 0.06 || t > 0.94) return 'Lua Nova';
    if (t < 0.22) return 'Crescente';
    if (t < 0.28) return 'Quarto Crescente';
    if (t < 0.48) return 'Gibbosa Crescente';
    if (t < 0.56) return 'Lua Cheia';
    if (t < 0.72) return 'Gibbosa Minguante';
    if (t < 0.78) return 'Quarto Minguante';
    return 'Minguante';
}

function fmtTime(tm) {
    const h = Math.floor(tm / 60) % 24;
    const m = Math.floor(tm % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// ── UPDATE POSITIONS ──
function updatePositions() {
    const sa = sunAngle(timeMin);
    const sr = sunRadius(dayYear);
    const ma = moonAngle(timeMin);
    const mr = moonRadius(dayMoon);
    const moonHeight = getMoonHeight(dayMoon);  // 👈 ALTURA VARIÁVEL DA LUA
    
    // Posicionar Sol (altura FIXA)
    sunGroup.position.set(Math.cos(sa) * sr, SUN_H, Math.sin(sa) * sr);
    
    // Atualizar luz direcional
    sunDirectionalLight.position.set(Math.cos(sa) * sr, SUN_H, Math.sin(sa) * sr);
    sunDirectionalLight.target.position.set(0, 0, 0);
    sunDirectionalLight.target.updateMatrixWorld();
    
    // Posicionar Lua (altura VARIÁVEL)
    moonGroup.position.set(Math.cos(ma) * mr, moonHeight, Math.sin(ma) * mr);
}

// ── UI ELEMENTS ──
const slH = document.getElementById('sl-hour');
const slY = document.getElementById('sl-year');
const slM = document.getElementById('sl-moon');
const lblH = document.getElementById('lbl-h');
const lblY = document.getElementById('lbl-y');
const lblM = document.getElementById('lbl-m');
const dTime = document.getElementById('d-time');
const dDay = document.getElementById('d-day');
const dSeason = document.getElementById('d-season');
const dMoon = document.getElementById('d-moon');

function syncPct(el) {
    const pct = ((el.value - el.min) / (el.max - el.min)) * 100;
    el.style.setProperty('--pct', pct + '%');
}

function refreshUI() {
    const h = fmtTime(timeMin);
    dTime.textContent = h;
    dDay.textContent = Math.floor(dayYear);
    dSeason.textContent = seasonName(Math.floor(dayYear));
    dMoon.textContent = moonPhase(dayMoon);
    lblH.textContent = h;
    lblY.textContent = Math.floor(dayYear);
    lblM.textContent = Math.floor(dayMoon);
    
    // Atualizar sliders sem disparar eventos
    slH.value = Math.round(timeMin);
    syncPct(slH);
    slY.value = Math.round(dayYear);
    syncPct(slY);
    slM.value = Math.round(dayMoon);
    syncPct(slM);
    
    updatePositions();
}

// Event listeners com throttle para evitar atualizações excessivas
let uiUpdateScheduled = false;
function scheduleUIUpdate() {
    if (!uiUpdateScheduled) {
        uiUpdateScheduled = true;
        requestAnimationFrame(() => {
            refreshUI();
            uiUpdateScheduled = false;
        });
    }
}

slH.addEventListener('input', () => { 
    timeMin = parseFloat(slH.value); 
    syncPct(slH);
    refreshUI();
});
slY.addEventListener('input', () => { 
    dayYear = parseFloat(slY.value); 
    syncPct(slY);
    refreshUI();
});
slM.addEventListener('input', () => { 
    dayMoon = parseFloat(slM.value); 
    syncPct(slM);
    refreshUI();
});

// Speed buttons
document.querySelectorAll('.sbtn').forEach(b => {
    b.addEventListener('click', () => {
        const speedValue = b.dataset.sp;
        animSpeed = speedLevels[speedValue] || 0;
        document.querySelectorAll('.sbtn').forEach(x => x.classList.remove('on'));
        b.classList.add('on');
    });
});

// Visibility toggles
const togMap = { 
    grid: gridGroup, 
    tropics: tropicsGroup, 
    labels: labelsGroup, 
    stars: starGroup, 
    ice: iceGroup 
};
document.querySelectorAll('.tbtn').forEach(b => {
    b.addEventListener('click', () => {
        b.classList.toggle('on');
        const key = b.dataset.tog;
        const on = b.classList.contains('on');
        if (key === 'cone') {
            coneGroup.visible = on;
        } else if (togMap[key]) {
            togMap[key].visible = on;
        }
    });
});

// Panel collapse
document.querySelectorAll('.ptitle[data-p]').forEach(t => {
    t.addEventListener('click', () => {
        const panel = document.getElementById(t.dataset.p);
        if (panel) panel.classList.toggle('shut');
    });
});

// Status bar toggle
const statToggle = document.getElementById('stat-toggle');
const statusBar = document.getElementById('status-bar');
if (statToggle && statusBar) {
    statToggle.addEventListener('click', () => {
        statToggle.classList.toggle('open');
        statusBar.classList.toggle('shut');
    });
}

// Master UI toggle
const uiPill = document.getElementById('ui-pill');
const uiDiv = document.getElementById('ui');
if (uiPill && uiDiv) {
    uiPill.addEventListener('click', () => {
        const hidden = uiDiv.classList.toggle('hidden');
        uiPill.classList.toggle('off', hidden);
        uiPill.innerHTML = hidden
            ? '<span class="dot"></span>Mostrar UI'
            : '<span class="dot"></span>Interface';
    });
}

// ── ANIMATION COM FRAME RATE CONTROL ──
function updateTime(deltaSeconds) {
    if (animSpeed <= 0) return;
    
    // Atualizar tempo baseado na velocidade (delta em minutos)
    const deltaMinutes = deltaSeconds * (animSpeed / 60);
    timeMin += deltaMinutes;
    
    // Avançar dias conforme necessário
    const daysPassed = Math.floor(timeMin / 1440);
    if (daysPassed > 0) {
        timeMin = timeMin % 1440;
        dayYear += daysPassed;
        dayMoon += daysPassed;
        
        // Loop nos ciclos
        while (dayYear > 365) dayYear -= 365;
        while (dayMoon > 28) dayMoon -= 28;
    }
    
    refreshUI();
}

let lastFrameTime = 0;
let frameCount = 0;
let fps = 60;

function animate(currentTime) {
    requestAnimationFrame(animate);
    
    // Calcular delta time
    if (lastFrameTime === 0) {
        lastFrameTime = currentTime;
        return;
    }
    
    let delta = Math.min(0.033, (currentTime - lastFrameTime) / 1000);
    if (delta < 0.001) return;
    lastFrameTime = currentTime;
    
    // Limitar FPS máximo para evitar flickering (máx 60fps)
    if (delta < 0.016) {
        // Pequeno delay para não sobrecarregar
        return;
    }
    
    // Atualizar tempo da simulação
    updateTime(delta);
    
    // Rotação dos corpos celestes (apenas visual, não afeta posição orbital)
    if (sunCore) sunCore.rotation.y += 0.008 * (delta / 0.016);
    if (moonMesh) moonMesh.rotation.y += 0.004 * (delta / 0.016);
    if (starGroup) starGroup.rotation.y += 0.00002 * (delta / 0.016);
    
    // Controls e renderização
    controls.update();
    renderer.render(scene, camera);
}

// Iniciar animação
refreshUI();
animate(0);

// Hide loading
setTimeout(() => {
    const l = document.getElementById('loading');
    if (l) {
        l.style.opacity = '0';
        setTimeout(() => l.style.display = 'none', 550);
    }
}, 700);

// Inicializar porcentagens
syncPct(slH);
syncPct(slY);
syncPct(slM);
