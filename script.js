// Кількість параграфів <p>
const paragraphs = document.querySelectorAll("p");
console.log("Кількість <p>:", paragraphs.length);

// Кількість заголовків <h2>
const h2s = document.querySelectorAll("h2");
console.log("Кількість <h2>:", h2s.length);

// Значення background-color для <body>
const bodyBg = getComputedStyle(document.body).backgroundColor;
console.log("background-color <body>:", bodyBg);

// Значення font-size для <h1>
const h1 = document.querySelector("h1");
console.log("font-size <h1>:", getComputedStyle(h1).fontSize);

// Зміна фону всіх елементів при наведенні на кнопку
const btn = document.getElementById("startBtn");
const allElements = document.querySelectorAll("*");

btn.addEventListener("mouseenter", () => {
    allElements.forEach((el) => {
        el.style.backgroundColor = "red";
    });
});

btn.addEventListener("mouseleave", () => {
    allElements.forEach((el) => {
        el.style.backgroundColor = "";
    });
});

// Завантаження галереї після 5 секунд
window.addEventListener("load", () => {
    setTimeout(addGalleryImages, 5000); // Чекаємо 5 секунд, а потім викликаємо функцію
});

// Функція для додавання зображень у галерею з затримкою
function addGalleryImages() {
    const imagesUrl = [
        "https://shadowfight2.com/images/slides/screenshot_01.jpg",
        "https://shadowfight2.com/images/slides/screenshot_02.jpg",
        "https://shadowfight2.com/images/slides/screenshot_03.jpg",
        "https://shadowfight2.com/images/slides/screenshot_04.jpg",
        "https://shadowfight2.com/images/slides/screenshot_05.jpg",
        "https://shadowfight2.com/images/slides/screenshot_06.jpg"
    ];

    const gallery = document.querySelector(".gallery-images");
    if (!gallery) return;

    imagesUrl.forEach((url, index) => {
        const img = document.createElement("img");
        img.src = url;
        img.alt = `Скріншот ${index + 1}`;
        img.classList.add("fade-in");

        setTimeout(() => {
            gallery.appendChild(img);
        }, index * 1000); // Затримка 1 секунда між зображеннями
    });
}

// Функція для очищення тексту та розбиття на слова
function getWords(text) {
    return text
        .toLowerCase()
        .replace(/[^\wа-яіїєґ']+/g, " ")
        .split(/\s+/);
}

// Основна функція для знаходження спільних слів
function findCommonWords(phrase1, phrase2) {
    const words1 = getWords(phrase1);
    const words2 = getWords(phrase2);

    const set1 = new Set(words1);
    const set2 = new Set(words2);

    return [...set1].filter((word) => set2.has(word)); // Знаходимо спільні елементи
}

// Обробник події для порівняння фраз
document.getElementById("compareButton").addEventListener("click", () => {
    const phrase1 = document.getElementById("phraseInput1").value.trim();
    const phrase2 = document.getElementById("phraseInput2").value.trim();

    if (!phrase1 || !phrase2) {
        document.getElementById("result").textContent = "Будь ласка, введіть обидві фрази.";
        return;
    }

    const commonWords = findCommonWords(phrase1, phrase2);
    const resultText = commonWords.length > 0
        ? `Спільні слова: ${commonWords.join(", ")}`
        : "Спільних слів немає.";

    document.getElementById("result").textContent = resultText;
});

// Асинхронна функція для запиту до API зображення собаки
async function getDogImage() {
    const url = 'https://dog.ceo/api/breeds/image/random';
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Помилка запиту: ' + response.status);
        const data = await response.json();
        const container = document.getElementById('dogContainer');
        container.innerHTML = `<img src="${data.message}" alt="Random Dog Image">`;
    } catch (error) {
        console.error('Помилка:', error);
        document.getElementById('dogContainer').innerHTML = '<p>Не вдалося отримати фото 😢</p>';
    }
}

// Обробник події на кнопку для отримання фото собаки
document.getElementById('getDogBtn').addEventListener('click', getDogImage);
