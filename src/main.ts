import './styles/global.css'
import './style.css'
import { App } from './App'
import { CircularClock } from './components/CircularClock'
import { setupTaskListInteractions } from './tasklist-interactive'
import { fetchCurrentWeather, fetchRandomRecipe, fetchRandomBook } from './services/api'
import { saveTimeTable, loadTimeTable } from './services/storage'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = App();
setupTaskListInteractions();

// timetable-updated 이벤트 발생 시 CircularClock만 다시 렌더링
window.addEventListener('timetable-updated', () => {
  const clockDiv = document.getElementById('circular-clock');
  if (clockDiv) clockDiv.innerHTML = CircularClock();
});

// 시계가 부드럽게 움직이도록 애니메이션 루프 추가
function animateClock() {
  const clockDiv = document.getElementById('circular-clock');
  if (clockDiv) clockDiv.innerHTML = CircularClock();
  requestAnimationFrame(animateClock);
}

animateClock();

// 오늘 날짜와 현재 기온 표시
async function showTodayInfo() {
  const infoDiv = document.querySelector('.today-info');
  if (!infoDiv) return;
  const now = new Date();
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dateStr = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')} (${days[now.getDay()]})`;
  infoDiv.textContent = dateStr + ' / ...';
  const weather = await fetchCurrentWeather();
  if (weather && typeof weather.temp === 'number') {
    const tempStr = `${Math.round(weather.temp)}°C`;
    const probStr = typeof weather.precipitationProbability === 'number' ? `💧${weather.precipitationProbability}%` : '-';
    infoDiv.textContent = `${dateStr} / ${tempStr}, ${probStr}`;
  } else {
    infoDiv.textContent = `${dateStr} / -`;
  }
}

showTodayInfo();

// 레시피/도서 추천 여러 개 미리 받아서 슬라이드처럼 넘기기
const RECIPE_COUNT = 5;
const BOOK_COUNT = 5;
let recipeList: any[] = [];
let recipeIdx = 0;
let bookList: any[] = [];
let bookIdx = 0;

async function loadRecipes() {
  recipeList = [];
  for (let i = 0; i < RECIPE_COUNT; i++) {
    const r = await fetchRandomRecipe();
    if (r) recipeList.push(r);
  }
  recipeIdx = 0;
  showRecipe();
}
function showRecipe() {
  const img = document.getElementById('recipe-img') as HTMLImageElement | null;
  const info = document.getElementById('recipe-info');
  const idxSpan = document.getElementById('recipe-index');
  if (!img || !info || !idxSpan) return;
  if (!recipeList.length) {
    img.style.display = 'none';
    info.textContent = '레시피를 불러올 수 없습니다.';
    idxSpan.textContent = '0/0';
    return;
  }
  const r = recipeList[recipeIdx];
  img.src = r.image;
  img.alt = r.name;
  img.style.display = 'block';
  info.innerHTML = `
    <b>${r.name}</b> (${r.area}, ${r.category})<br/>
    <a href="${r.source || '#'}" target="_blank">자세히 보기</a>
  `;
  idxSpan.textContent = `${recipeIdx + 1}/${recipeList.length}`;
}
function setupRecipeBox() {
  const prevBtn = document.getElementById('recipe-prev');
  const nextBtn = document.getElementById('recipe-next');
  if (prevBtn) prevBtn.onclick = () => {
    if (!recipeList.length) return;
    recipeIdx = (recipeIdx - 1 + recipeList.length) % recipeList.length;
    showRecipe();
  };
  if (nextBtn) nextBtn.onclick = () => {
    if (!recipeList.length) return;
    recipeIdx = (recipeIdx + 1) % recipeList.length;
    showRecipe();
  };
  loadRecipes();
}

async function loadBooks() {
  bookList = [];
  for (let i = 0; i < BOOK_COUNT; i++) {
    const b = await fetchRandomBook();
    if (b) bookList.push(b);
  }
  bookIdx = 0;
  showBook();
}
function showBook() {
  const img = document.getElementById('book-img') as HTMLImageElement | null;
  const info = document.getElementById('book-info');
  const idxSpan = document.getElementById('book-index');
  if (!img || !info || !idxSpan) return;
  if (!bookList.length) {
    img.style.display = 'none';
    info.textContent = '도서를 불러올 수 없습니다.';
    idxSpan.textContent = '0/0';
    return;
  }
  const b = bookList[bookIdx];
  img.src = b.cover;
  img.alt = b.title;
  img.style.display = 'block';
  info.innerHTML = `
    <b>${b.title}</b><br/>
    <span>${b.author}</span><br/>
    <a href="${b.url}" target="_blank">OpenLibrary에서 보기</a>
  `;
  idxSpan.textContent = `${bookIdx + 1}/${bookList.length}`;
}
function setupBookBox() {
  const prevBtn = document.getElementById('book-prev');
  const nextBtn = document.getElementById('book-next');
  if (prevBtn) prevBtn.onclick = () => {
    if (!bookList.length) return;
    bookIdx = (bookIdx - 1 + bookList.length) % bookList.length;
    showBook();
  };
  if (nextBtn) nextBtn.onclick = () => {
    if (!bookList.length) return;
    bookIdx = (bookIdx + 1) % bookList.length;
    showBook();
  };
  loadBooks();
}

setupRecipeBox();
setupBookBox();

document.addEventListener('DOMContentLoaded', () => {
  const clearBtn = document.getElementById('clear-timetable-tasks');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const slots = loadTimeTable();
      slots.forEach(slot => {
        slot.task = '';
        slot.memo = '';
        slot.completed = false;
      });
      saveTimeTable(slots);
      window.dispatchEvent(new Event('timetable-updated'));
      // 입력란/체크박스도 즉시 반영
      document.querySelectorAll('.tt-task').forEach(input => { (input as HTMLInputElement).value = ''; });
      document.querySelectorAll('.tt-memo').forEach(input => { (input as HTMLInputElement).value = ''; });
      document.querySelectorAll('.tt-check').forEach(input => { (input as HTMLInputElement).checked = false; });
    });
  }
});
