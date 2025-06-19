export class BooksRenderer {
  static renderBook(book, isInCart) {
    const { volumeInfo, saleInfo } = book;
    const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown author';
    const thumbnail = volumeInfo.imageLinks?.thumbnail || 'path/to/placeholder.jpg';
    const rating = volumeInfo.averageRating ? this.renderRating(volumeInfo.averageRating, volumeInfo.ratingsCount) : '';
    const price = saleInfo?.retailPrice ? `$${saleInfo.retailPrice.amount}` : '';

    return `
      <div class="book-card" data-id="${book.id}">
        <img src="${thumbnail}" alt="${volumeInfo.title}" class="book-cover">
        <div class="book-details">
          <p class="book-author">${authors}</p>
          <h3 class="book-title">${volumeInfo.title}</h3>
          ${rating}
          <p class="book-description">${this.truncateDescription(volumeInfo.description)}</p>
          ${price ? `<p class="book-price">${price}</p>` : ''}
          <button class="buy-btn ${isInCart ? 'in-cart' : ''}">
            ${isInCart ? 'In Cart' : 'Buy Now'}
          </button>
        </div>
      </div>
    `;
  }

  static truncateDescription(description) {
    if (!description) return '';
    const maxLength = 150;
    return description.length > maxLength
      ? `${description.substring(0, maxLength)}...`
      : description;
  }

  static renderRating(rating, count) {
    const stars = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
    return `<div class="book-rating">
      <span class="stars">${stars}</span>
      <span class="reviews-count">(${count || 0})</span>
    </div>`;
  }
}