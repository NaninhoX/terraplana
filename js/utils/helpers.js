export function fmtTime(tm) {
    const h = Math.floor(tm / 60) % 24;
    const m = Math.floor(tm % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function seasonName(d) {
    if (d < 80 || d >= 355) return 'Inverno N / Verão S';
    if (d < 172) return 'Primavera N / Outono S';
    if (d < 266) return 'Verão N / Inverno S';
    return 'Outono N / Primavera S';
}

export function syncPct(el) {
    const pct = ((el.value - el.min) / (el.max - el.min)) * 100;
    el.style.setProperty('--pct', pct + '%');
}
