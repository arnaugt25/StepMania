// Obtener el nombre del usuario y la canción seleccionada desde localStorage
const selectedSongId = localStorage.getItem('selectedSongId');
const selectedSong = decodeURIComponent(localStorage.getItem('selectedSong'));
// Seleccionar los elementos HTML
const audioElement = document.getElementById('game-music');
const playButton = document.getElementById('play-music');
const scoreElement = document.getElementById('score');
const songProgressBar = document.getElementById('song-progress-bar');

let score = 0; // Puntuación inicial
let gameActive = false; // Control del estado del juego

if (selectedSong && selectedSongId) {
    audioElement.src = selectedSong;
    function startGame() {
        gameActive = true; // Marcar que el juego está activo

        // Cargar el audio seleccionado y esperar que esté completamente cargado
        audioElement.src = selectedSong;
        audioElement.addEventListener('canplaythrough', () => {
            // Iniciar la música
            audioElement.play().catch(error => console.error('Error al reproducir la música:', error));
        });

        // Cambiar el icono de play a pause
        const icon = playButton.querySelector('i');
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');

        // Cargar los datos de la canción desde json.json
        fetch('../json/json.json')
            .then(response => response.json())
            .then(songs => {
                // Buscar la canción por ID
                const song = songs.find(song => song.id == selectedSongId);

                if (song && song.archivoTexto) {
                    // Si el archivo de flechas existe, cargarlo
                    loadArrowsFromFile(song.archivoTexto).then(arrows => {
                        if (arrows.length > 0) {
                            scheduleArrows(arrows); // Generar flechas que caen según el archivo
                        } else {
                            console.error("El archivo de flechas no contiene datos válidos.");
                        }
                    });
                } else {
                    console.warn("No se encontró un archivo de flechas para esta canción o el archivoTexto es null.");
                }
            })
            .catch(error => console.error('Error al cargar el archivo JSON:', error));

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

// Función para cargar el archivo de flechas desde el archivo de texto
function loadArrowsFromFile(filePath) {
    return fetch(filePath)
        .then(response => response.text()) // Cambiado a text() porque es un archivo de texto
        .then(text => {
            const arrows = parseArrowText(text); // Parsear el archivo de texto
            if (arrows.length > 0) {
                return arrows; // Retornar las flechas
            } else {
                console.error("Formato de archivo de flechas incorrecto");
                return [];
            }
        })
        .catch(error => {
            console.error('Error al cargar el archivo de flechas:', error);
            return [];
        });
}

// Función para parsear el archivo de texto en flechas usando códigos y separador `#`
function parseArrowText(text) {
    const lines = text.split('\n').filter(line => line.trim() !== ''); // Filtrar líneas vacías

    // La primera línea del archivo se maneja aquí. En este caso, la ignoramos.
    const firstLine = lines.shift(); // Quitar la primera línea
    console.log("Primera línea del archivo:", firstLine); // Puedes usar este valor si es necesario

    // Procesar el resto de las líneas
    return lines.map(line => {
        const [code, startTime, endTime] = line.split('#'); // Separar usando `#`
        const parsedCode = parseInt(code.trim(), 10); // Asegurarse de que es un número entero
        const direction = codeToDirection(parsedCode); // Convertir el código a dirección
        return { direction: direction, time: parseFloat(startTime) }; // Solo usamos el tiempo de inicio
    }).filter(arrow => arrow.direction && !isNaN(arrow.time)); // Filtrar flechas inválidas
}

// Función para convertir los códigos a las direcciones de flechas
function codeToDirection(code) {
    switch (code) {
        case 2190: return '←'; // Flecha izquierda
        case 2191: return '↑'; // Flecha arriba
        case 2192: return '↓'; // Flecha abajo
        case 2193: return '→'; // Flecha derecha
        default: 
            return null;
    }
}

// Función para programar la aparición de flechas en base a los tiempos del archivo
function scheduleArrows(arrows) {
    arrows.forEach(arrow => {
        const delay = arrow.time * 1000; // Tiempo en milisegundos para sincronizar con la música
        setTimeout(() => {
            createArrow(arrow.direction); // Crear la flecha en la dirección especificada
        }, delay);
    });
}

// Función para crear la flecha en la dirección correcta
function createArrow(direction) {
    let columnId;
    switch (direction) {
        case '←':
            columnId = 'column-left'; // Columna para la flecha izquierda
            break;
        case '↑':
            columnId = 'column-up'; // Columna para la flecha hacia arriba
            break;
        case '↓':
            columnId = 'column-down'; // Columna para la flecha hacia abajo
            break;
        case '→':
            columnId = 'column-right'; // Columna para la flecha hacia la derecha
            break;
        default:
            console.error("Dirección desconocida:", direction);
            return;
    }

    const column = document.getElementById(columnId);
    if (column) {
        const arrow = document.createElement('div');
        arrow.classList.add('arrow');
        arrow.textContent = direction;
        column.appendChild(arrow);
        animateArrow(arrow);
    } else {
        console.error("No se encontró la columna para la dirección:", direction);
    }
}

// Función para animar las flechas que caen usando requestAnimationFrame
function animateArrow(arrow) {
    let topPosition = 0;
    function moveArrow() {
        if (!gameActive) return; // Detener la animación si el juego no está activo

        topPosition += 5;
        arrow.style.top = topPosition + 'px';

        // Verificar si el contenedor de la flecha existe y si la flecha está dentro del contenedor
        if (arrow.parentElement && topPosition < arrow.parentElement.offsetHeight) {
            requestAnimationFrame(moveArrow); // Continuar la animación
        } else {
            // Si el elemento no tiene contenedor o ha salido del área visible, eliminarlo
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

// Función para actualizar la barra de progreso de la canción
function updateSongProgress() {
    requestAnimationFrame(() => {
        if (audioElement.duration) {
            const progress = (audioElement.currentTime / audioElement.duration) * 100;
            songProgressBar.style.width = `${progress}%`;
        }
        if (gameActive) {
            updateSongProgress(); // Continuar actualizando mientras la canción esté en curso
        }
    });
}
