        const userName = localStorage.getItem('userName');
        const selectedSong = localStorage.getItem('selectedSong');

        if (userName) {
            document.getElementById('user-name').textContent = `¡Hola, ${userName}!`;
        }

        if (selectedSong) {
            const audioElement = document.getElementById('game-music');
            audioElement.src = selectedSong;

            document.getElementById('play-music').addEventListener('click', () => {
                audioElement.play().catch(error => {
                    console.error("Error al reproducir la música:", error);
                });
            });
        } else {
            console.error("No se ha seleccionado ninguna canción.");
        }