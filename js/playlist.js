// Función para reproducir o pausar la canción
function togglePlay(audio, playButton) {
    const icon = playButton.querySelector('i'); // Selecciona el icono dentro del botón de reproducción
    if (audio.paused) {
        // Pausar todas las demás canciones antes de reproducir la actual
        document.querySelectorAll('.song-audio').forEach(aud => {
            if (!aud.paused && aud !== audio) {
                aud.pause(); // Pausar cualquier otra canción que se esté reproduciendo
                const otherPlayButton = aud.closest('.play-song-item').querySelector('.play-button i'); 
                if (otherPlayButton) {
                    otherPlayButton.classList.remove('fa-pause'); // Cambiar el icono de pausa a play
                    otherPlayButton.classList.add('fa-play');
                }
            }
        });

        audio.play(); // Reproducir la canción actual
        icon.classList.remove('fa-play'); // Cambiar el icono de play a pausa
        icon.classList.add('fa-pause');
    } else {
        audio.pause(); // Pausar la canción actual
        icon.classList.remove('fa-pause'); // Cambiar el icono de pausa a play
        icon.classList.add('fa-play');
    }
}

// Asociar la lógica de reproducción/pausa y otras acciones a cada canción
document.querySelectorAll('.play-song-item').forEach(item => {
    const playButton = item.querySelector('.play-button'); // Obtener el botón de play
    const audioElement = item.querySelector('.song-audio'); // Obtener el elemento de audio
    const songUrl = item.getAttribute('data-song'); // Obtener la URL de la canción desde un atributo personalizado
    const songId = item.getAttribute('data-id'); // Obtener el ID de la canción

    // Añadir el evento click para reproducir/pausar la canción
    playButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Evitar que el clic en el botón se propague al contenedor principal
        togglePlay(audioElement, playButton); // Llamar a la función de reproducción/pausa

        // Guardar la URL de la canción y el ID en localStorage
        localStorage.setItem('selectedSong', encodeURIComponent(songUrl));
        localStorage.setItem('selectedSongId', songId); 
    });

    // Añadir la lógica para redirigir a otra página cuando se haga clic en la canción (excepto en el botón de reproducción)
    item.addEventListener('click', (event) => {
        if (!event.target.closest('.play-button')) { // Evitar la redirección si el clic fue en el botón de reproducción
            const songId = item.getAttribute('data-id');
            const songUrl = encodeURIComponent(item.querySelector('.song-audio').src); // Codificar la URL de la canción
            window.location.href = `${item.getAttribute('data-url')}?songId=${songId}&songUrl=${songUrl}`; // Redirigir a la página del juego
        }
    });
});

// Función para eliminar una canción
function eliminarCancion(index) {
    fetch(`php/eliminar.php?index=${index}`, {
        method: 'GET',
        cache: 'no-store'  // Deshabilitar la caché
    })
    .then(response => response.text()) // Obtener la respuesta en formato texto
    .then(data => {
        console.log(data); // Mostrar la respuesta del servidor
        location.reload(); // Recargar la página para actualizar el listado de canciones
    })
    .catch(error => console.error('Error al eliminar la canción:', error)); // Mostrar errores si los hay
}

// Función para redirigir a la página de edición de una canción
function editarCancion(cancion, index) {
    window.location.href = `php/editar.php?id=${index}`; // Redirigir a la página de edición con el ID de la canción
}

// Cargar las canciones desde un archivo JSON y mostrarlas en el DOM
fetch('../json/json.json', { cache: 'no-store' })  // Deshabilitar la caché
    .then(response => response.json())  // Parsear el archivo JSON
    .then(data => {
        const songList = document.getElementById('play-song-list'); // Contenedor de la lista de canciones

        // Recorrer cada canción del JSON y crear los elementos HTML correspondientes
        data.forEach((cancion, index) => {
            // Crear el contenedor principal de la canción
            const songItem = document.createElement('div');
            songItem.classList.add('play-song-item'); // Añadir la clase CSS
            songItem.setAttribute('data-url', 'php/game.php'); // Añadir el enlace de juego
            songItem.setAttribute('data-id', cancion.id); // Asignar el ID de la canción

            // Crear y añadir la imagen de la carátula
            const caratula = document.createElement('img');
            caratula.src = cancion.archivoCaratula; // Ruta de la carátula desde el JSON
            caratula.alt = `Carátula de ${cancion.titulo}`;
            caratula.classList.add('song-img'); // Añadir la clase CSS

            // Crear el contenedor de información de la canción
            const songInfo = document.createElement('div');
            songInfo.classList.add('play-song-info'); // Añadir la clase CSS
            songInfo.innerHTML = `
                <h2>${cancion.titulo}</h2>
                <p>by ${cancion.artista}</p>
                <p class="mapper">Map created by <strong>${cancion.artista}</strong></p>
            `;

            // Crear la sección de estado
            const status = document.createElement('div');
            status.classList.add('status'); // Añadir la clase CSS

            const statusLabel = document.createElement('span');
            statusLabel.classList.add('status-label'); // Añadir la clase CSS
            statusLabel.innerText = 'RANKED'; // Estado de la canción (ajusta según tu aplicación)

            // Crear la sección de dificultad con círculos de colores aleatorios
            const difficulty = document.createElement('div');
            difficulty.classList.add('difficulty'); // Añadir la clase CSS
            const colors = ['green', 'yellow', 'red', 'blue', 'purple', 'orange', 'pink']; // Colores posibles
            const numCircles = Math.floor(Math.random() * 4) + 1; // Generar entre 1 y 4 círculos

            for (let i = 0; i < numCircles; i++) {
                const circle = document.createElement('span');
                circle.classList.add('circle'); // Añadir la clase CSS
                circle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]; // Asignar un color aleatorio
                difficulty.appendChild(circle); // Añadir el círculo a la sección de dificultad
            }

            // Añadir la sección de estado y dificultad al contenedor de la canción
            status.appendChild(statusLabel);
            status.appendChild(difficulty);
            songInfo.appendChild(status);

            // Crear el contenedor para los botones (editar, eliminar, play)
            const buttonsContainer = document.createElement('div');
            buttonsContainer.classList.add('buttons-container'); // Añadir la clase CSS

            // Crear el botón de eliminar
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="fa-solid fa-x"></i>'; // Icono de eliminar
            deleteButton.classList.add('delete-button'); // Añadir la clase CSS
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Evitar que el clic en el botón de eliminar se propague
                eliminarCancion(index); // Llamar a la función de eliminar canción
            });

            // Crear el botón de editar
            const editButton = document.createElement('button');
            editButton.innerHTML = '<i class="fas fa-edit"></i>'; // Icono de editar
            editButton.classList.add('edit-button'); // Añadir la clase CSS
            editButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Evitar que el clic en el botón de editar se propague
                editarCancion(cancion, index); // Llamar a la función de editar canción
            });

            // Crear el botón de play
            const playButton = document.createElement('button');
            playButton.innerHTML = '<i class="fas fa-play"></i>'; // Icono de reproducción
            playButton.classList.add('play-button'); // Añadir la clase CSS

            // Crear el elemento de audio
            const audioElement = document.createElement('audio');
            audioElement.classList.add('song-audio'); // Añadir la clase CSS
            audioElement.src = cancion.archivoMusica; // Ruta de la canción desde el JSON

            // Añadir el evento para el botón de play
            playButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Evitar que el clic en el botón de reproducción se propague
                togglePlay(audioElement, playButton); // Reproducir o pausar la canción

                // Guardar la URL de la canción y el ID en localStorage
                localStorage.setItem('selectedSong', encodeURIComponent(cancion.archivoMusica));
                localStorage.setItem('selectedSongId', cancion.id); // Guardar el ID de la canción
            });

            // Añadir los botones al contenedor de botones
            buttonsContainer.appendChild(playButton);
            buttonsContainer.appendChild(editButton);
            buttonsContainer.appendChild(deleteButton);

            // Añadir los elementos al contenedor principal de la canción
            songItem.appendChild(caratula);
            songItem.appendChild(songInfo);
            songItem.appendChild(buttonsContainer);
            songItem.appendChild(audioElement); // Añadir el elemento de audio

            // Añadir la nueva canción a la lista de canciones en el DOM
            songList.appendChild(songItem);
        });
    })
    .catch(error => console.error('Error al cargar el JSON:', error)); // Mostrar errores si los hay

// Función para manejar la redirección de las canciones sin interferir con el botón de reproducción
document.addEventListener('click', function(event) {
    const item = event.target.closest('.play-song-item'); // Obtener el elemento de canción clicado
    if (item && !event.target.closest('.play-button')) { // Si no es un clic en el botón de reproducción
        const songId = item.getAttribute('data-id');
        const songUrl = encodeURIComponent(item.querySelector('.song-audio').src); // Codificar la URL de la canción
        window.location.href = `${item.getAttribute('data-url')}?songId=${songId}&songUrl=${songUrl}`; // Redirigir a la página de juego
    }
}); 
