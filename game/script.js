// =====================
// DOM елементи
// =====================
const startBtn = document.getElementById("startBtn");
const checkBtn = document.getElementById("checkGuessBtn");
const endGameBtn = document.getElementById("endGameBtn");
const modeSelect = document.getElementById("mode");
const difficultySelect = document.getElementById("difficulty");
const tournamentSettings = document.getElementById("tournamentSettings");
const roundsInput = document.getElementById("roundsInput");
const maxAttemptsInput = document.getElementById("maxAttemptsInput");

const gameArea = document.getElementById("gameArea");
const userGuessInput = document.getElementById("userGuess");
const resultDiv = document.getElementById("result");
const attemptsSpan = document.getElementById("attempts");
const maxAttemptsSpan = document.getElementById("maxAttempts");
const scoreSpan = document.getElementById("score");
const currentRoundSpan = document.getElementById("currentRound");
const totalRoundsSpan = document.getElementById("totalRounds");
const timerSpan = document.getElementById("timer");

// Підказки
const hintParityBtn = document.getElementById("hintParityBtn");
const hintNearBtn = document.getElementById("hintNearBtn");
const hintDivBtn = document.getElementById("hintDivBtn");
const hintSideBtn = document.getElementById("hintSideBtn");

// Модифікатори
const toggleModifiersBtn = document.getElementById("toggleModifiers");
const modifiersContainer = document.getElementById("modifiersContainer");

// =====================
// Ігрові змінні
// =====================
let secretNumber;
let maxNumber;
let attemptsUsed = 0;
let maxAttempts = 10;
let totalRounds = 5;
let currentRound = 1;
let score = 0;
let timer = 0;
let timerInterval;
let failedAttempts = 0;
let gameMode = 'classic';

// Модифікатори
const modifiers = {
    slipperyNumber: { name: "Хитре число", description: "Число змінюється на -1/0/+1 після спроби" },
    timePenalty: { name: "Штраф часу", description: "Кожна спроба забирає 5 секунд" },
    extraAttemptRandom: { name: "Бонусні спроби", description: "20% шанс +1, 5% шанс +2" },
    reverseHints: { name: "Зворотні підказки", description: "Більше/менше працюють навпаки" },
    friendlyMode: { name: "Дружній режим", description: "Після 3 невдалих — авто-підказка парності" },
    luckyNumber: { name: "Щасливе число", description: "1% шанс вгадати число автоматично" }
};

let activeModifiers = {};

// =====================
// Ініціалізація
// =====================
function init() {
    renderModifiers();
    setupEventListeners();
    updateTournamentSettings();
}

// =====================
// Відображення модифікаторів
// =====================
function renderModifiers() {
    modifiersContainer.innerHTML = "";
    for (let key in modifiers) {
        const mod = modifiers[key];
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.dataset.mod = key;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${mod.name} — ${mod.description}`));
        modifiersContainer.appendChild(label);
    }
}

// =====================
// Налаштування подій
// =====================
function setupEventListeners() {
    startBtn.addEventListener("click", startGame);
    checkBtn.addEventListener("click", checkGuess);
    endGameBtn.addEventListener("click", () => location.reload());
    
    modeSelect.addEventListener("change", updateTournamentSettings);
    
    hintParityBtn.addEventListener("click", hintParity);
    hintNearBtn.addEventListener("click", hintNear);
    hintDivBtn.addEventListener("click", hintDivisible);
    hintSideBtn.addEventListener("click", hintSide);
    
    toggleModifiersBtn.addEventListener("click", () => {
        modifiersContainer.classList.toggle("hidden");
        toggleModifiersBtn.classList.toggle("closed");
        toggleModifiersBtn.textContent = modifiersContainer.classList.contains("hidden") 
            ? "Модифікатори ▼" 
            : "Модифікатори ▲";
    });
    
    // Дозволити натискання Enter для перевірки числа
    userGuessInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            checkGuess();
        }
    });
}

// =====================
// Оновлення налаштувань турніру
// =====================
function updateTournamentSettings() {
    gameMode = modeSelect.value;
    if (gameMode === 'tournament') {
        tournamentSettings.classList.remove("hidden");
    } else {
        tournamentSettings.classList.add("hidden");
    }
}

// =====================
// Службові функції
// =====================
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateStatus() {
    attemptsSpan.textContent = attemptsUsed;
    maxAttemptsSpan.textContent = maxAttempts;
    currentRoundSpan.textContent = currentRound;
    totalRoundsSpan.textContent = totalRounds;
    scoreSpan.textContent = score;
    
    // Оновлюємо таймер тільки якщо він активний
    if (maxNumber > 10) {
        timerSpan.textContent = timer;
        timerSpan.parentElement.style.display = "block";
    } else {
        timerSpan.parentElement.style.display = "none";
    }
}

function spend(cost) {
    if (attemptsUsed + cost > maxAttempts) {
        endGame(false, `❌ Спроби закінчились! Число було: ${secretNumber}`);
        return false;
    }
    attemptsUsed += cost;
    updateStatus();
    return true;
}

// =====================
// Підказки
// =====================
function hintParity() {
    if (!spend(2)) return;
    const text = secretNumber % 2 === 0 ? "Число парне" : "Число непарне";
    resultDiv.textContent = `Підказка: ${text}`;
    resultDiv.style.color = "#3377ff";
}

function hintNear() {
    if (!spend(3)) return;
    const guess = parseInt(userGuessInput.value || 0);
    if (isNaN(guess)) {
        resultDiv.textContent = "Спершу введіть число для перевірки близькості";
        resultDiv.style.color = "red";
        return;
    }
    const diff = Math.abs(secretNumber - guess);
    let msg = diff === 0 ? "Ви вгадали!" :
              diff <= 2 ? "Дуже близько" :
              diff <= 5 ? "Близько" : "Далеко";
    resultDiv.textContent = `Підказка: ${msg}`;
    resultDiv.style.color = "#22aa22";
}

function hintDivisible() {
    if (!spend(4)) return;
    const divs = [2, 3, 5, 10];
    const valid = divs.filter(d => secretNumber % d === 0);
    const msg = valid.length ? `Число ділиться на: ${valid.join(", ")}` : "Не ділиться на 2,3,5,10";
    resultDiv.textContent = `Підказка: ${msg}`;
    resultDiv.style.color = "#aa22aa";
}

function hintSide() {
    if (!spend(3)) return;
    const mid = maxNumber / 2;
    const msg = secretNumber < mid ? "Число ближче до початку діапазону" : "Число ближче до кінця";
    resultDiv.textContent = `Підказка: ${msg}`;
    resultDiv.style.color = "#cc6600";
}

// =====================
// Модифікатори
// =====================
function applySlippery() {
    if (!activeModifiers.slipperyNumber) return;
    secretNumber += getRandom(-1, 1);
    if (secretNumber < 1) secretNumber = 1;
    if (secretNumber > maxNumber) secretNumber = maxNumber;
    console.log("Хитре число:", secretNumber);
}

function applyExtraAttempts() {
    if (!activeModifiers.extraAttemptRandom) return;
    const r = Math.random();
    if (r < 0.05) {
        maxAttempts += 2;
        resultDiv.textContent = "+2 спроби!";
    } else if (r < 0.25) {
        maxAttempts += 1;
        resultDiv.textContent = "+1 спроба!";
    }
    updateStatus();
}

function applyTimePenalty() {
    if (!activeModifiers.timePenalty) return;
    timer -= 5;
    if (timer < 0) timer = 0;
    updateStatus();
}

function reverseHintText(text) {
    if (!activeModifiers.reverseHints) return text;
    if (text.includes("більше")) return "Спробуйте менше";
    if (text.includes("менше")) return "Спробуйте більше";
    return text;
}

function friendlyModeCheck() {
    if (!activeModifiers.friendlyMode) return;
    if (failedAttempts >= 3) {
        const parity = secretNumber % 2 === 0 ? "парне" : "непарне";
        resultDiv.textContent = `Авто-підказка: число ${parity}`;
        resultDiv.style.color = "#0099dd";
    }
}

function luckyNumberCheck() {
    if (!activeModifiers.luckyNumber) return false;
    return Math.random() < 0.01;
}

// =====================
// Старт гри
// =====================
function startGame() {
    maxNumber = parseInt(difficultySelect.value);
    gameMode = modeSelect.value;
    
    // Налаштування параметрів гри залежно від режиму
    if (gameMode === 'tournament') {
        maxAttempts = parseInt(maxAttemptsInput.value);
        totalRounds = parseInt(roundsInput.value);
    } else if (gameMode === 'endless') {
        maxAttempts = 10;
        totalRounds = 1;
    } else { // classic
        maxAttempts = 10;
        totalRounds = 1;
    }
    
    attemptsUsed = 0;
    currentRound = 1;
    score = 0;
    failedAttempts = 0;

    secretNumber = getRandom(1, maxNumber);
    console.log("Загадане число:", secretNumber);

    // Збір активних модифікаторів
    activeModifiers = {};
    document.querySelectorAll("#modifiersContainer input:checked")
        .forEach(ch => activeModifiers[ch.dataset.mod] = true);

    // Налаштування таймера - тільки для складності вище 1-10
    clearInterval(timerInterval);
    
    if (maxNumber === 10) {
        // Без таймера для складності 1-10
        timer = 0;
        timerSpan.parentElement.style.display = "none";
    } else {
        // Таймер для складніших рівнів
        timer = maxNumber === 100 ? 120 : 180;
        timerSpan.parentElement.style.display = "block";
        
        timerInterval = setInterval(() => {
            if (timer > 0) {
                timer--;
                timerSpan.textContent = timer;
            } else {
                clearInterval(timerInterval);
                endGame(false, `Час вийшов! Число було: ${secretNumber}`);
            }
        }, 1000);
    }

    // Показати ігрову область
    gameArea.style.display = "block";
    startBtn.style.display = "none";
    endGameBtn.style.display = "inline-block";
    userGuessInput.disabled = false;
    checkBtn.disabled = false;

    updateStatus();
    resultDiv.textContent = "";
    userGuessInput.value = "";
    userGuessInput.focus();
}

// =====================
// Перевірка числа
// =====================
function checkGuess() {
    const guess = parseInt(userGuessInput.value);
    if (isNaN(guess) || guess < 1 || guess > maxNumber) {
        resultDiv.textContent = `Введіть число від 1 до ${maxNumber}`;
        resultDiv.style.color = "red";
        return;
    }

    // Перевірка щасливого числа
    if (luckyNumberCheck()) {
        score += 10;
        updateStatus();
        endGame(true, `🎉 Щасливе число! Ви вгадали ${secretNumber}`);
        return;
    }

    attemptsUsed++;
    applyTimePenalty();
    applyExtraAttempts();

    if (guess === secretNumber) {
        score += 10;
        updateStatus();
        failedAttempts = 0;

        // Обробка різних режимів гри
        if (gameMode === 'endless') {
            // Нескінченний режим - збільшення спроб і часу
            maxAttempts += 5;
            if (maxNumber > 10) {
                timer += 20;
            }
            secretNumber = getRandom(1, maxNumber);
            console.log("Нове загадане число:", secretNumber);
            resultDiv.textContent = "🎉 Вірно! Загадано нове число";
            resultDiv.style.color = "green";
        } else if (gameMode === 'tournament') {
            // Турнірний режим - перехід до наступного раунду
            currentRound++;
            if (currentRound <= totalRounds) {
                secretNumber = getRandom(1, maxNumber);
                attemptsUsed = 0;
                console.log("Нове загадане число:", secretNumber);
                resultDiv.textContent = `🎉 Вірно! Раунд ${currentRound} з ${totalRounds}`;
                resultDiv.style.color = "green";
            } else {
                endGame(true, `🎉 Турнір завершено! Ваш рахунок: ${score}`);
                return;
            }
        } else {
            // Класичний режим - завершення гри
            endGame(true, `🎉 Вірно! Число: ${secretNumber}`);
            return;
        }
        
        userGuessInput.value = "";
        userGuessInput.focus();
        updateStatus();
        return;
    }

    // Неправильна відповідь
    failedAttempts++;
    friendlyModeCheck();

    let hint = guess < secretNumber ? "Спробуйте більше" : "Спробуйте менше";
    hint = reverseHintText(hint);
    resultDiv.textContent = hint;
    resultDiv.style.color = "orange";

    applySlippery();
    updateStatus();

    if (attemptsUsed >= maxAttempts) {
        endGame(false, `❌ Спроби закінчились. Число було: ${secretNumber}`);
    }
    
    userGuessInput.value = "";
    userGuessInput.focus();
}

// =====================
// Завершення гри
// =====================
function endGame(win, msg) {
    clearInterval(timerInterval);
    resultDiv.textContent = msg;
    resultDiv.style.color = win ? "green" : "red";
    checkBtn.disabled = true;
    userGuessInput.disabled = true;
}

// =====================
// Запуск гри
// =====================

init();
