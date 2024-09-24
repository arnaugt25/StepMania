// Datos de ejemplo de los jugadores (este array puede ser reemplazado por datos dinámicos si es necesario)
jugadores = [
    { posicion: 1, nombre: "Jugador 1", puntuacion: 10000 },
    { posicion: 2, nombre: "Jugador 2", puntuacion: 9500 },
    { posicion: 3, nombre: "Jugador 3", puntuacion: 9000 },
    { posicion: 4, nombre: "Jugador 4", puntuacion: 8500 },
    { posicion: 5, nombre: "Jugador 5", puntuacion: 8000 },
    { posicion: 6, nombre: "Jugador 6", puntuacion: 7500 },
    { posicion: 7, nombre: "Jugador 7", puntuacion: 7000 },
    { posicion: 8, nombre: "Jugador 8", puntuacion: 6500 },
    { posicion: 9, nombre: "Jugador 9", puntuacion: 6000 },
    { posicion: 10, nombre: "Jugador 10", puntuacion: 5500 }
];

// Función para generar el ranking en la página de inicio, mostrando solo los primeros 5 jugadores
function generarRankingInicio() {
    const leaderboardBody = document.getElementById("leaderboardBody");

    // Comprobar si leaderboardBody existe
    if (!leaderboardBody) {
        console.error('No se encontró el elemento con id "leaderboardBody"');
        return;
    }

    // Limitar a los primeros 5 jugadores
    const topJugadores = jugadores.slice(0, 5);

    topJugadores.forEach(jugador => {
        // Crear una nueva fila
        const fila = document.createElement("tr");

        // Crear las celdas
        const posicionCelda = document.createElement("td");
        const nombreCelda = document.createElement("td");
        const puntuacionCelda = document.createElement("td");

        // Añadir los datos a las celdas
        posicionCelda.textContent = jugador.posicion;
        nombreCelda.textContent = jugador.nombre;
        puntuacionCelda.textContent = jugador.puntuacion;

        // Añadir las celdas a la fila
        fila.appendChild(posicionCelda);
        fila.appendChild(nombreCelda);
        fila.appendChild(puntuacionCelda);

        // Añadir la fila al cuerpo de la tabla
        leaderboardBody.appendChild(fila);
    });
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', generarRankingInicio);

function validarFormulario() {
    const archivoJuego = document.getElementById('juego').value;
    const contenidoJuego = document.getElementById('contenidoJuego').value;
    const mensaje = document.getElementById('mensaje');

    mensaje.innerHTML = ''; // Limpiar mensajes anteriores

    // Verificar si el usuario ha subido un archivo y llenado el textarea a la vez
    if (archivoJuego && contenidoJuego) {
        mensaje.innerHTML = '<p style="color: red;">Error: No pots pujar un fitxer i emplenar el camp de dades alhora.</p>';
        return false; // Evita el envío del formulario
    }

    // Si solo se ha subido un archivo de juego, validamos que sea un archivo TXT
    if (archivoJuego) {
        const extension = archivoJuego.split('.').pop().toLowerCase();
        if (extension !== 'txt') {
            mensaje.innerHTML = '<p style="color: red;">Error: El fitxer de joc ha de ser un fitxer TXT.</p>';
            return false;
        }
    }

    // Si solo se ha llenado el textarea, puedes agregar más validaciones del contenido aquí
    if (contenidoJuego) {
        // Validación personalizada del contenido del juego (e.g., formato de instantes, valores no negativos, etc.)
        // Aquí deberías agregar validaciones según las reglas del juego
        if (!validarContenidoJuego(contenidoJuego)) {
            mensaje.innerHTML = '<p style="color: red;">Error: El format del joc no és correcte.</p>';
            return false;
        }
    }

    return true;
}

// Función para validar el contenido del juego en el textarea
function validarContenidoJuego(contenido) {
    // Aquí puedes implementar la lógica para validar que el contenido cumpla con tus reglas
    // (e.g., verificar instantes inicial y final, número de elementos, valores no negativos, etc.)
    return true; // De momento, devuelve true para no bloquear el formulario
}
