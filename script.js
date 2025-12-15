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

const btn = document.getElementById("startBtn");
const all = document.querySelectorAll("*");

btn.onmouseenter = function() {
    all.forEach(function(el) {
        el.style.backgroundColor = "red";
    });
};

btn.onmouseleave = function() {
    all.forEach(function(el) {
        el.style.backgroundColor = "";
    });
};






// Завантаження галереї після 5 секунд
window.addEventListener("load", () => {
    setTimeout(addGalleryImages, 5000); // Чекаємо 5 секунд, а потім викликаємо функцію
});

function addGalleryImages() {
    // Масив з URL-адресами зображень
    let imagesUrl = [
        "https://shadowfight2.com/images/slides/screenshot_01.jpg",
        "https://shadowfight2.com/images/slides/screenshot_02.jpg",
        "https://shadowfight2.com/images/slides/screenshot_03.jpg",
        "https://shadowfight2.com/images/slides/screenshot_04.jpg",
        "https://shadowfight2.com/images/slides/screenshot_05.jpg",
        "https://shadowfight2.com/images/slides/screenshot_06.jpg"
    ];

    // Створення фрагмента документа для групування елементів <img>
    const fragment = document.createDocumentFragment();

    // Отримуємо контейнер для галереї
    const gallery = document.querySelector(".gallery-images");
    if (!gallery) {
        return; // Якщо немає контейнера для галереї, припиняємо виконання
    }

    // Ітерація по масиву imagesUrl
    imagesUrl.forEach((url, index) => {
        // Створюємо елемент <img>
        const img = document.createElement("img");
        img.src = url;
        img.alt = `Скріншот ${index + 1}`;
        img.classList.add("fade-in");

        // Додаємо кожен <img> в фрагмент
        fragment.appendChild(img);

        // Затримка перед додаванням кожного зображення
        setTimeout(() => {
            gallery.appendChild(fragment.firstChild); // Додаємо елемент до DOM
            // Створюємо новий фрагмент для наступного зображення
            fragment.appendChild(img);
        }, index * 1000); // Затримка 1 секунда між зображеннями
    });
}






// Перевірка даних вводу
function validate() {
    let login = document.getElementById("login").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();

    const loginRegex = /^[a-zA-Z0-9_]{3,16}$/;
    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\+?\d{10,14}$/;

    // match() для логіна
    if (login.match(loginRegex)) {
        console.log("Login OK");
    } else {
        console.log("Login INVALID");
    }

    // search() для email
    if (email.search(emailRegex) !== -1) {
        console.log("Email OK");
    } else {
        console.log("Email INVALID");
    }

    // match() для телефону
    if (phone.match(phoneRegex)) {
        console.log("Phone OK");
    } else {
        console.log("Phone INVALID");
    }

    // Очищення логіна
    const cleanedLogin = login.replace(/[^a-zA-Z0-9_]/g, "");
    console.log("Очищений логін:", cleanedLogin);
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

    // Знаходимо спільні елементи
    return [...set1].filter(word => set2.has(word));
}

// Обробка події на кнопці для порівняння фраз
document.getElementById("compareButton").addEventListener("click", function() {
    const phrase1 = document.getElementById("phraseInput1").value.trim();
    const phrase2 = document.getElementById("phraseInput2").value.trim();

    if (!phrase1 || !phrase2) {
        document.getElementById("result").textContent = "Будь ласка, введіть обидві фрази.";
        return;
    }

    const commonWords = findCommonWords(phrase1, phrase2);
    if (commonWords.length > 0) {
        document.getElementById("result").textContent = "Спільні слова: " + commonWords.join(", ");
    } else {
        document.getElementById("result").textContent = "Спільних слів немає.";
    }
});





// Асинхронна функція для запиту до API зображення собаки
async function getDogImage() {
    const url = 'https://dog.ceo/api/breeds/image/random';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Помилка запиту: ' + response.status);
        }
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