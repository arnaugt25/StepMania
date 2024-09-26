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

const caratula = document.createElement('img');
caratula.src = cancion.archivoCaratula;  // Verifica que el archivo JSON tiene la ruta correcta
caratula.alt = `Carátula de ${cancion.titulo}`;
caratula.classList.add('song-img');  // Aplicar la clase CSS

fetch('php/json.json')
    .then(response => response.json())
    .then(data => {
        const selectSong = document.getElementById('selectSong');
        data.forEach((cancion, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = cancion.titulo;
            selectSong.appendChild(option);
        });
    })
    .catch(error => console.error('Error al cargar las canciones:', error));

// Cargar los datos de la canción seleccionada en el formulario
function loadSongData() {
    const selectSong = document.getElementById('selectSong');
    const selectedIndex = selectSong.value;
    if (selectedIndex === "") return;

    fetch('php/json.json')
        .then(response => response.json())
        .then(data => {
            const cancion = data[selectedIndex];
            document.getElementById('songId').value = selectedIndex; // Guardar el índice de la canción
            document.getElementById('titulo').value = cancion.titulo;
            document.getElementById('artista').value = cancion.artista;
            document.getElementById('descripcion').value = cancion.descripcion || '';
            
            // Mostrar el formulario
            document.getElementById('editSongForm').style.display = 'block';
        })
        .catch(error => console.error('Error al cargar los datos de la canción:', error));
}
