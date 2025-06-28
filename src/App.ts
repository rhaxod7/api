import { TimeTable } from './components/TimeTable'
import { CircularClock } from './components/CircularClock'
import { TaskList } from './components/TaskList'

export function App() {
  return `
    <div class="app-container">
      <header>
        <h1>Today</h1>
        <div class="today-info">오늘 날짜와 온도 자리</div>
      </header>
      <main>
        <div class="main-row">
          <div id="circular-clock" style="min-width:220px;max-width:220px;width:220px;height:220px;margin-top:0;margin-bottom:12px;">${CircularClock()}</div>
          <div class="main-recommend-row">
            <div class="recommend-box" style="min-width:220px;max-width:220px;width:220px;height:220px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span>오늘의 레시피 추천</span>
              </div>
              <div class="recommend-img-row" style="display:flex;align-items:center;justify-content:center;gap:8px;">
                <button class="arrow-btn" id="recipe-prev" title="이전" style="font-size:16px;padding:2px 4px;opacity:0.7;">◀</button>
                <img id="recipe-img" src="" alt="레시피 이미지" style="width:120px;height:120px;object-fit:cover;border-radius:12px;display:none;"/>
                <button class="arrow-btn" id="recipe-next" title="다음" style="font-size:16px;padding:2px 4px;opacity:0.7;">▶</button>
              </div>
              <div class="recommend-index" id="recipe-index" style="text-align:center;font-size:15px;color:#888;margin:6px 0;">1/1</div>
              <div id="recipe-info"></div>
            </div>
            <div class="recommend-box" style="min-width:220px;max-width:220px;width:220px;height:220px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span>오늘의 책 추천</span>
              </div>
              <div class="recommend-img-row" style="display:flex;align-items:center;justify-content:center;gap:8px;">
                <button class="arrow-btn" id="book-prev" title="이전" style="font-size:16px;padding:2px 4px;opacity:0.7;">◀</button>
                <img id="book-img" src="" alt="도서 이미지" style="width:120px;height:120px;object-fit:cover;border-radius:12px;display:none;"/>
                <button class="arrow-btn" id="book-next" title="다음" style="font-size:16px;padding:2px 4px;opacity:0.7;">▶</button>
              </div>
              <div class="recommend-index" id="book-index" style="text-align:center;font-size:15px;color:#888;margin:6px 0;">1/1</div>
              <div id="book-info"></div>
            </div>
          </div>
        </div>
        <div class="timetable-wrap" style="position:relative;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <h2 style="margin:0;"></h2>
            <button id="clear-timetable-tasks" style="font-size:13px;padding:4px 12px;">전체 지우기</button>
          </div>
          ${TimeTable()}
        </div>
        <div id="task-list">${TaskList()}</div>
        <div class="todo-list-section" style="...">
          <div class="todo-list" id="todo-list" style="..."></div>
        </div>
      </main>
      <footer></footer>
    </div>
  `;
} 