// TimeTable component placeholder
// ... implement timetable grid view here 

import { loadTimeTable, saveTimeTable } from '../services/storage';
import type { TimeSlot } from '../services/storage';

export function TimeTable() {
  // 시간대 배열 (1~24시)
  let slots = loadTimeTable();
  if (slots.length !== 24) {
    // 기존 데이터가 24개가 아니면 1~24시로 재생성
    slots = Array.from({ length: 24 }, (_, i) => ({
      hour: i + 1,
      task: '',
      completed: false,
      memo: ''
    }));
    saveTimeTable(slots);
  }
  const rows = slots.map((slot, idx) => `
    <tr>
      <td class="hour">${slot.hour}:00</td>
      <td><input type="text" data-idx="${idx}" class="tt-task" value="${slot.task.replace(/"/g, '&quot;')}" placeholder="할 일 입력" /></td>
      <td><input type="checkbox" data-idx="${idx}" class="tt-check" ${slot.completed ? 'checked' : ''} /></td>
      <td><input type="text" data-idx="${idx}" class="tt-memo" value="${slot.memo ? slot.memo.replace(/"/g, '&quot;') : ''}" placeholder="메모" /></td>
    </tr>
  `).join('');

  // 이벤트 위임 스크립트
  const script = `
    <script>
      (() => {
        const table = document.querySelector('.timetable table');
        if (!table) return;
        table.oninput = function(e) {
          const t = e.target;
          if (!t.matches('.tt-task,.tt-memo')) return;
          const idx = +t.getAttribute('data-idx');
          const slots = JSON.parse(localStorage.getItem('taskmaster-timetable')) || [];
          if (t.classList.contains('tt-task')) slots[idx].task = t.value;
          if (t.classList.contains('tt-memo')) slots[idx].memo = t.value;
          localStorage.setItem('taskmaster-timetable', JSON.stringify(slots));
          window.dispatchEvent(new Event('timetable-updated'));
        };
        table.onchange = function(e) {
          const t = e.target;
          if (!t.matches('.tt-check')) return;
          const idx = +t.getAttribute('data-idx');
          const slots = JSON.parse(localStorage.getItem('taskmaster-timetable')) || [];
          slots[idx].completed = t.checked;
          localStorage.setItem('taskmaster-timetable', JSON.stringify(slots));
          window.dispatchEvent(new Event('timetable-updated'));
        };
      })();
    </script>
  `;

  return `
    <section class="timetable">
      <h2>시간표</h2>
      <table>
        <thead>
          <tr>
            <th>시간</th>
            <th>할 일</th>
            <th>완료</th>
            <th>메모</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </section>
    ${script}
  `;
} 