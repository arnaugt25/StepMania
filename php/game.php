<!DOCTYPE html>
<html lang="es">
<head>
    <!-- Meta para la codificación de caracteres -->
    <meta charset="UTF-8">
    <!-- Meta para asegurar la adaptabilidad en dispositivos móviles -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StepMania - Juego</title>
    <!-- Enlace al archivo de estilos CSS principal -->
    <link rel="stylesheet" href="../css/styles.css">
    <!-- Enlace a FontAwesome para los iconos -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body class="bodygame">

<?php
// Obtener el ID y la URL de la canción desde los parámetros GET de la URL
$songId = $_GET['songId'] ?? null;  // ID de la canción (puede ser null si no se pasa)
$songUrl = urldecode($_GET['songUrl'] ?? null);  // Decodificar la URL de la canción

// Verificar que ambos parámetros se pasaron correctamente
if ($songId && $songUrl) {
    // Almacenar el ID de la canción y la URL en el localStorage para usarlos en el juego
    echo "<script>
        localStorage.setItem('selectedSongId', '$songId');
        localStorage.setItem('selectedSong', '$songUrl');
    </script>";
} else {
    // Mostrar un error en la consola si los parámetros no están presentes
    echo "<script>console.error('No se ha seleccionado ninguna canción correctamente.');</script>";
}
?>

    <!-- Modal para solicitar el nombre del jugador antes de comenzar el juego -->
    <div id="myModal" class="modal">
        <div class="modal-content">
            <h2>Enter Your Name</h2>
            <p>Introduce your name to start the game</p>
            <form id="nameForm" enctype="multipart/form-data">
                <!-- Campo para que el jugador introduzca su nombre -->
                <input type="text" id="nameInput" name="playerName" placeholder="Enter your name" required>
                <!-- Mensaje de error si el nombre no se introduce -->
                <p id="error" style="color: red; display: none;">Please enter a name</p>
                <!-- Botón para comenzar el juego -->
                <button type="submit" id="submitName">Play</button>
            </form>
        </div>
    </div>

    <!-- Contenedor para mostrar el nombre del juego -->
    <div class="nombre">
        <h1>StepMania - Juego</h1>
    </div>

    <!-- Botón para reproducir la música del juego -->
    <button id="play-music" class="play-button2"><i class="fa fa-play"></i> Play</button>

    <!-- Contenedor del juego -->
    <div class="game-container">
        <!-- Puntuación del jugador -->
        <div class="score" id="score">0</div>

        <!-- Contenedor de las flechas -->
        <div id="arrows-container">
            <!-- Columnas para las flechas (izquierda, arriba, abajo, derecha) -->
            <div class="arrow-column" id="column-left"></div>  <!-- Flecha Izquierda (←) -->
            <div class="arrow-column" id="column-up"></div>    <!-- Flecha Arriba (↑) -->
            <div class="arrow-column" id="column-down"></div>  <!-- Flecha Abajo (↓) -->
            <div class="arrow-column" id="column-right"></div> <!-- Flecha Derecha (→) -->
        </div>
        
        <!-- Elemento de audio oculto para la música del juego -->
        <audio id="game-music" style="display:none;"></audio>
    </div>

    <!-- Barra de progreso de la canción -->
    <div class="song-progress-container">
        <!-- Elemento visual que muestra el progreso de la canción -->
        <div id="song-progress-bar" class="song-progress-bar"></div>
    </div>

    <!-- Script que maneja la lógica del juego -->
    <script src="../js/game.js"></script>
</body>
</html>
