// Obtener el nombre del usuario y la canción seleccionada desde localStorage
const userName = localStorage.getItem('userName');
const selectedSong = localStorage.getItem('selectedSong');

if (userName) {
    document.getElementById('user-name').textContent = `Player: ${userName}`;
}

// Seleccionar los elementos HTML
const audioElement = document.getElementById('game-music');
const playButton = document.getElementById('play-music');
const scoreElement = document.getElementById('score');
const arrowsContainer = document.getElementById('arrows-container');
let score = 0; // Puntuación inicial

if (selectedSong) {
    audioElement.src = selectedSong;

    // Función para empezar el juego y la música
    function startGame() {
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
    }

    // Evento para comenzar el juego al hacer clic en el botón de play
    playButton.addEventListener('click', startGame);
} else {
    console.error("No se ha seleccionado ninguna canción.");
}

// Función para generar flechas aleatorias que caen
function generateArrows() {
    const arrowDirections = ['up', 'down', 'left', 'right']; // Direcciones posibles
    setInterval(() => {
        const arrow = document.createElement('div');
        const randomDirection = arrowDirections[Math.floor(Math.random() * arrowDirections.length)];
        arrow.classList.add('arrow', randomDirection);
        arrow.textContent = getArrowSymbol(randomDirection);
        arrowsContainer.appendChild(arrow);
        animateArrow(arrow);
    }, 1000); // Cada segundo se genera una nueva flecha
}

// Función para obtener el símbolo de flecha
function getArrowSymbol(direction) {
    switch (direction) {
        case 'up': return '↑';
        case 'down': return '↓';
        case 'left': return '←';
        case 'right': return '→';
        default: return '';
    }
}

// Función para animar las flechas que caen
function animateArrow(arrow) {
    let topPosition = 0;
    const arrowInterval = setInterval(() => {
        topPosition += 5;
        arrow.style.top = topPosition + 'px';
        if (topPosition > arrowsContainer.offsetHeight) {
            clearInterval(arrowInterval);
            arrow.remove();
        }
    }, 20);
}

// Función para detectar teclas del usuario
function detectKeyPress() {
    window.addEventListener('keydown', (event) => {
        const key = event.key;
        const arrow = arrowsContainer.querySelector('.arrow');
        if (arrow) {
            const direction = arrow.classList[1]; // Obtener la dirección de la flecha
            if (
                (key === 'ArrowUp' && direction === 'up') ||
                (key === 'ArrowDown' && direction === 'down') ||
                (key === 'ArrowLeft' && direction === 'left') ||
                (key === 'ArrowRight' && direction === 'right')
            ) {
                arrow.remove(); // Eliminar la flecha si es correcta
                updateScore(10); // Añadir puntos
            }
        }
    });
}

// Función para actualizar la puntuación
function updateScore(points) {
    score += points;
    scoreElement.textContent = score;
}

// Función para terminar el juego
function endGame() {
    const userName = localStorage.getItem('userName');
    const score = parseInt(document.getElementById('score').textContent); // Obtener el puntaje final

    // Guardar el puntaje en el archivo JSON
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    
    // Agregar al jugador actual al ranking
    ranking.push({ name: userName, score: score });
    
    // Ordenar el ranking de mayor a menor puntuación
    ranking.sort((a, b) => b.score - a.score);
    
    // Guardar el ranking actualizado en localStorage
    localStorage.setItem('ranking', JSON.stringify(ranking));

    // Obtener la posición del jugador en el ranking
    const position = ranking.findIndex(player => player.name === userName && player.score === score) + 1;

    // Redirigir al ranking con la posición del jugador
    window.location.href = `ranking.html?userName=${encodeURIComponent(userName)}&score=${score}&position=${position}`;
}

