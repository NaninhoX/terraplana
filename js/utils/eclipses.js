import { SUN_H } from './constants.js';
import { getMoonHeight } from './orbits.js';

export function checkSolarEclipse(timeMin, dayMoon, sunAnglePos, moonAnglePos) {
    const moonHeight = getMoonHeight(dayMoon);
    
    // Alinhamento no mesmo lado
    let angleDiff = Math.abs(moonAnglePos - sunAnglePos) % (Math.PI * 2);
    const isAligned = angleDiff < 0.1 || (Math.PI * 2 - angleDiff) < 0.1;
    
    // Eclipse solar: Lua mais baixa e alinhada
    const isLowMoon = moonHeight < SUN_H - 6;
    return isAligned && isLowMoon;
}

export function checkLunarEclipse(timeMin, dayMoon, sunAnglePos, moonAnglePos) {
    const moonHeight = getMoonHeight(dayMoon);
    
    // Alinhamento oposto (180° de diferença)
    let angleDiff = Math.abs(moonAnglePos - sunAnglePos) % (Math.PI * 2);
    if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
    const isOpposite = angleDiff > Math.PI - 0.15 && angleDiff < Math.PI + 0.15;
    
    // Eclipse lunar: Lua Cheia (alta) e oposta
    const isFullMoon = moonHeight > 35;
    return isFullMoon && isOpposite;
}
