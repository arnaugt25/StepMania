        // Función para reproducir o pausar la canción
        function togglePlay(audio, playButton) {
            const icon = playButton.querySelector('i'); // Selecciona el icono dentro del botón
            if (audio.paused) {
                audio.play();
                icon.classList.remove('fa-play');  // Cambiar de "play" a "pause"
                icon.classList.add('fa-pause');
            } else {
                audio.pause();
                icon.classList.remove('fa-pause');  // Cambiar de "pause" a "play"
                icon.classList.add('fa-play');
            }
        }
    
        // Asignar eventos a los botones de las canciones estáticas (las que ya están en el HTML)
        document.querySelectorAll('.play-song-item').forEach(item => {
            const playButton = item.querySelector('.play-button');
            const audioElement = item.querySelector('.song-audio');
            const songUrl = item.getAttribute('data-song'); // Obtener la URL de la canción
    
            // Evento para reproducir la canción
            playButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Evitar que el clic en el botón se propague al cuadro de la canción
                togglePlay(audioElement, playButton);
    
                // Guardar la URL de la canción seleccionada en localStorage
                localStorage.setItem('selectedSong', songUrl);
            });
    
            // Evento para redirigir a nombre.html cuando se haga clic en el cuadro de la canción
            item.addEventListener('click', (event) => {
                if (!event.target.closest('.play-button')) { // Evitar redirigir cuando se haga clic en el botón de reproducción
                    const songUrlEncoded = encodeURIComponent(songUrl); // Codificar la URL de la canción
                    window.location.href = `${item.getAttribute('data-url')}?songUrl=${songUrlEncoded}`;
                }
            });
        });
        
        // Función para reproducir o pausar la canción
        function togglePlay(audio, playButton) {
            const icon = playButton.querySelector('i'); // Selecciona el icono dentro del botón
            if (audio.paused) {
                audio.play();
                icon.classList.remove('fa-play');  // Cambiar de "play" a "pause"
                icon.classList.add('fa-pause');
            } else {
                audio.pause();
                icon.classList.remove('fa-pause');  // Cambiar de "pause" a "play"
                icon.classList.add('fa-play');
            }
        }

        // Función para eliminar una canción
        function eliminarCancion(index) {
            fetch(`php/eliminar.php?index=${index}`, {
                method: 'GET',
            })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                location.reload();  // Recargar la página para reflejar los cambios
            })
            .catch(error => console.error('Error al eliminar la canción:', error));
        }

        // Función para redirigir a la página de editar una canción
        function editarCancion(cancion, index) {
            window.location.href = `php/editar.php?id=${index}`;
        }

        // Leer el archivo JSON y mostrar las canciones
        fetch('json/json.json')
            .then(response => response.json())
            .then(data => {
                const songList = document.getElementById('play-song-list');

                data.forEach((cancion, index) => {
                    // Crear el contenedor principal con la clase adecuada
                    const songItem = document.createElement('div');
                    songItem.classList.add('play-song-item');  // Aplicar la clase CSS
                    songItem.setAttribute('data-url', 'game.html'); // Añadir el enlace de nombre

                    // Añadir la imagen de la carátula con la clase adecuada
                    const caratula = document.createElement('img');
                    caratula.src = cancion.archivoCaratula;
                    caratula.alt = `Carátula de ${cancion.titulo}`;
                    caratula.classList.add('song-img');  // Aplicar la clase CSS

                    // Crear el contenedor de información de la canción
                    const songInfo = document.createElement('div');
                    songInfo.classList.add('play-song-info');  // Aplicar la clase CSS
                    songInfo.innerHTML = `
                        <h2>${cancion.titulo}</h2>
                        <p>by ${cancion.artista}</p>
                        <p class="mapper">Map created by <strong>${cancion.artista}</strong></p>
                    `;

                    // Crear la sección de estado (status)
                    const status = document.createElement('div');
                    status.classList.add('status');  // Aplicar la clase CSS

                    const statusLabel = document.createElement('span');
                    statusLabel.classList.add('status-label');  // Aplicar la clase CSS
                    statusLabel.innerText = 'RANKED';  // Ajusta esto según la lógica de tu aplicación

                    // Añadir los círculos de dificultad aleatorios
                    const difficulty = document.createElement('div');
                    difficulty.classList.add('difficulty');  // Aplicar la clase CSS

                    // Generar círculos aleatorios y agregarlos
                    const colors = ['green', 'yellow', 'red', 'blue', 'purple', 'orange', 'pink'];
                    const numCircles = Math.floor(Math.random() * 4) + 1; // Generar entre 1 y 4 círculos
                    for (let i = 0; i < numCircles; i++) {
                        const circle = document.createElement('span');
                        circle.classList.add('circle');
                        circle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                        difficulty.appendChild(circle);
                    }

                    // Añadir la sección de dificultad y estado al contenedor de la canción
                    status.appendChild(statusLabel);
                    status.appendChild(difficulty);
                    songInfo.appendChild(status);

                    // Crear el contenedor para los botones (editar/eliminar/play)
                    const buttonsContainer = document.createElement('div');
                    buttonsContainer.classList.add('buttons-container');  // Aplicar la clase CSS

                    // Crear el botón de eliminar
                    const deleteButton = document.createElement('button');
                    deleteButton.innerHTML = '<i class="fa-solid fa-x"></i>'; // Icono de eliminar
                    deleteButton.classList.add('delete-button');
                    deleteButton.addEventListener('click', (event) => {
                        event.stopPropagation(); // Evitar que el clic en el botón se propague
                        eliminarCancion(index);
                    });

                    // Crear el botón de editar
                    const editButton = document.createElement('button');
                    editButton.innerHTML = '<i class="fas fa-edit"></i>'; // Icono de edición
                    editButton.classList.add('edit-button');
                    editButton.addEventListener('click', (event) => {
                        event.stopPropagation(); // Evitar que el clic en el botón se propague
                        editarCancion(cancion, index);
                    });

                    // Crear el botón de play
                    const playButton = document.createElement('button');
                    playButton.innerHTML = '<i class="fas fa-play"></i>'; // Icono de reproducción
                    playButton.classList.add('play-button');

                    // Añadir el elemento de audio
                    const audioElement = document.createElement('audio');
                    audioElement.classList.add('song-audio');
                    audioElement.src = cancion.archivoMusica;  // Usa la ruta del archivo de música desde el JSON

                    playButton.addEventListener('click', (event) => {
                        event.stopPropagation(); // Evitar que el clic en el botón se propague
                        togglePlay(audioElement, playButton);

                        // Guardar la URL de la canción seleccionada en localStorage
                        localStorage.setItem('selectedSong', audioElement.src);
                    });

                    // Añadir los botones al contenedor de botones
                    buttonsContainer.appendChild(playButton);
                    buttonsContainer.appendChild(editButton);
                    buttonsContainer.appendChild(deleteButton);

                    // Añadir los elementos al contenedor principal
                    songItem.appendChild(caratula);
                    songItem.appendChild(songInfo);
                    songItem.appendChild(buttonsContainer);  // Añadir los botones
                    songItem.appendChild(audioElement);  // Añadir el audio

                    // Añadir la nueva canción al listado
                    songList.appendChild(songItem);
                });
            })
            .catch(error => console.error('Error al cargar el JSON:', error));

        // Función para manejar la redirección y asegurarse de que no se interfiere con el botón de reproducción
        document.addEventListener('click', function(event) {
            const item = event.target.closest('.play-song-item');
            if (item && !event.target.closest('.play-button')) { // Evitar la redirección cuando se haga clic en el botón de reproducción
                const songUrl = encodeURIComponent(item.querySelector('.song-audio').src); // Codificar la URL de la canción
                window.location.href = `${item.getAttribute('data-url')}?songUrl=${songUrl}`;
            }
        });
