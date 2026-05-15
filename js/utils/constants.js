// Disco
export const DR = 100;          // disc radius
export const AR = 3;            // arctic inner radius

// Trópicos e Equador
export const R_CANCER = 38;     // Tropic of Cancer radius
export const R_EQUATOR = 55;    // Equator radius
export const R_CAPRI = 72;      // Tropic of Capricorn radius

// Alturas
export const SUN_H = 28;        // sun height above disc (fixa)
export const MOON_H_BASE = 28;  // moon base height (mesma do Sol)
export const MOON_H_VARIATION = 12; // moon height variation (±12)

// Muralha de gelo
export const ICE_H = 12;
export const ICE_IR = DR;
export const ICE_OR = DR + 8;

// Velocidades (minutos virtuais por segundo real)
export const SPEED_LEVELS = {
    '0': 0,        // Pausado
    '60': 60,      // 1x
    '600': 600,    // 10x
    '3600': 3600,  // 60x
    '21600': 21600, // 360x
    '86400': 86400 // 1440x (1 dia virtual por segundo)
};
