export class Cart {
    constructor() {
        this.items = this.loadCart();
    }

    loadCart() {
        const cart = localStorage.getItem('bookshopCart');
        return cart ? JSON.parse(cart) : [];
    }

    saveCart() {
        localStorage.setItem('bookshopCart', JSON.stringify(this.items));
    }

    addBook(book) {
        if (!this.items.some(item => item.id === book.id)) {
            this.items.push(book);
            this.saveCart();
            this.updateCartBadge();
        }
    }

    removeBook(bookId) {
        this.items = this.items.filter(item => item.id !== bookId);
        this.saveCart();
        this.updateCartBadge();
    }

    updateCartBadge() {
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            badge.textContent = this.items.length;
            badge.style.display = this.items.length ? 'block' : 'none';
        }
    }

    isInCart(bookId) {
        return this.items.some(item => item.id === bookId);
    }
}