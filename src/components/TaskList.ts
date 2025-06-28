// TaskList component placeholder
// ... implement task list UI here 

export function TaskList() {
  return `
    <section class="task-list">
      <div style="display:flex;align-items:center;gap:12px;">
        <h2 style="margin:0;">할 일 목록</h2>
        <div id="task-progress-bar" style="flex:1;min-width:80px;max-width:120px;height:14px;background:#e0e6ef;border-radius:7px;overflow:hidden;position:relative;">
          <div id="task-progress-fill" style="height:100%;background:#4f8cff;width:0%;transition:width 0.3s;"></div>
          <span id="task-progress-text" style="position:absolute;left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center;font-size:11px;color:#333;font-weight:bold;"></span>
        </div>
      </div>
      <form id="task-form" style="display:flex;gap:8px;align-items:center;">
        <input type="text" id="task-input" placeholder="할 일 추가" autocomplete="off" />
        <button type="submit">추가</button>
        <button type="button" id="check-all-btn">전체 체크</button>
        <button type="button" id="remove-checked-btn">선택 삭제</button>
        <button type="button" id="remove-all-btn">전체 삭제</button>
      </form>
      <ul id="tasks"></ul>
    </section>
  `;
} 