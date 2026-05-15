import { elements } from './elements.js';
import { SPEED_LEVELS } from '../utils/constants.js';

let timeMin = 720;
let dayYear = 1;
let dayMoon = 1;
let animSpeed = 0;

export function getTimeState() {
    return { timeMin, dayYear, dayMoon };
}

export function getAnimSpeed() {
    return animSpeed;
}

export function setTimeState(newTime, newYear, newMoon) {
    timeMin = newTime;
    dayYear = newYear;
    dayMoon = newMoon;
}

export function initEvents() {
    // Speed buttons
    document.querySelectorAll('.sbtn').forEach(btn => {
        btn.addEventListener('click', () => {
            animSpeed = SPEED_LEVELS[btn.dataset.sp] || 0;
            document.querySelectorAll('.sbtn').forEach(x => x.classList.remove('on'));
            btn.classList.add('on');
        });
    });
    
    // Visibility toggles (serão conectados externamente)
    // Panel collapse
    document.querySelectorAll('.ptitle[data-p]').forEach(t => {
        t.addEventListener('click', () => {
            const panel = document.getElementById(t.dataset.p);
            if (panel) panel.classList.toggle('shut');
        });
    });
    
    // Status bar toggle
    if (elements.statToggle && elements.statusBar) {
        elements.statToggle.addEventListener('click', () => {
            elements.statToggle.classList.toggle('open');
            elements.statusBar.classList.toggle('shut');
        });
    }
    
    // Master UI toggle
    if (elements.uiPill && elements.uiDiv) {
        elements.uiPill.addEventListener('click', () => {
            const hidden = elements.uiDiv.classList.toggle('hidden');
            elements.uiPill.classList.toggle('off', hidden);
            elements.uiPill.innerHTML = hidden
                ? '<span class="dot"></span>Mostrar UI'
                : '<span class="dot"></span>Interface';
        });
    }
}
