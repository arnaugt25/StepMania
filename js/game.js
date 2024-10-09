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
let arrowInterval; // Intervalo para generar flechas
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
    }

    // Evento para comenzar el juego al hacer clic en el botón de play
    playButton.addEventListener('click', startGame);
} else {
    console.error("No se ha seleccionado ninguna canción.");
}

// Función para generar flechas aleatorias que caen
function generateArrows() {
    const arrowDirections = ['up', 'down', 'left', 'right']; // Direcciones posibles
    arrowInterval = setInterval(() => {
        if (!gameActive) return; // Detener si el juego no está activo
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
    let topPosition = 0;  // Comenzar desde la parte superior
    const arrowAnimation = setInterval(() => {
        if (!gameActive) {
            clearInterval(arrowAnimation); // Detener animación si el juego no está activo
            return;
        }
        topPosition += 5;  // Velocidad de caída
        arrow.style.transform = `translateY(${topPosition}px)`;  // Mover hacia abajo

        // Si la flecha sale del contenedor, detener la animación y eliminar la flecha
        if (topPosition > arrowsContainer.offsetHeight) {
            clearInterval(arrowAnimation);
            arrow.remove(); // Eliminar la flecha cuando sale del contenedor
        }
    }, 20);  // Intervalo de 20ms para una animación fluida
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

// Función para terminar el juego cuando la música se acaba
function endGame() {
    gameActive = false; // Marcar que el juego ha terminado
    clearInterval(arrowInterval); // Detener la generación de flechas

    // Eliminar todas las flechas que queden en pantalla
    const arrows = document.querySelectorAll('.arrow');
    arrows.forEach(arrow => arrow.remove());

    const userName = localStorage.getItem('userName');
    const score = parseInt(document.getElementById('score').textContent); // Obtener el puntaje final

    // Guardar el nombre y la puntuación en una cookie durante 7 días

    // Enviar los datos al servidor mediante una solicitud AJAX
fetch('php/save_ranking.php', {  // Cambia la ruta a 'php/save_ranking.php'
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: userName,
        score: score
    })
})
.then(response => response.json())
.then(data => {
    // Redirigir al ranking con la posición del jugador
    window.location.href = `ranking.html?userName=${encodeURIComponent(userName)}&score=${score}&position=${data.position}`;
})
.catch(error => console.error('Error al guardar el ranking:', error));
document.addEventListener('DOMContentLoaded', function() {
    // Obtener la cookie con la información del jugador
    const playerInfo = getCookie('playerInfo');

    if (playerInfo) {
        const playerData = JSON.parse(playerInfo); // Convertir de JSON a objeto
        const userName = playerData.name;
        const score = playerData.score;

        // Mostrar la información en la tabla de ranking
        const rankingBody = document.getElementById('rankingBody');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>1</td>
            <td>${userName}</td>
            <td>${score}</td>
        `;
        rankingBody.appendChild(row);
    } else {
        console.log('No se encontró información del jugador en las cookies.');
    }
});

}
