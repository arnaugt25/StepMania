<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StepMania - Juego</title>
    <link rel="stylesheet" href="css/styles.css">
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
    <script src="js/game.js"></script>

    <script>
    // Obtener los datos de PHP pasados en la URL y guardarlos en localStorage si no están ya definidos
    if (!localStorage.getItem('selectedSongId')) {
        const selectedSongId = '<?php echo $songId; ?>';
        const selectedSong = decodeURIComponent('<?php echo $songUrl; ?>');
        
        // Guardar los valores en localStorage para usarlos en game.js
        localStorage.setItem('selectedSongId', selectedSongId);
        localStorage.setItem('selectedSong', selectedSong);
    }

    // Función para mostrar el modal
    function showModal() {
        document.getElementById('myModal').style.display = 'block';
    }

    // Función para mostrar el juego después de cerrar el modal
    function showGame() {
        document.querySelector('.game-container').style.display = 'block';
        document.getElementById('play-music').style.display = 'block';
        document.querySelector('.song-progress-container').style.display = 'block';
        document.querySelector('.score').style.display = 'block';
    }

    // Mostrar el modal al cargar la página
    document.addEventListener('DOMContentLoaded', function () {
        showModal();
    });

    // Manejar el envío del formulario
    document.getElementById('nameForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const userName = document.getElementById('nameInput').value;

        if (userName === '') {
            document.getElementById('error').style.display = 'block';
        } else {
            document.getElementById('myModal').style.display = 'none';
            localStorage.setItem('userName', userName);
            showGame();  // Mostrar el juego después de introducir el nombre
        }
    });
    </script>
</body>
</html>
