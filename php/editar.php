<?php
// Verificar si la solicitud es de tipo POST (cuando se envía el formulario)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Definir la ruta al archivo JSON donde se guardan las canciones
    $json_file = '../json/json.json';
    // Cargar el archivo JSON existente, si no existe, se inicializa como un array vacío
    $canciones = file_exists($json_file) ? json_decode(file_get_contents($json_file), true) : array();

    // Obtener el ID de la canción que se va a editar desde el formulario
    $songId = isset($_POST['songId']) ? $_POST['songId'] : null;

    // Verificar que la canción con el ID especificado existe
    if ($songId !== null && isset($canciones[$songId])) {

        // Actualizar los datos de la canción con los valores recibidos del formulario
        $canciones[$songId]['titulo'] = $_POST['titulo'];
        $canciones[$songId]['artista'] = $_POST['artista'];
        $canciones[$songId]['descripcion'] = $_POST['descripcion'] ?? '';

        // Subir un nuevo archivo de música solo si se ha seleccionado
        if (isset($_FILES['musica']) && $_FILES['musica']['error'] === UPLOAD_ERR_OK) {
            $musica_dir = '../uploads/musica/';
            // Crear el directorio de música si no existe
            if (!is_dir($musica_dir)) {
                mkdir($musica_dir, 0777, true);
            }

            // Crear un nombre único para el archivo de música subido
            $musica_file_name = uniqid('musica_', true) . '.' . pathinfo($_FILES['musica']['name'], PATHINFO_EXTENSION);
            $musica_file = $musica_dir . $musica_file_name;

            // Mover el archivo subido a la carpeta de música
            if (!move_uploaded_file($_FILES['musica']['tmp_name'], $musica_file)) {
                echo "Error al mover el archivo de música.";
                exit();
            }

            // Eliminar el archivo de música anterior si existía
            if (isset($canciones[$songId]['archivoMusica']) && file_exists($canciones[$songId]['archivoMusica'])) {
                unlink($canciones[$songId]['archivoMusica']);
            }

            // Actualizar la ruta del archivo de música en el JSON
            $canciones[$songId]['archivoMusica'] = $musica_file;
        }

        // Subir un nuevo archivo de carátula solo si se ha seleccionado
        if (isset($_FILES['caratula']) && $_FILES['caratula']['error'] === UPLOAD_ERR_OK) {
            $caratula_dir = '../uploads/caratula/';
            // Crear el directorio de carátulas si no existe
            if (!is_dir($caratula_dir)) {
                mkdir($caratula_dir, 0777, true);
            }

            // Crear un nombre único para el archivo de carátula subido
            $caratula_file_name = uniqid('caratula_', true) . '.' . pathinfo($_FILES['caratula']['name'], PATHINFO_EXTENSION);
            $caratula_file = $caratula_dir . $caratula_file_name;

            // Mover el archivo subido a la carpeta de carátulas
            if (!move_uploaded_file($_FILES['caratula']['tmp_name'], $caratula_file)) {
                echo "Error al mover el archivo de carátula.";
                exit();
            }

            // Eliminar el archivo de carátula anterior si existía
            if (isset($canciones[$songId]['archivoCaratula']) && file_exists($canciones[$songId]['archivoCaratula'])) {
                unlink($canciones[$songId]['archivoCaratula']);
            }

            // Actualizar la ruta del archivo de carátula en el JSON
            $canciones[$songId]['archivoCaratula'] = $caratula_file;
        }

        // Subir un nuevo archivo de texto solo si se ha seleccionado
        if (isset($_FILES['textFile']) && $_FILES['textFile']['error'] === UPLOAD_ERR_OK) {
            $text_dir = '../uploads/text/';
            // Crear el directorio de textos si no existe
            if (!is_dir($text_dir)) {
                mkdir($text_dir, 0777, true);
            }

            // Crear un nombre único para el archivo de texto subido
            $text_file_name = uniqid('texto_', true) . '.' . pathinfo($_FILES['textFile']['name'], PATHINFO_EXTENSION);
            $text_file = $text_dir . $text_file_name;

            // Mover el archivo subido a la carpeta de textos
            if (!move_uploaded_file($_FILES['textFile']['tmp_name'], $text_file)) {
                echo "Error al mover el archivo de texto.";
                exit();
            }

            // Eliminar el archivo de texto anterior si existía
            if (isset($canciones[$songId]['archivoTexto']) && file_exists($canciones[$songId]['archivoTexto'])) {
                unlink($canciones[$songId]['archivoTexto']);
            }

            // Actualizar la ruta del archivo de texto en el JSON
            $canciones[$songId]['archivoTexto'] = $text_file;
        }

        // Guardar el archivo JSON actualizado con los cambios
        file_put_contents($json_file, json_encode($canciones, JSON_PRETTY_PRINT));

        // Redirigir a la página de reproducción de la playlist
        header('Location: ../playlist.html');
        exit();
        
    } else {
        echo "Error: La canción no existe.";
    }
}

// Al cargar la página para editar una canción, verificar si se ha proporcionado un ID
if (isset($_GET['id'])) {
    $json_file = '../json/json.json';
    // Leer las canciones del archivo JSON
    $canciones = file_exists($json_file) ? json_decode(file_get_contents($json_file), true) : array();
    $songId = $_GET['id'];

    // Verificar que la canción con el ID especificado existe
    if (isset($canciones[$songId])) {
        $cancion = $canciones[$songId]; // Obtener los datos de la canción
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
    <!-- Meta para definir la codificación y viewport -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Songs</title>
    <!-- Enlace al archivo CSS principal -->
    <link rel="stylesheet" href="../css/styles.css">
</head>
<body class="bodyafegir">
    <nav class="nav2">
        <!-- Navegación vacía por ahora -->
    </nav>

    <!-- Contenedor principal del formulario de edición -->
    <div class="form-container">
        <!-- Contenedor para el logo y el título -->
        <div class="logo-title-container">
            <!-- Enlace a la página principal -->
            <a href="index.html"><img src="../css/img/logo1.png" alt="Logo de StepMania" class="logo1"></a>
            <a href="index.html"><h1>Edit Song</h1></a>
        </div> 

        <!-- Formulario para editar la canción -->
        <form id="editSongForm" action="editar.php" method="post" enctype="multipart/form-data">
            <!-- Campo oculto para enviar el ID de la canción -->
            <input type="hidden" id="songId" name="songId" value="<?php echo $songId; ?>">

            <!-- Campo para editar el título de la canción -->
            <label for="titulo">Song Title:</label>
            <input type="text" id="titulo" name="titulo" value="<?php echo $cancion['titulo']; ?>" required>

            <!-- Campo para editar el artista de la canción -->
            <label for="artista">Artist:</label>
            <input type="text" id="artista" name="artista" value="<?php echo $cancion['artista']; ?>" required>

            <div class="file-input-container">
                <!-- Campo para seleccionar un nuevo archivo de música -->
                <div class="file-upload">
                    <label for="musica" class="custom-file-label">Select music  <i class="fa-solid fa-music"></i></label>
                    <input type="file" id="musica" name="musica" accept="audio/*" class="file-input">
                    <span id="current-music" class="file-selected">
                        <?php echo basename($cancion['archivoMusica']); ?>
                    </span>
                </div>
            
                <!-- Campo para seleccionar una nueva carátula -->
                <div class="file-upload">
                    <label for="caratula" class="custom-file-label">Select picture <i class="fa-solid fa-image"></i></label>
                    <input type="file" id="caratula" name="caratula" accept="image/*" class="file-input">
                    <span id="current-caratula" class="file-selected">
                        <?php echo basename($cancion['archivoCaratula']); ?>
                    </span>
                </div>
            
                <!-- Campo para seleccionar un nuevo archivo de texto -->
                <div class="file-upload">
                    <label for="textFile" class="custom-file-label">Select text <i class="fa-solid fa-file-lines"></i></label>
                    <input type="file" id="textFile" name="textFile" accept="text/plain" class="file-input">
                    <span id="current-text" class="file-selected">
                        <?php echo isset($cancion['archivoTexto']) && !empty($cancion['archivoTexto']) ? basename($cancion['archivoTexto']) : 'No file'; ?>
                    </span>
                </div>
            </div>

            <!-- Campo para editar la descripción de la canción -->
            <label for="descripcion" class="descripcion">Description</label>
            <textarea id="descripcion" name="descripcion"><?php echo $cancion['descripcion']; ?></textarea>

            <!-- Botón para actualizar la canción -->
            <button type="submit">Update Song</button>
        </form>
    </div>
    
    <script src="../js/editar.js"></script>
</body>
</html>
