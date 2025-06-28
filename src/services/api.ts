// API integration functions placeholder
// ... implement API calls for quotes, recipes, books, etc. 

export async function fetchTodayQuote(): Promise<{ quote: string; author: string } | null> {
  try {
    const res = await fetch('https://zenquotes.io/api/today');
    const data = await res.json();
    if (Array.isArray(data) && data[0]) {
      return { quote: data[0].q, author: data[0].a };
    }
  } catch (e) {}
  return null;
} 

export interface Recipe {
  id: string;
  name: string;
  category: string;
  area: string;
  instructions: string;
  image: string;
  source?: string;
}

export async function fetchRandomRecipe(): Promise<Recipe | null> {
  for (let i = 0; i < 5; i++) { // 이미지 없는 경우 최대 5회 재시도
    try {
      const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      const data = await res.json();
      const meal = data.meals && data.meals[0];
      if (meal && meal.strMealThumb) {
        return {
          id: meal.idMeal,
          name: meal.strMeal,
          category: meal.strCategory,
          area: meal.strArea,
          instructions: meal.strInstructions,
          image: meal.strMealThumb,
          source: meal.strSource,
        };
      }
    } catch (e) {}
  }
  return null;
}

export interface Book {
  title: string;
  author: string;
  cover?: string;
  url: string;
}

export async function fetchRandomBook(): Promise<Book | null> {
  for (let i = 0; i < 5; i++) {
    try {
      // 인기 주제 중 하나에서 랜덤 책
      const subjects = ['fiction','science','history','fantasy','romance','children','mystery'];
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const res = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=50`);
      const data = await res.json();
      const works = data.works || [];
      const withCover = works.filter((w: any) => w.cover_id);
      if (withCover.length) {
        const book = withCover[Math.floor(Math.random() * withCover.length)];
        return {
          title: book.title,
          author: book.authors && book.authors[0] ? book.authors[0].name : '',
          cover: `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`,
          url: `https://openlibrary.org${book.key}`
        };
      }
    } catch (e) {}
  }
  return null;
}

// 현재 기온(°C) 및 강수확률(%) - 서울 기준(Open-Meteo)
export async function fetchCurrentWeather() {
  try {
    // 서울 위도/경도: 37.5665, 126.9780
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.9780&current_weather=true&hourly=precipitation_probability&temperature_unit=celsius';
    const res = await fetch(url);
    const data = await res.json();
    let precipitationProbability = null;
    if (data && data.current_weather && typeof data.current_weather.temperature === 'number') {
      // 강수확률: 현재 시간에 가장 가까운 hourly.precipitation_probability 값 사용
      if (data.hourly && data.hourly.time && data.hourly.precipitation_probability) {
        const now = data.current_weather.time || new Date().toISOString().slice(0, 13); // 'YYYY-MM-DDTHH' or fallback
        const idx = data.hourly.time.findIndex((t: string) => now.startsWith(t.slice(0, 13)));
        if (idx >= 0) precipitationProbability = data.hourly.precipitation_probability[idx];
      }
      return { temp: data.current_weather.temperature, precipitationProbability: typeof precipitationProbability === 'number' ? precipitationProbability : 0 };
    }
  } catch (e) {}
  return null;
} 