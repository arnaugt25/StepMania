// Función para validar el formulario antes de enviarlo
function validarFormulario() {
    const archivoJuego = document.getElementById('juego').value;  // Obtener el valor del input de archivo de juego
    const contenidoJuego = document.getElementById('contenidoJuego').value;  // Obtener el contenido del textarea
    const mensaje = document.getElementById('mensaje');  // Elemento para mostrar mensajes de error

    mensaje.innerHTML = ''; // Limpiar mensajes de error anteriores

    // Verificar si el usuario ha subido un archivo y llenado el textarea al mismo tiempo
    if (archivoJuego && contenidoJuego) {
        mensaje.innerHTML = '<p style="color: red;">Error: No pots pujar un fitxer i emplenar el camp de dades alhora.</p>';
        return false; // Detener el envío del formulario
    }

    // Si se ha subido un archivo, validar que sea un archivo TXT
    if (archivoJuego) {
        const extension = archivoJuego.split('.').pop().toLowerCase();  // Obtener la extensión del archivo
        if (extension !== 'txt') {
            mensaje.innerHTML = '<p style="color: red;">Error: El fitxer de joc ha de ser un fitxer TXT.</p>';
            return false; // Detener el envío si no es un archivo TXT
        }
    }

    // Si se ha llenado el textarea, se puede agregar lógica adicional para validar el contenido
    if (contenidoJuego) {
        if (!validarContenidoJuego(contenidoJuego)) {
            mensaje.innerHTML = '<p style="color: red;">Error: El format del joc no és correcte.</p>';
            return false;  // Detener el envío si la validación del contenido falla
        }
    }

    return true; // Si todo es correcto, permitir el envío del formulario
}

// Función para validar el contenido del textarea del juego
function validarContenidoJuego(contenido) {
    // Aquí puedes implementar la lógica para validar el formato del contenido del juego
    return true;  // Actualmente devuelve true, lo que permite cualquier contenido
}

// Cargar las canciones desde un archivo JSON y actualizar el selector de canciones
fetch('../json/json.json', { cache: 'no-store' })  // Evitar el uso de caché para obtener la versión más reciente del JSON
    .then(response => response.json())  // Parsear el archivo JSON
    .then(data => {
        const selectSong = document.getElementById('selectSong');  // Selector de canciones
        data.forEach((cancion, index) => {
            const option = document.createElement('option');  // Crear una nueva opción en el selector
            option.value = index;  // Asignar el índice de la canción como valor de la opción
            option.textContent = cancion.titulo;  // Mostrar el título de la canción en la opción
            selectSong.appendChild(option);  // Añadir la opción al selector
        });
    })
    .catch(error => console.error('Error al cargar las canciones:', error));  // Mostrar errores en la consola

// Cargar los datos de la canción seleccionada en el formulario
function loadSongData() {
    const selectSong = document.getElementById('selectSong');  // Obtener el selector de canciones
    const selectedIndex = selectSong.value;  // Obtener el índice de la canción seleccionada
    if (selectedIndex === "") return;  // Si no se ha seleccionado ninguna canción, no hacer nada

    fetch('../json/json.json', { cache: 'no-store' })  // Evitar el uso de caché
        .then(response => response.json())  // Parsear el archivo JSON
        .then(data => {
            const cancion = data[selectedIndex];  // Obtener los datos de la canción seleccionada
            document.getElementById('songId').value = selectedIndex;  // Guardar el índice de la canción
            document.getElementById('titulo').value = cancion.titulo;  // Cargar el título de la canción
            document.getElementById('artista').value = cancion.artista;  // Cargar el artista de la canción
            document.getElementById('descripcion').value = cancion.descripcion || '';  // Cargar la descripción, si existe
            
            // Mostrar el formulario de edición
            document.getElementById('editSongForm').style.display = 'block';
        })
        .catch(error => console.error('Error al cargar los datos de la canción:', error));  // Mostrar errores en la consola
}

// Obtener el parámetro 'song' de la URL
const urlParams = new URLSearchParams(window.location.search);
const songIndex = urlParams.get('song');  // Obtener el índice de la canción desde la URL

// Si se ha seleccionado una canción, cargar sus datos
if (songIndex !== null) {
    loadSongData(songIndex);  // Llamar a la función para cargar los datos de la canción seleccionada
}

// Cargar los datos de la canción seleccionada en el formulario (sobrecarga de la función)
function loadSongData(index) {
    fetch('../json/json.json', { cache: 'no-store' })  // Evitar el uso de caché
        .then(response => response.json())  // Parsear el archivo JSON
        .then(data => {
            const cancion = data[index];  // Obtener los datos de la canción por su índice
            document.getElementById('songId').value = index;  // Guardar el índice de la canción
            document.getElementById('titulo').value = cancion.titulo;  // Cargar el título de la canción
            document.getElementById('artista').value = cancion.artista;  // Cargar el artista de la canción
            document.getElementById('descripcion').value = cancion.descripcion || '';  // Cargar la descripción de la canción

            // Mostrar los nombres de los archivos actuales
            document.getElementById('current-music').textContent = cancion.archivoMusica ? cancion.archivoMusica.split('/').pop() : 'No hay archivo de música actual';
            document.getElementById('current-caratula').textContent = cancion.archivoCaratula ? cancion.archivoCaratula.split('/').pop() : 'No hay archivo de carátula actual';

            // Mostrar el formulario de edición
            document.getElementById('editSongForm').style.display = 'block';
        })
        .catch(error => console.error('Error al cargar los datos de la canción:', error));  // Mostrar errores en la consola
}

// Actualizar el texto cuando se selecciona un nuevo archivo de música
document.getElementById('musica').addEventListener('change', function() {
    const selectedFile = this.files[0];  // Obtener el archivo seleccionado
    const displaySpan = document.getElementById('current-music');  // Elemento para mostrar el nombre del archivo
    displaySpan.textContent = selectedFile ? selectedFile.name : 'No file selected';  // Actualizar el texto del archivo seleccionado
});

// Actualizar el texto cuando se selecciona una nueva carátula
document.getElementById('caratula').addEventListener('change', function() {
    const selectedFile = this.files[0];  // Obtener el archivo seleccionado
    const displaySpan = document.getElementById('current-caratula');  // Elemento para mostrar el nombre del archivo
    displaySpan.textContent = selectedFile ? selectedFile.name : 'No file selected';  // Actualizar el texto del archivo seleccionado
});

// Actualizar el texto cuando se selecciona un nuevo archivo de texto
document.getElementById('textFile').addEventListener('change', function() {
    const selectedFile = this.files[0];  // Obtener el archivo seleccionado
    const displaySpan = document.getElementById('current-text');  // Elemento para mostrar el nombre del archivo
    displaySpan.textContent = selectedFile ? selectedFile.name : 'No file selected';  // Actualizar el texto del archivo seleccionado
});
