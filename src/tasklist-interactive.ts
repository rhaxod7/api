import { saveTasks, loadTasks } from './services/storage';

export function setupTaskListInteractions() {
  const form = document.getElementById('task-form') as HTMLFormElement | null;
  const input = document.getElementById('task-input') as HTMLInputElement | null;
  const ul = document.getElementById('tasks') as HTMLUListElement | null;
  const checkAllBtn = document.getElementById('check-all-btn') as HTMLButtonElement | null;
  const removeCheckedBtn = document.getElementById('remove-checked-btn') as HTMLButtonElement | null;
  const removeAllBtn = document.getElementById('remove-all-btn') as HTMLButtonElement | null;
  if (!form || !input || !ul) return;

  // 렌더링 함수
  function render(tasks: { text: string; completed: boolean }[]) {
    ul.innerHTML = '';
    tasks.forEach((task, idx) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''} />
        <span>${task.text}</span>
        <button type="button" class="delete-btn">삭제</button>
      `;
      const checkbox = li.querySelector('input[type="checkbox"]') as HTMLInputElement;
      checkbox.onchange = () => {
        tasks[idx].completed = checkbox.checked;
        saveTasks(tasks);
        render(tasks);
      };
      const delBtn = li.querySelector('.delete-btn') as HTMLButtonElement;
      delBtn.onclick = () => {
        tasks.splice(idx, 1);
        saveTasks(tasks);
        render(tasks);
      };
      ul.appendChild(li);
    });

    // 진행률 바/텍스트 갱신
    const bar = document.getElementById('task-progress-bar');
    const fill = document.getElementById('task-progress-fill');
    const text = document.getElementById('task-progress-text');
    if (bar && fill && text) {
      const total = tasks.length;
      const done = tasks.filter(t => t.completed).length;
      const percent = total === 0 ? 0 : Math.round((done / total) * 100);
      fill.style.width = percent + '%';
      text.textContent = total === 0 ? '0%' : `${done}/${total} (${percent}%)`;
    }
    // 전체 체크 버튼 텍스트 갱신
    if (checkAllBtn) {
      const allChecked = tasks.length > 0 && tasks.every(t => t.completed);
      checkAllBtn.textContent = allChecked ? '전체 해제' : '전체 체크';
    }
  }

  // 초기 로드
  let tasks: { text: string; completed: boolean }[] = loadTasks();
  render(tasks);

  form.onsubmit = e => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    tasks.push({ text: value, completed: false });
    saveTasks(tasks);
    render(tasks);
    input.value = '';
  };

  // 전체 체크 토글
  if (checkAllBtn) {
    checkAllBtn.onclick = e => {
      e.preventDefault();
      const allChecked = tasks.length > 0 && tasks.every(t => t.completed);
      if (allChecked) {
        tasks.forEach(t => t.completed = false);
        checkAllBtn.textContent = '전체 체크';
      } else {
        tasks.forEach(t => t.completed = true);
        checkAllBtn.textContent = '전체 해제';
      }
      saveTasks(tasks);
      render(tasks);
    };
  }

  if (removeCheckedBtn) {
    removeCheckedBtn.onclick = e => {
      e.preventDefault();
      const filtered = tasks.filter(t => !t.completed);
      if (filtered.length !== tasks.length) {
        tasks.length = 0;
        tasks.push(...filtered);
        saveTasks(tasks);
        render(tasks);
      }
    };
  }

  if (removeAllBtn) {
    removeAllBtn.onclick = e => {
      e.preventDefault();
      if (confirm('정말 모든 할 일을 삭제할까요?')) {
        tasks.length = 0;
        saveTasks(tasks);
        render(tasks);
      }
    };
  }
} 