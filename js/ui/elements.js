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

export function updateUI(timeMin, dayYear, dayMoon, season, moonPhaseStr, fmtTimeFn) {
    elements.dTime.textContent = fmtTimeFn(timeMin);
    elements.dDay.textContent = Math.floor(dayYear);
    elements.dSeason.textContent = season;
    elements.dMoon.textContent = moonPhaseStr;
    elements.lblHour.textContent = fmtTimeFn(timeMin);
    elements.lblYear.textContent = Math.floor(dayYear);
    elements.lblMoon.textContent = Math.floor(dayMoon);
}
