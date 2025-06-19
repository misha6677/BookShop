export class Slider {
    constructor(containerSelector, options = {}) {
        this.container = document.querySelector(containerSelector);
        this.slides = this.container.querySelectorAll('.slide');
        this.interval = options.interval || 5000;
        this.currentIndex = 0;
        this.timer = null;

        this.init();
    }

    init() {
        this.createDots();
        this.showSlide(this.currentIndex);
        this.startAutoPlay();
        this.setupEventListeners();
    }

    createDots() {
        const dotsContainer = this.container.querySelector('.slider-dots');
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === this.currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        const dots = this.container.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        this.currentIndex = index;
    }

    nextSlide() {
        const newIndex = (this.currentIndex + 1) % this.slides.length;
        this.showSlide(newIndex);
    }

    prevSlide() {
        const newIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.showSlide(newIndex);
    }

    goToSlide(index) {
        this.showSlide(index);
        this.resetAutoPlay();
    }

    startAutoPlay() {
        this.timer = setInterval(() => this.nextSlide(), this.interval);
    }

    resetAutoPlay() {
        clearInterval(this.timer);
        this.startAutoPlay();
    }

    setupEventListeners() {
        this.container.addEventListener('mouseenter', () => clearInterval(this.timer));
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    }
}