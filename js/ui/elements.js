// Elementos DOM
export const elements = {
    slHour: document.getElementById('sl-hour'),
    slYear: document.getElementById('sl-year'),
    slMoon: document.getElementById('sl-moon'),
    lblHour: document.getElementById('lbl-h'),
    lblYear: document.getElementById('lbl-y'),
    lblMoon: document.getElementById('lbl-m'),
    dTime: document.getElementById('d-time'),
    dDay: document.getElementById('d-day'),
    dSeason: document.getElementById('d-season'),
    dMoon: document.getElementById('d-moon'),
    statToggle: document.getElementById('stat-toggle'),
    statusBar: document.getElementById('status-bar'),
    uiPill: document.getElementById('ui-pill'),
    uiDiv: document.getElementById('ui')
};

export function initUI() {
    // Inicializa sliders com valores padrão
    syncPct(elements.slHour);
    syncPct(elements.slYear);
    syncPct(elements.slMoon);
}

export function updateUI(timeMin, dayYear, dayMoon) {
    const h = fmtTime(timeMin);
    const season = seasonName(dayYear);
    const phase = moonPhase(dayMoon);
    
    elements.dTime.textContent = h;
    elements.dDay.textContent = Math.floor(dayYear);
    elements.dSeason.textContent = season;
    elements.dMoon.textContent = phase;
    elements.lblHour.textContent = h;
    elements.lblYear.textContent = Math.floor(dayYear);
    elements.lblMoon.textContent = Math.floor(dayMoon);
}

function fmtTime(tm) {
    const h = Math.floor(tm / 60) % 24;
    const m = Math.floor(tm % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function seasonName(d) {
    if (d < 80 || d >= 355) return 'Inverno N / Verão S';
    if (d < 172) return 'Primavera N / Outono S';
    if (d < 266) return 'Verão N / Inverno S';
    return 'Outono N / Primavera S';
}

function syncPct(el) {
    el.style.setProperty('--pct', ((el.value - el.min) / (el.max - el.min)) * 100 + '%');
}
