<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Leer el archivo JSON existente
    $json_file = 'json.json';
    $canciones = file_exists($json_file) ? json_decode(file_get_contents($json_file), true) : array();

    // Obtener el ID (índice) de la canción que se va a editar
    $songId = isset($_POST['songId']) ? $_POST['songId'] : null;

    // Verificar que la canción existe
    if ($songId !== null && isset($canciones[$songId])) {

        // Actualizar los datos de la canción con los nuevos valores del formulario
        $canciones[$songId]['titulo'] = $_POST['titulo'];
        $canciones[$songId]['artista'] = $_POST['artista'];
        $canciones[$songId]['descripcion'] = $_POST['descripcion'] ?? '';

        // Subir archivo de música solo si se ha seleccionado uno
        if (isset($_FILES['musica']) && $_FILES['musica']['error'] === UPLOAD_ERR_OK) {
            $musica_dir = '../uploads/musica/';
            if (!is_dir($musica_dir)) {
                mkdir($musica_dir, 0777, true);
            }
            $musica_file = $musica_dir . basename($_FILES['musica']['name']);
            if (!move_uploaded_file($_FILES['musica']['tmp_name'], $musica_file)) {
                echo "Error al mover el archivo de música.";
                exit();
            }
            $canciones[$songId]['archivoMusica'] = $musica_file;  // Actualiza la música si se sube un nuevo archivo
        }

        // Subir archivo de carátula solo si se ha seleccionado uno
        if (isset($_FILES['caratula']) && $_FILES['caratula']['error'] === UPLOAD_ERR_OK) {
            $caratula_dir = '../uploads/caratula/';
            if (!is_dir($caratula_dir)) {
                mkdir($caratula_dir, 0777, true);
            }
            $caratula_file = $caratula_dir . basename($_FILES['caratula']['name']);
            if (!move_uploaded_file($_FILES['caratula']['tmp_name'], $caratula_file)) {
                echo "Error al mover el archivo de carátula.";
                exit();
            }
            $canciones[$songId]['archivoCaratula'] = $caratula_file;  // Actualiza la carátula si se sube un nuevo archivo
        }

        // Subir archivo de texto solo si se ha seleccionado uno
        if (isset($_FILES['textFile']) && $_FILES['textFile']['error'] === UPLOAD_ERR_OK) {
            $text_dir = '../uploads/text/';
            if (!is_dir($text_dir)) {
                mkdir($text_dir, 0777, true);
            }
            $text_file = $text_dir . basename($_FILES['textFile']['name']);
            if (!move_uploaded_file($_FILES['textFile']['tmp_name'], $text_file)) {
                echo "Error al mover el archivo de texto.";
                exit();
            }
            $canciones[$songId]['archivoTexto'] = $text_file;  // Actualiza el archivo de texto si se sube uno nuevo
        }

        // Guardar el archivo JSON actualizado
        file_put_contents($json_file, json_encode($canciones, JSON_PRETTY_PRINT));

        // Redirigir de vuelta a la página de reproducción
        header('Location: ../play.html');
        exit();
        
    } else {
        echo "Error: La canción no existe.";
    }
}
?>

<?php
// Al cargar la página para editar
if (isset($_GET['id'])) {
    $json_file = 'json.json';
    $canciones = file_exists($json_file) ? json_decode(file_get_contents($json_file), true) : array();
    $songId = $_GET['id'];

    if (isset($canciones[$songId])) {
        $cancion = $canciones[$songId];
    } else {
        echo "Error: La canción no existe.";
        exit();
    }
} else {
    echo "Error: ID de la canción no especificado.";
    exit();
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Canciones</title>
    <link rel="stylesheet" href="../css/styles.css">
</head>
<body class="bodyafegir">
    <nav class="nav2">
        <a href="../index.html"><img src="../css/img/logo1.png" alt="Logo de StepMania" class="logo"></a>
    </nav>

    <div class="form-container">
        
        <!-- Formulario para editar la canción -->
        <form id="editSongForm" action="editar.php" method="post" enctype="multipart/form-data">
            <input type="hidden" id="songId" name="songId" value="<?php echo $songId; ?>">

            <!-- Título de la canción -->
            <label for="titulo">Song Title:</label>
            <input type="text" id="titulo" name="titulo" value="<?php echo $cancion['titulo']; ?>" required>

            <!-- Artista -->
            <label for="artista">Artist:</label>
            <input type="text" id="artista" name="artista" value="<?php echo $cancion['artista']; ?>" required>

            <div class="file-input-container">
                <!-- Campo de selección de música -->
                <div class="file-upload">
                    <label for="musica" class="custom-file-label">Select music  <i class="fa-solid fa-music"></i></label>
                    <input type="file" id="musica" name="musica" accept="audio/*" class="file-input">
                    <span id="current-music" class="file-selected">
                    <?php echo basename($cancion['archivoMusica']); ?>
                </span>
                </div>
            
                <!-- Campo de selección de carátula -->
                <div class="file-upload">
                    <label for="caratula" class="custom-file-label">Select picture <i class="fa-solid fa-image"></i></label>
                    <input type="file" id="caratula" name="caratula" accept="image/*" class="file-input">
                    <span id="current-caratula" class="file-selected">
                    <?php echo basename($cancion['archivoCaratula']); ?>
                </span>
                </div>
            
                <!-- Campo de selección de archivo de texto -->
                <div class="file-upload">
                    <label for="textFile" class="custom-file-label">Select text <i class="fa-solid fa-file-lines"></i></label>
                    <input type="file" id="textFile" name="textFile" accept="text/plain" class="file-input">
                    <span id="current-text" class="file-selected">
                        <?php echo isset($cancion['archivoTexto']) && !empty($cancion['archivoTexto']) ? basename($cancion['archivoTexto']) : 'No file'; ?>
                    </span>
                </div>
            </div>

            <!-- Descripción -->
            <label for="descripcion" class="descripcion">Description</label>
            <textarea id="descripcion" name="descripcion"><?php echo $cancion['descripcion']; ?></textarea>

            <!-- Botón de submit -->
            <button type="submit">Update Song</button>
        </form>
    </div>

    <script>
        // Actualizar el texto cuando se selecciona un nuevo archivo de música
        document.getElementById('musica').addEventListener('change', function() {
            const selectedFile = this.files[0];
            const displaySpan = document.getElementById('current-music');
            displaySpan.textContent = selectedFile ? selectedFile.name : 'No file selected';
        });

        // Actualizar el texto cuando se selecciona una nueva carátula
        document.getElementById('caratula').addEventListener('change', function() {
            const selectedFile = this.files[0];
            const displaySpan = document.getElementById('current-caratula');
            displaySpan.textContent = selectedFile ? selectedFile.name : 'No file selected';
        });

        // Actualizar el texto cuando se selecciona un nuevo archivo de texto
        document.getElementById('textFile').addEventListener('change', function() {
            const selectedFile = this.files[0];
            const displaySpan = document.getElementById('current-text');
            const descriptionField = document.getElementById('descripcion');
            displaySpan.textContent = selectedFile ? selectedFile.name : 'No file selected';

            if (selectedFile) {
                // Desactivar la descripción si se selecciona un archivo
                descriptionField.disabled = true;
            } else {
                // Rehabilitar la descripción si no se selecciona archivo
                descriptionField.disabled = false;
            }
        });

        // Deshabilitar el campo de archivo si se escribe en la descripción
        document.getElementById('descripcion').addEventListener('input', function() {
            const textFileInput = document.getElementById('textFile');
            if (this.value.trim().length > 0) {
                // Desactivar la selección de archivo de texto si hay texto en la descripción
                textFileInput.disabled = true;
            } else {
                // Rehabilitar la selección de archivo de texto si no hay texto en la descripción
                textFileInput.disabled = false;
            }
        });

    </script>
</body>
</html>
