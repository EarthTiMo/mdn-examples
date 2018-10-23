const TOTAL_IMAGES = 6;
const SLIDE_SIZE = 4;
let images = [];
let slideFirstIndex = 0;
let btnBrightness = document.getElementById('btn-brightness');
let imageCurrent = document.getElementById('img-current');
let slideLeft = document.getElementById('div-slide-left');
let slideRight = document.getElementById('div-slide-right');
let test = document.getElementById('test');


for (let i = 0; i < TOTAL_IMAGES; i++) {
    images[i] = 'images/pic' + i + '.jpg';
}

function deploySlide(index = 0) {
    for (let i = 0; i < SLIDE_SIZE; i++) {
        document.getElementById('img-slide-' + i).src = images[i + index];
    }
}

deploySlide();

slideLeft.onclick = function slideLeft() {
    if (slideFirstIndex > 0)
        deploySlide(--slideFirstIndex);
};

slideRight.onclick = function slideRight() {
    if (slideFirstIndex < TOTAL_IMAGES - SLIDE_SIZE)
        deploySlide(++slideFirstIndex);
};

btnBrightness.onclick = function () {
    if (btnBrightness.textContent === '变暗')  {
        imageCurrent.style.filter = 'brightness(0.3)';
        btnBrightness.textContent = '变亮';
    } else {
        imageCurrent.style.filter = 'brightness(1)';
        btnBrightness.textContent = '变暗';
    }
};

document.querySelectorAll('.img-slide').forEach(value => {
    value.onclick = () => imageCurrent.src = value.src;
});