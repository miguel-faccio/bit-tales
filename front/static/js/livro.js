

const caroussel = document.querySelector('.component');
const divsToShow = 1; // Número de divs visíveis por vez
const totalDivs = document.querySelectorAll('.slide').length;
const divWidth = 980; // Ajustando o tamanho incluindo margem
let currentIndex = 0;

document.querySelector('.next').addEventListener('click', () => {

    if (currentIndex < totalDivs - divsToShow) {
        currentIndex++;
    } else {
        currentIndex = 0; // Volta ao início quando atinge o final
    }
    updateCarousel();
});

document.querySelector('.prev').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = totalDivs - divsToShow; // Vai para o final quando atinge o início
    }
    updateCarousel();
});

function updateCarousel() {
    const offset = -currentIndex * divWidth;
    caroussel.style.transform = `translateX(${offset}px)`;
}
