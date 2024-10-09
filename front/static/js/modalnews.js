const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const carouselWrapper = document.querySelector('.carousel-wrapper');
const items = document.querySelectorAll('.carousel-item');

let currentIndex = 0;

function updateCarousel() {
    const cardWidth = items[0].offsetWidth + 20; // Largura do card incluindo a margem
    const offset = -currentIndex * cardWidth;
    carouselWrapper.style.transform = `translateX(${offset}px)`;
    items.forEach((item, index) => {
        item.classList.toggle('active', index === currentIndex);
    });
}

prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : items.length - 1;
    updateCarousel();
});

nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex < items.length - 1) ? currentIndex + 1 : 0;
    updateCarousel();
});

// Inicialização
updateCarousel();
