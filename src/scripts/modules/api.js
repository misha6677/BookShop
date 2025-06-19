import { BASE_URL, API_KEY } from '/src/scripts/config.js';

export class BooksAPI {
  static async fetchBooks(category = 'fiction', startIndex = 0) {
    const response = await fetch(
      `${BASE_URL}?q="subject:${category}"&key=${API_KEY}` +
      `&printType=books&startIndex=${startIndex}&maxResults=6&langRestrict=en`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    
    return await response.json();
  }
}