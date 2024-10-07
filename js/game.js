// Obtener el nombre del usuario y la canción seleccionada desde localStorage
const userName = localStorage.getItem('userName');
const selectedSong = localStorage.getItem('selectedSong');

// Mostrar el nombre del usuario si existe
if (userName) {
    document.getElementById('user-name').textContent = `¡Hola, ${userName}!`;
}

// Si hay una canción seleccionada, asignar la fuente de audio
if (selectedSong) {
    const audioElement = document.getElementById('game-music');
    audioElement.src = selectedSong;

    const playButton = document.getElementById('play-music');
    const icon = playButton.querySelector('i'); // Icono dentro del botón

    // Función para alternar entre reproducción y pausa
    function togglePlayPause() {
        if (audioElement.paused) {
            audioElement.play().catch(error => {
                console.error("Error al reproducir la música:", error);
            });
            icon.classList.remove('fa-play');  // Cambiar el icono a "pause"
            icon.classList.add('fa-pause');
        } else {
            audioElement.pause();
            icon.classList.remove('fa-pause');  // Cambiar el icono a "play"
            icon.classList.add('fa-play');
        }
    }

    // Evento para manejar el clic en el botón de reproducción/pausa
    playButton.addEventListener('click', togglePlayPause);
} else {
    console.error("No se ha seleccionado ninguna canción.");
}
