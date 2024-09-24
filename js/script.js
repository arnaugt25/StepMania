jugadores = [
    { posicion: 1, nombre: "Jugador 1", puntuacion: 10000 },
    { posicion: 2, nombre: "Jugador 2", puntuacion: 9500 },
    { posicion: 3, nombre: "Jugador 3", puntuacion: 9000 },
    { posicion: 4, nombre: "Jugador 4", puntuacion: 8500 },
    { posicion: 5, nombre: "Jugador 5", puntuacion: 8000 }
];

// Función para generar el ranking en la página de inicio
function generarRankingInicio() {
    const leaderboardBody = document.getElementById("leaderboardBody");

    if (!leaderboardBody) {
        console.error('No se encontró el elemento con id "leaderboardBody"');
        return;
    }

    jugadores.forEach(jugador => {
        const fila = document.createElement("tr");

        const posicionCelda = document.createElement("td");
        const nombreCelda = document.createElement("td");
        const puntuacionCelda = document.createElement("td");

        posicionCelda.textContent = jugador.posicion;
        nombreCelda.textContent = jugador.nombre;
        puntuacionCelda.textContent = jugador.puntuacion;

        fila.appendChild(posicionCelda);
        fila.appendChild(nombreCelda);
        fila.appendChild(puntuacionCelda);

        leaderboardBody.appendChild(fila);
    });
}

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
