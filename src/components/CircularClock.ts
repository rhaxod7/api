import { loadTimeTable } from '../services/storage';

// CircularClock component placeholder
// ... implement circular clock view here 

export function CircularClock() {
  const now = new Date();
  const hour = now.getHours() % 12 + now.getMinutes() / 60;
  const minute = now.getMinutes() + now.getSeconds() / 60;
  const second = now.getSeconds() + now.getMilliseconds() / 1000;
  const hourAngle = (hour / 12) * 360 - 90;
  const minuteAngle = (minute / 60) * 360 - 90;
  const secondAngle = (second / 60) * 360 - 90;
  const radius = 90;
  const center = 110;
  // 시침, 분침, 초침 끝 좌표
  const hourLength = 35;
  const minLength = 55;
  const secLength = 70;
  const hourX = center + hourLength * Math.cos((Math.PI / 180) * hourAngle);
  const hourY = center + hourLength * Math.sin((Math.PI / 180) * hourAngle);
  const minX = center + minLength * Math.cos((Math.PI / 180) * minuteAngle);
  const minY = center + minLength * Math.sin((Math.PI / 180) * minuteAngle);
  const secX = center + secLength * Math.cos((Math.PI / 180) * secondAngle);
  const secY = center + secLength * Math.sin((Math.PI / 180) * secondAngle);
  // 숫자 라벨
  const labels = Array.from({ length: 12 }, (_, i) => {
    const n = i + 1;
    const a = ((n - 3) / 12) * 2 * Math.PI;
    const r = radius - 24;
    const x = center + r * Math.cos(a);
    const y = center + r * Math.sin(a) + 10;
    return `<text x="${x}" y="${y}" font-size="32" text-anchor="middle" fill="#222">${n}</text>`;
  }).join('');
  // 현재 시각 문자열 (24시간제, 2자리 0패딩)
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const timeStr = `${hh}:${mm}:${ss}`;
  return `
    <section class="circular-clock">
      <h2>${timeStr}</h2>
      <svg width="220" height="220" viewBox="0 0 220 220">
        <circle cx="${center}" cy="${center}" r="${radius}" fill="#fff" stroke="#222" stroke-width="8" />
        ${labels}
        <line x1="${center}" y1="${center}" x2="${hourX}" y2="${hourY}" stroke="#222" stroke-width="4" stroke-linecap="round" />
        <line x1="${center}" y1="${center}" x2="${minX}" y2="${minY}" stroke="#222" stroke-width="2.5" stroke-linecap="round" />
        <line x1="${center}" y1="${center}" x2="${secX}" y2="${secY}" stroke="red" stroke-width="1" stroke-linecap="round" />
        <circle cx="${center}" cy="${center}" r="6" fill="#222" />
      </svg>
    </section>
  `;
}

// main.ts에서 timetable-updated 이벤트 발생 시 CircularClock을 다시 렌더링하도록 연결 필요 