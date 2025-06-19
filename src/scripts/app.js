import { BooksAPI } from './modules/api.js';
import { Cart } from './modules/cart.js';
import { BooksRenderer } from './modules/booksRenderer.js';
import { Slider } from './modules/slider.js';
import '/src/styles/main.scss';


export class App {
	constructor() {
		this.cart = new Cart();
		this.currentCategory = 'fiction';
		this.currentIndex = 0;
		this.isLoading = false;
		this.hasMoreBooks = true;

		this.init();
	}

	init() {
		// Initialize slider
		new Slider('.slider-container', { interval: 5000 });

		// Initialize cart
		this.cart.updateCartBadge();

		// Setup event listeners
		this.setupCategoryButtons();
		this.setupLoadMoreButton();
		this.setupCartButtons();

		// Load initial books
		this.loadBooks();
	}

	async loadBooks(reset = false) {
		if (this.isLoading || !this.hasMoreBooks) return;

		this.isLoading = true;
		if (reset) {
			this.currentIndex = 0;
			this.hasMoreBooks = true;
			document.querySelector('.books-container').innerHTML = '';
			document.querySelector('.load-more').style.display = 'block';
		}

		try {
			const data = await BooksAPI.fetchBooks(
				this.currentCategory,
				this.currentIndex
			);

			if (data.items && data.items.length > 0) {
				this.displayBooks(data.items);
				this.currentIndex += data.items.length;
				this.hasMoreBooks = data.items.length === 6;
			} else {
				this.hasMoreBooks = false;
				if (reset) {
					this.showNoBooksMessage();
				}
			}
		} catch (error) {
			console.error('Error loading books:', error);
			this.showErrorLoadingBooks();
		} finally {
			this.isLoading = false;
			document.querySelector('.load-more').style.display = this.hasMoreBooks
				? 'block'
				: 'none';
		}
	}

	displayBooks(books) {
		const container = document.querySelector('.books-container');
		books.forEach(book => {
			const isInCart = this.cart.isInCart(book.id);
			container.insertAdjacentHTML(
				'beforeend',
				BooksRenderer.renderBook(book, isInCart)
			);
		});
	}

	showNoBooksMessage() {
		const container = document.querySelector('.books-container');
		container.innerHTML = `
      <div class="no-books-message">
        <i class="fas fa-book-open"></i>
        <p>No books found in this category</p>
      </div>
    `;
	}

	showErrorLoadingBooks() {
		const container = document.querySelector('.books-container');
		container.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Failed to load books. Please try again later.</p>
        <button class="btn btn--primary retry-btn">Retry</button>
      </div>
    `;

		document
			.querySelector('.retry-btn')
			.addEventListener('click', () => this.loadBooks(true));
	}

	setupCategoryButtons() {
		document.querySelectorAll('.category-btn').forEach(btn => {
			btn.addEventListener('click', () => {
				if (btn.classList.contains('active')) return;

				document
					.querySelector('.category-btn.active')
					.classList.remove('active');
				btn.classList.add('active');
				this.currentCategory = btn.dataset.category;
				this.loadBooks(true);
			});
		});
	}

	setupLoadMoreButton() {
		document
			.querySelector('.load-more')
			.addEventListener('click', () => this.loadBooks());
	}

	setupCartButtons() {
		document.addEventListener('click', e => {
			if (e.target.classList.contains('buy-btn')) {
				const bookCard = e.target.closest('.book-card');
				const bookId = bookCard.dataset.id;

				if (this.cart.isInCart(bookId)) {
					this.cart.removeBook(bookId);
					e.target.textContent = 'Buy Now';
					e.target.classList.remove('in-cart');
				} else {
					// Get book data from DOM or store it in data attributes
					const bookData = {
						id: bookId,
						title: bookCard.querySelector('.book-title').textContent,
						author: bookCard.querySelector('.book-author').textContent,
						price: bookCard.querySelector('.book-price')?.textContent || '',
						image: bookCard.querySelector('.book-cover').src,
					};

					this.cart.addBook(bookData);
					e.target.textContent = 'In Cart';
					e.target.classList.add('in-cart');
				}
			}
		});
	}
}

// Initialize the app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
	new App();
});
