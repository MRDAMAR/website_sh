// Отримуємо елемент canvas і контекст для малювання
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Початкові координати і розміри гравця (квадрата)
const player = {
    x: 375,
    y: 550,
    size: 30,
    speed: 5, // Швидкість гравця
    speedMultiplier: 1 // Множник швидкості (для бафів/дебафів)
};

// Массив для ворогів
let enemies = [];
// Массив для перешкод
let obstacles = [];
// Массив для кубів (бафів/дебафів)
let cubes = [];

// Очки
let score = 0;

// Стан гри
let isGameOver = false;
let isGameWon = false; // Стан перемоги

// Параметри складності
let difficultyLevel = 1; // Рівень складності

// Обробка подій клавіатури
let keys = {
    left: false,
    right: false
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
});

// Функція для малювання гравця
function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

// Функція для малювання ворогів
function drawEnemies() {
    ctx.fillStyle = 'red';
    for (let i = 0; i < enemies.length; i++) {
        ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].size, enemies[i].size);
    }
}

// Функція для малювання перешкод
function drawObstacles() {
    ctx.fillStyle = 'green';
    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].size, obstacles[i].size);
    }
}

// Функція для малювання кубів (бафів/дебафів)
function drawCubes() {
    for (let i = 0; i < cubes.length; i++) {
        if (cubes[i].type === 'buff') {
            ctx.fillStyle = 'gold'; // Золотий для бафу
        } else {
            ctx.fillStyle = 'purple'; // Фіолетовий для дебафу
        }
        ctx.fillRect(cubes[i].x, cubes[i].y, cubes[i].size, cubes[i].size);
    }
}

// Оновлення позиції гравця
function updatePlayer() {
    if (keys.left && player.x > 0) player.x -= player.speed * player.speedMultiplier;
    if (keys.right && player.x < canvas.width - player.size) player.x += player.speed * player.speedMultiplier;
}

// Оновлення ворогів
function updateEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += enemies[i].speed;
        enemies[i].x += enemies[i].sideMovement;

        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
            score++;
        }
    }
}

// Оновлення перешкод
function updateObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += obstacles[i].speed;

        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
        }
    }
}

// Оновлення кубів (бафів/дебафів)
function updateCubes() {
    for (let i = 0; i < cubes.length; i++) {
        cubes[i].y += cubes[i].speed;

        if (cubes[i].y > canvas.height) {
            cubes.splice(i, 1);
        }
    }
}

// Перевірка на зіткнення з ворогами
function checkCollisions() {
    for (let i = 0; i < enemies.length; i++) {
        if (
            player.x < enemies[i].x + enemies[i].size &&
            player.x + player.size > enemies[i].x &&
            player.y < enemies[i].y + enemies[i].size &&
            player.y + player.size > enemies[i].y
        ) {
            isGameOver = true;
            document.getElementById('gameOver').style.display = 'block';
            document.getElementById('scoreDisplay').textContent = score;
        }
    }

    // Перевірка зіткнення з перешкодами
    for (let i = 0; i < obstacles.length; i++) {
        if (
            player.x < obstacles[i].x + obstacles[i].size &&
            player.x + player.size > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].size &&
            player.y + player.size > obstacles[i].y
        ) {
            isGameOver = true;
            document.getElementById('gameOver').style.display = 'block';
            document.getElementById('scoreDisplay').textContent = score;
        }
    }

    // Перевірка зіткнення з кубами (бафи/дебафи)
    for (let i = 0; i < cubes.length; i++) {
        if (
            player.x < cubes[i].x + cubes[i].size &&
            player.x + player.size > cubes[i].x &&
            player.y < cubes[i].y + cubes[i].size &&
            player.y + player.size > cubes[i].y
        ) {
            if (cubes[i].type === 'buff') {
                player.speedMultiplier = 1.5; // Баф: збільшуємо швидкість
            } else {
                player.speedMultiplier = 0.5; // Дебаф: зменшуємо швидкість
            }
            cubes.splice(i, 1); // Видаляємо куб після того, як він взятий
        }
    }
}

// Генерація ворогів
function generateEnemies() {
    if (Math.random() < 0.03 * difficultyLevel) {
        const enemy = {
            x: Math.random() * (canvas.width - 30),
            y: -30,
            size: 30,
            speed: 4 + Math.random() * 2 + difficultyLevel,
            sideMovement: (Math.random() - 0.5) * 2
        };
        enemies.push(enemy);
    }
}

// Генерація перешкод
function generateObstacles() {
    if (Math.random() < 0.02) {
        const obstacle = {
            x: Math.random() * (canvas.width - 30),
            y: -30,
            size: 40,
            speed: 4 + difficultyLevel,
        };
        obstacles.push(obstacle);
    }
}

// Генерація кубів (бафів/дебафів)
function generateCubes() {
    if (Math.random() < 0.02) {
        const cube = {
            x: Math.random() * (canvas.width - 30),
            y: -30,
            size: 30,
            speed: 4 + difficultyLevel,
            type: Math.random() > 0.5 ? 'buff' : 'debuff', // 50% шанс на баф чи дебаф
        };
        cubes.push(cube);
    }
}

// Оновлення гри
function update() {
    if (isGameOver) return;

    if (score >= 300 && !isGameWon) {
        isGameWon = true;
        document.getElementById('gameOver').style.display = 'block';
        document.getElementById('scoreDisplay').textContent = `Ви пройшли гру! Ваші очки: ${score}`;
        return;
    }

    if (score >= 100 && difficultyLevel === 1) {
        difficultyLevel = 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawEnemies();
    drawObstacles();
    drawCubes();

    updatePlayer();
    updateEnemies();
    updateObstacles();
    updateCubes();
    checkCollisions();
    generateEnemies();
    generateObstacles();
    generateCubes();

    requestAnimationFrame(update);
}

// Запуск гри
update();