// Local storage and persistence logic placeholder
// ... implement save/load functions for tasks, notes, etc. 

const STORAGE_KEY = 'taskmaster-tasks';

export interface TaskItem {
  text: string;
  completed: boolean;
}

export function saveTasks(tasks: TaskItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function loadTasks(): TaskItem[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as TaskItem[];
  } catch {
    return [];
  }
}

export interface TimeSlot {
  hour: number; // 1~24
  task: string;
  completed: boolean;
  memo?: string;
}
const TIME_TABLE_KEY = 'taskmaster-timetable';

export function saveTimeTable(slots: TimeSlot[]) {
  localStorage.setItem(TIME_TABLE_KEY, JSON.stringify(slots));
}
export function loadTimeTable(): TimeSlot[] {
  const data = localStorage.getItem(TIME_TABLE_KEY);
  let slots: TimeSlot[];
  if (!data) {
    // 기본값: 1~24시 빈 슬롯
    slots = Array.from({ length: 24 }, (_, i) => ({
      hour: i + 1,
      task: '',
      completed: false,
      memo: ''
    }));
    return slots;
  }
  try {
    slots = JSON.parse(data) as TimeSlot[];
    // 만약 24개가 아니면 1~24시로 재생성
    if (!Array.isArray(slots) || slots.length !== 24) {
      slots = Array.from({ length: 24 }, (_, i) => ({
        hour: i + 1,
        task: '',
        completed: false,
        memo: ''
      }));
    }
    return slots;
  } catch {
    return Array.from({ length: 24 }, (_, i) => ({
      hour: i + 1,
      task: '',
      completed: false,
      memo: ''
    }));
  }
} 