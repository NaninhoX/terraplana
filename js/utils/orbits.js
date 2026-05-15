import { R_CANCER, R_CAPRI, MOON_H_BASE, MOON_H_VARIATION, SUN_H } from './constants.js';

// Raio do Sol baseado no dia do ano (oscila entre trópicos)
export function sunRadius(dayYear) {
    const phase = Math.cos(((dayYear - 1) / 365 - 0.47) * 2 * Math.PI);
    const mid = (R_CANCER + R_CAPRI) / 2;
    const half = (R_CAPRI - R_CANCER) / 2;
    return mid - phase * half;
}

// Raio da Lua baseado no dia lunar
export function moonRadius(dayMoon) {
    const phase = Math.cos(((dayMoon - 1) / 28) * 2 * Math.PI);
    const mid = (R_CANCER + R_CAPRI) / 2;
    const half = (R_CAPRI - R_CANCER) / 2;
    return mid - phase * half * 0.65;
}

// Ângulo baseado na hora do dia (0-1440 minutos)
export function sunAngle(timeMin) {
    return (timeMin / 1440) * Math.PI * 2;
}

// Ângulo da Lua (ligeiramente mais rápido)
export function moonAngle(timeMin) {
    return (timeMin / 1440) * Math.PI * 2 * 1.035;
}

// Altura da Lua baseada na fase (Lua Cheia mais alta)
export function getMoonHeight(dayMoon) {
    const phase = Math.cos(((dayMoon - 1) / 28) * Math.PI * 2);
    return MOON_H_BASE + MOON_H_VARIATION * phase;
}

// Fase da Lua por extenso
export function moonPhase(dayMoon) {
    const t = ((dayMoon - 1) % 28) / 28;
    if (t < 0.06 || t > 0.94) return 'Lua Nova';
    if (t < 0.22) return 'Crescente';
    if (t < 0.28) return 'Quarto Crescente';
    if (t < 0.48) return 'Gibbosa Crescente';
    if (t < 0.56) return 'Lua Cheia';
    if (t < 0.72) return 'Gibbosa Minguante';
    if (t < 0.78) return 'Quarto Minguante';
    return 'Minguante';
}
