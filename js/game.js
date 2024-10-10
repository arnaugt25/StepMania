// Obtener el nombre del usuario y la canción seleccionada desde localStorage
const selectedSong = localStorage.getItem('selectedSong');

// Seleccionar los elementos HTML
const audioElement = document.getElementById('game-music');
const playButton = document.getElementById('play-music');
const scoreElement = document.getElementById('score');
const songProgressBar = document.getElementById('song-progress-bar');

let score = 0; // Puntuación inicial
let gameActive = false; // Control del estado del juego

if (selectedSong) {
    audioElement.src = selectedSong;

    // Función para empezar el juego y la música
    function startGame() {
        gameActive = true; // Marcar que el juego está activo

        // Iniciar la música
        audioElement.play().catch(error => console.error('Error al reproducir la música:', error));

        // Cambiar el icono de play a pause
        const icon = playButton.querySelector('i');
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');

        // Generar flechas que caen
        generateArrows();

        // Detectar las teclas del usuario
        detectKeyPress();

        // Terminar el juego cuando la música acabe
        audioElement.addEventListener('ended', endGame);

        // Deshabilitar el botón de play para que no se pueda volver a presionar
        playButton.disabled = true;

        // Iniciar la actualización de la barra de progreso
        updateSongProgress();
    }

    // Evento para comenzar el juego al hacer clic en el botón de play
    playButton.addEventListener('click', startGame);
} else {
    console.error("No se ha seleccionado ninguna canción.");
}

// Función para actualizar la barra de progreso de la canción
function updateSongProgress() {
    requestAnimationFrame(() => {
        if (audioElement.duration) {
            const progress = (audioElement.currentTime / audioElement.duration) * 100;
            songProgressBar.style.width = `${progress}%`;
        }
        updateSongProgress();
    });
}

// Función para generar flechas aleatorias que caen en las columnas correspondientes
function generateArrows() {
    const arrowDirections = ['column-up', 'column-down', 'column-left', 'column-right']; // Columnas posibles
    function generate() {
        if (!gameActive) return; // Detener si el juego no está activo

        const randomDirection = arrowDirections[Math.floor(Math.random() * arrowDirections.length)];
        const column = document.getElementById(randomDirection);

        const arrow = document.createElement('div');
        arrow.classList.add('arrow');
        arrow.textContent = getArrowSymbol(randomDirection);
        column.appendChild(arrow);
        animateArrow(arrow);

        setTimeout(generate, 1000); // Generar flechas cada segundo
    }
    generate();
}

// Función para obtener el símbolo de flecha
function getArrowSymbol(direction) {
    switch (direction) {
        case 'column-up': return '↑';
        case 'column-down': return '↓';
        case 'column-left': return '←';
        case 'column-right': return '→';
        default: return '';
    }
}

// Función para animar las flechas que caen usando requestAnimationFrame
function animateArrow(arrow) {
    let topPosition = 0;
    function moveArrow() {
        if (!gameActive) return; // Detener animación si el juego no está activo

        topPosition += 5;
        arrow.style.top = topPosition + 'px';

        // Si la flecha sale del contenedor, detener la animación y eliminar la flecha
        if (topPosition < arrow.parentElement.offsetHeight) {
            requestAnimationFrame(moveArrow); // Continuar la animación
        } else {
            arrow.remove(); // Eliminar la flecha cuando sale del contenedor
        }
    }
    requestAnimationFrame(moveArrow);
}

// Función para detectar teclas del usuario
function detectKeyPress() {
    window.addEventListener('keydown', (event) => {
        const key = event.key;
        let targetColumn;

        switch (key) {
            case 'ArrowUp':
                targetColumn = 'column-up';
                break;
            case 'ArrowDown':
                targetColumn = 'column-down';
                break;
            case 'ArrowLeft':
                targetColumn = 'column-left';
                break;
            case 'ArrowRight':
                targetColumn = 'column-right';
                break;
            default:
                return;
        }

        const arrow = document.querySelector(`#${targetColumn} .arrow`);
        if (arrow) {
            arrow.remove(); // Eliminar la flecha si es correcta
            updateScore(10); // Añadir puntos
        }
    });
}

// Función para actualizar la puntuación
function updateScore(points) {
    score += points;
    scoreElement.textContent = score;
}

// Función para terminar el juego cuando la música se acaba
function endGame() {
    gameActive = false; // Marcar que el juego ha terminado

    // Eliminar todas las flechas que queden en pantalla
    document.querySelectorAll('.arrow').forEach(arrow => arrow.remove());

    // Obtener el nombre del usuario desde localStorage
    const userName = localStorage.getItem('userName');

    // Llamar a la función para guardar el ranking
    saveRanking(userName, score);
}

// Función para guardar el ranking
function saveRanking(userName, score) {
    const data = { name: userName, score: score };

    fetch('php/save_ranking.php', { // Asegúrate de que la ruta sea correcta
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Respuesta del servidor:', result);
        if (result.status === 'success') {
            // Redirigir al ranking después de guardar
            window.location.href = `ranking.html?userName=${encodeURIComponent(userName)}&score=${score}`;
        } else {
            console.error('Error al guardar el ranking:', result.message);
        }
    })
    .catch(error => {
        console.error('Error al guardar el ranking:', error);
    });
}
    