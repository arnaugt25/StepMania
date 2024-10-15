<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StepMania - Juego</title>
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"> <!-- Enlace a FontAwesome -->
</head>
<body class="bodygame">

<?php
// Obtener la URL de la canción y el ID pasados por la URL
$songId = $_GET['songId'] ?? null;
$songUrl = urldecode($_GET['songUrl'] ?? null);

// Verifica si la canción fue pasada correctamente
if ($songId && $songUrl) {
    echo "<script>
        localStorage.setItem('selectedSongId', '$songId');
        localStorage.setItem('selectedSong', '$songUrl');
    </script>";
} else {
    echo "<script>console.error('No se ha seleccionado ninguna canción correctamente.');</script>";
}
?>


    <!-- Modal -->
    <div id="myModal" class="modal">
        <div class="modal-content">
            <h2>Enter Your Name</h2>
            <p>Introduce your name to start the game</p>
            <form id="nameForm" enctype="multipart/form-data">
                <input type="text" id="nameInput" name="playerName" placeholder="Enter your name" required>
                <p id="error" style="color: red; display: none;">Please enter a name</p>
                <button type="submit" id="submitName">Play</button>
            </form>
        </div>
    </div>

    <div class="nombre">
        <h1>StepMania - Juego</h1>
    </div>

    <button id="play-music" class="play-button2"><i class="fa fa-play"></i> Play</button>

    <div class="game-container">
        <!-- Puntuación -->
        <div class="score" id="score">0</div>

        <div id="arrows-container">
            <div class="arrow-column" id="column-left"></div>  <!-- Flecha Izquierda (←) -->
            <div class="arrow-column" id="column-up"></div>    <!-- Flecha Arriba (↑) -->
            <div class="arrow-column" id="column-down"></div>  <!-- Flecha Abajo (↓) -->
            <div class="arrow-column" id="column-right"></div> <!-- Flecha Derecha (→) -->
        </div>
        
        <!-- Elemento de audio oculto -->
        <audio id="game-music" style="display:none;"></audio>
    </div>

    <!-- Barra de progreso de la canción -->
    <div class="song-progress-container">
        <div id="song-progress-bar" class="song-progress-bar"></div>
    </div>

    <!-- Script para manejar el juego -->
    <script src="../js/game.js"></script>
</body>
</html>
