// Variables para el cálculo de aciertos y errores
let correctHits = 0;  // Número de aciertos del jugador
let totalMoves = 0;   // Total de movimientos (flechas) que el jugador debe realizar
let errors = 0;       // Número de errores cometidos

// Seleccionar elementos HTML necesarios
const selectedSongId = localStorage.getItem('selectedSongId'); // Obtener ID de la canción seleccionada
const selectedSong = decodeURIComponent(localStorage.getItem('selectedSong')); // Obtener URL de la canción seleccionada
const audioElement = document.getElementById('game-music'); // Elemento de audio para la música
const playButton = document.getElementById('play-music'); // Botón para iniciar la música/juego
const scoreElement = document.getElementById('score'); // Elemento donde se mostrará la puntuación
const songProgressBar = document.getElementById('song-progress-bar'); // Barra de progreso de la canción

let score = 0; // Puntuación inicial del jugador
let gameActive = false; // Variable para controlar el estado del juego (activo o no)

if (selectedSong && selectedSongId) {
    // Si se ha seleccionado una canción, asignar la URL de la canción al elemento de audio
    audioElement.src = selectedSong;

    // Función para iniciar el juego
    function startGame() {
        gameActive = true; // Marcar que el juego está activo

        // Cargar el audio seleccionado y esperar a que esté listo para reproducir
        audioElement.src = selectedSong;
        audioElement.addEventListener('canplaythrough', () => {
            // Reproducir la música una vez cargada
            audioElement.play().catch(error => console.error('Error al reproducir la música:', error));
        });

        // Cambiar el icono del botón de play a pause
        const icon = playButton.querySelector('i');
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');

        // Cargar los datos de la canción desde el archivo JSON
        fetch('../json/json.json', { cache: 'no-store' })  // Deshabilitar el caché para obtener siempre la última versión
            .then(response => response.json())
            .then(songs => {
                // Buscar la canción seleccionada por ID
                const song = songs.find(song => song.id == selectedSongId);

                if (song && song.archivoTexto) {
                    // Si se encuentra el archivo de flechas, cargar las flechas
                    loadArrowsFromFile(song.archivoTexto).then(arrows => {
                        totalMoves = arrows.length; // Asignar el total de movimientos según las flechas cargadas
                        if (arrows.length > 0) {
                            scheduleArrows(arrows); // Programar las flechas para que caigan
                        } else {
                            console.error("El archivo de flechas no contiene datos válidos.");
                        }
                    });
                } else {
                    console.warn("No se encontró un archivo de flechas para esta canción o el archivoTexto es null.");
                }
            })
            .catch(error => console.error('Error al cargar el archivo JSON:', error));

        // Detectar las teclas presionadas por el usuario
        detectKeyPress();

        // Finalizar el juego cuando la música termine
        audioElement.addEventListener('ended', endGame);

        // Deshabilitar el botón de play para que no se pueda presionar de nuevo
        playButton.disabled = true;

        // Iniciar la actualización de la barra de progreso de la canción
        updateSongProgress();
    }

    // Añadir un evento al botón de play para iniciar el juego al hacer clic
    playButton.addEventListener('click', startGame);
} else {
    console.error("No se ha seleccionado ninguna canción.");
}

// Función para cargar el archivo de flechas desde el archivo de texto
function loadArrowsFromFile(filePath) {
    return fetch(filePath, { cache: 'no-store' })  // Deshabilitar el caché para obtener la versión más reciente
        .then(response => response.text()) // Leer el archivo como texto
        .then(text => {
            const arrows = parseArrowText(text); // Parsear el archivo de texto en flechas
            if (arrows.length > 0) {
                return arrows; // Retornar las flechas si se encuentran
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

// Función para parsear el archivo de texto en un array de flechas usando el carácter `#` como separador
function parseArrowText(text) {
    const lines = text.split('\n').filter(line => line.trim() !== ''); // Filtrar líneas vacías

    // La primera línea del archivo es manejada aquí (si es necesario), en este caso la ignoramos.
    const firstLine = lines.shift(); // Remover la primera línea
    console.log("Primera línea del archivo:", firstLine); // Puedes usar este valor si es necesario

    // Procesar el resto de las líneas
    return lines.map(line => {
        const [code, startTime] = line.split('#'); // Separar el código y el tiempo usando `#`
        const parsedCode = parseInt(code.trim(), 10); // Convertir el código en un número entero
        const direction = codeToDirection(parsedCode); // Convertir el código en una dirección
        return { direction: direction, time: parseFloat(startTime) }; // Retornar la flecha con dirección y tiempo
    }).filter(arrow => arrow.direction && !isNaN(arrow.time)); // Filtrar flechas inválidas
}

// Función para convertir códigos a direcciones de flechas
function codeToDirection(code) {
    switch (code) {
        case 2190: return '←'; // Flecha izquierda
        case 2191: return '↑'; // Flecha arriba
        case 2192: return '↓'; // Flecha abajo
        case 2193: return '→'; // Flecha derecha
        default: 
            return null; // Si el código no corresponde a una dirección válida
    }
}

// Función para programar la aparición de las flechas en base a los tiempos especificados en el archivo
function scheduleArrows(arrows) {
    arrows.forEach(arrow => {
        const delay = arrow.time * 1000; // Convertir el tiempo a milisegundos
        setTimeout(() => {
            createArrow(arrow.direction); // Crear la flecha en la dirección indicada
        }, delay);
    });
}

// Función para crear la flecha en la dirección correcta
function createArrow(direction) {
    let columnId;
    switch (direction) {
        case '←':
            columnId = 'column-left'; // Columna de la flecha izquierda
            break;
        case '↑':
            columnId = 'column-up'; // Columna de la flecha arriba
            break;
        case '↓':
            columnId = 'column-down'; // Columna de la flecha abajo
            break;
        case '→':
            columnId = 'column-right'; // Columna de la flecha derecha
            break;
        default:
            console.error("Dirección desconocida:", direction);
            return;
    }

    // Crear la flecha en la columna correspondiente
    const column = document.getElementById(columnId);
    if (column) {
        const arrow = document.createElement('div'); // Crear el elemento de flecha
        arrow.classList.add('arrow'); // Añadir la clase CSS para la flecha
        arrow.textContent = direction; // Añadir el texto de dirección
        column.appendChild(arrow); // Añadir la flecha a la columna
        animateArrow(arrow); // Iniciar la animación de la flecha
    } else {
        console.error("No se encontró la columna para la dirección:", direction);
    }
}

// Función para animar las flechas que caen usando requestAnimationFrame
function animateArrow(arrow) {
    let topPosition = 0; // Posición inicial de la flecha
    function moveArrow() {
        if (!gameActive) return; // Detener la animación si el juego ha terminado

        topPosition += 5; // Aumentar la posición superior para simular movimiento
        arrow.style.top = topPosition + 'px'; // Actualizar la posición de la flecha

        // Continuar la animación mientras la flecha esté en pantalla
        if (arrow.parentElement && topPosition < arrow.parentElement.offsetHeight) {
            requestAnimationFrame(moveArrow); // Continuar animando
        } else {
            arrow.remove(); // Eliminar la flecha cuando sale de la pantalla
        }
    }
    requestAnimationFrame(moveArrow); // Iniciar la animación
}

// Función para detectar las teclas presionadas por el usuario
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
                return; // Ignorar cualquier otra tecla
        }

        // Verificar si hay una flecha en la columna correcta
        const arrow = document.querySelector(`#${targetColumn} .arrow`);
        if (arrow) {
            arrow.remove(); // Eliminar la flecha si es correcta
            updateScore(100, true); // Acierto, sumar puntos
        } else {
            updateScore(-50, false); // Error, restar puntos
        }
    });
}

// Función para actualizar la puntuación y mostrar la precisión
function updateScore(points, isCorrect) {
    score += points; // Actualizar la puntuación
    if (isCorrect) {
        correctHits++; // Aumentar los aciertos
    } else {
        errors++; // Aumentar los errores
    }
    scoreElement.textContent = `Score: ${score} | ${getAccuracyPercentage()}% (${getRank()})`; // Actualizar la puntuación en la pantalla
}

// Función para calcular el porcentaje de aciertos
function getAccuracyPercentage() {
    if (totalMoves === 0) return 0;
    return Math.round((correctHits / totalMoves) * 100);
}

// Función para determinar el rango del jugador basado en la precisión
function getRank() {
    const accuracy = getAccuracyPercentage();
    if (accuracy >= 90) return 'A';
    if (accuracy >= 70) return 'B';
    if (accuracy >= 50) return 'C';
    if (accuracy >= 25) return 'D';
    return 'E';
}

// Función para terminar el juego cuando la música se acaba
function endGame() {
    gameActive = false; // Marcar que el juego ha terminado

    // Eliminar todas las flechas que queden en pantalla
    document.querySelectorAll('.arrow').forEach(arrow => arrow.remove());

    // Mostrar la puntuación final y la precisión
    const finalScore = `Final Score: ${score} | Accuracy: ${getAccuracyPercentage()}% (${getRank()})`;
    alert(finalScore); // Mostrar el resultado al jugador

    // Obtener el nombre del usuario desde localStorage
    const userName = localStorage.getItem('userName');

    // Guardar el ranking del jugador
    saveRanking(userName, score);

    // Redirigir al ranking después de que el juego termine
    window.location.href = `../ranking.html?userName=${encodeURIComponent(userName)}&score=${score}`;
}

// Función para guardar el ranking del jugador
function saveRanking(userName, score) {
    const data = { name: userName, score: score };

    fetch('../php/save_ranking.php', { // Enviar los datos al servidor
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        cache: 'no-store',  // Deshabilitar el caché
        body: JSON.stringify(data) // Enviar los datos como JSON
    })
    .then(response => response.json())
    .then(result => {
        console.log('Respuesta del servidor:', result);
        if (result.status === 'success') {
            // Redirigir al ranking si se guardó correctamente
            window.location.href = `../ranking.html?userName=${encodeURIComponent(userName)}&score=${score}`;
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
            const progress = (audioElement.currentTime / audioElement.duration) * 100; // Calcular el progreso
            songProgressBar.style.width = `${progress}%`; // Actualizar la barra de progreso
        }
        if (gameActive) {
            updateSongProgress(); // Continuar actualizando mientras la música esté en curso
        }
    });
}

// Obtener los datos de la URL desde PHP y guardarlos en localStorage si no están ya definidos
if (!localStorage.getItem('selectedSongId')) {
    const selectedSongId = '<?php echo $songId; ?>';
    const selectedSong = decodeURIComponent('<?php echo $songUrl; ?>');
    
    // Guardar los valores en localStorage para usarlos en el juego
    localStorage.setItem('selectedSongId', selectedSongId);
    localStorage.setItem('selectedSong', selectedSong);
}

// Función para mostrar el modal de inicio del juego
function showModal() {
    document.getElementById('myModal').style.display = 'block';
}

// Función para mostrar el juego después de cerrar el modal
function showGame() {
    document.querySelector('.game-container').style.display = 'block'; // Mostrar el contenedor del juego
    document.getElementById('play-music').style.display = 'block'; // Mostrar el botón de play
    document.querySelector('.song-progress-container').style.display = 'block'; // Mostrar la barra de progreso
    document.querySelector('.score').style.display = 'block'; // Mostrar la puntuación
}

// Mostrar el modal al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    showModal(); // Mostrar el modal cuando la página cargue
});

// Manejar el envío del formulario para obtener el nombre del jugador
document.getElementById('nameForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    const userName = document.getElementById('nameInput').value; // Obtener el nombre del jugador

    if (userName === '') {
        document.getElementById('error').style.display = 'block'; // Mostrar error si no se introdujo el nombre
    } else {
        document.getElementById('myModal').style.display = 'none'; // Ocultar el modal
        localStorage.setItem('userName', userName); // Guardar el nombre del jugador en localStorage
        showGame();  // Mostrar el juego después de introducir el nombre
    }
});
