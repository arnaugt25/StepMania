<?php
// Verificar si la solicitud se ha realizado mediante POST (cuando se envía el formulario)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verificar que los campos obligatorios del formulario (título, artista y descripción) están presentes
    $titulo = $_POST['titulo'] ?? null;
    $artista = $_POST['artista'] ?? null;
    $descripcion = $_POST['descripcion'] ?? null;

    // Verificar si los archivos de música y carátula se han enviado correctamente
    if (isset($_FILES['musica']) && isset($_FILES['caratula'])) {
        // Directorios donde se almacenarán los archivos subidos
        $musica_dir = '../uploads/musica/';
        $caratula_dir = '../uploads/caratula/';
        $text_dir = '../uploads/text/';

        // Verificar si los directorios de subida existen, y crearlos si no existen
        if (!is_dir($musica_dir)) {
            mkdir($musica_dir, 0777, true);  // Crear el directorio para música
        }
        if (!is_dir($caratula_dir)) {
            mkdir($caratula_dir, 0777, true);  // Crear el directorio para carátulas
        }
        if (!is_dir($text_dir)) {
            mkdir($text_dir, 0777, true);  // Crear el directorio para archivos de texto
        }

        // Generar nombres únicos para los archivos de música y carátula para evitar colisiones
        $musica_ext = pathinfo($_FILES['musica']['name'], PATHINFO_EXTENSION);  // Obtener la extensión del archivo de música
        $musica_file = $musica_dir . uniqid('musica_') . '.' . $musica_ext;  // Crear el nombre único del archivo de música
        if (!move_uploaded_file($_FILES['musica']['tmp_name'], $musica_file)) {
            echo "Error al subir el archivo de música.";  // Error si no se puede mover el archivo de música
            exit();
        }

        $caratula_ext = pathinfo($_FILES['caratula']['name'], PATHINFO_EXTENSION);  // Obtener la extensión del archivo de carátula
        $caratula_file = $caratula_dir . uniqid('caratula_') . '.' . $caratula_ext;  // Crear el nombre único del archivo de carátula
        if (!move_uploaded_file($_FILES['caratula']['tmp_name'], $caratula_file)) {
            echo "Error al mover el archivo de carátula.";  // Error si no se puede mover el archivo de carátula
            exit();
        }

        // Verificar si se ha enviado un archivo de texto
        $text_file = null;  // Inicializar la variable del archivo de texto como nulo
        if (isset($_FILES['textFile']) && $_FILES['textFile']['error'] === UPLOAD_ERR_OK) {
            $text_ext = pathinfo($_FILES['textFile']['name'], PATHINFO_EXTENSION);  // Obtener la extensión del archivo de texto
            $text_file = $text_dir . uniqid('text_') . '.' . $text_ext;  // Crear el nombre único del archivo de texto
            if (!move_uploaded_file($_FILES['textFile']['tmp_name'], $text_file)) {
                echo "Error al subir el archivo de texto.";  // Error si no se puede mover el archivo de texto
                exit();
            }
        } 
        // Si no se envió un archivo de texto, guardar la descripción como archivo de texto
        elseif (!empty($descripcion)) {
            $text_file_name = 'descripcion_' . uniqid() . '.txt';  // Crear un nombre único para el archivo de texto de descripción
            $text_file = $text_dir . $text_file_name;
            if (file_put_contents($text_file, $descripcion) === false) {
                echo "Error al guardar la descripción como archivo de texto.";  // Error si no se puede guardar la descripción
                exit();
            }
        }

        // Leer el archivo JSON existente donde se almacenan las canciones
        $json_file = '../json/json.json';
        $canciones = file_exists($json_file) ? json_decode(file_get_contents($json_file), true) : [];

        // Crear la nueva entrada de canción con los datos obtenidos
        $nuevo_id = count($canciones) + 1;  // Generar un nuevo ID para la canción
        $nueva_cancion = [
            'id' => $nuevo_id,  // ID de la canción
            'titulo' => $titulo,  // Título de la canción
            'artista' => $artista,  // Artista
            'descripcion' => $descripcion,  // Descripción
            'archivoMusica' => $musica_file,  // Ruta del archivo de música
            'archivoCaratula' => $caratula_file,  // Ruta del archivo de carátula
            'archivoTexto' => $text_file  // Ruta del archivo de texto (si existe)
        ];

        // Añadir la nueva canción al array de canciones
        $canciones[] = $nueva_cancion;

        // Guardar el archivo JSON actualizado con la nueva canción
        file_put_contents($json_file, json_encode($canciones, JSON_PRETTY_PRINT));

        // Redirigir al usuario a la página de la playlist después de guardar
        header('Location: ../playlist.html');
        exit();
    } else {
        // Mostrar mensaje de error si los archivos no se enviaron correctamente
        echo "No se han enviado los archivos correctamente.";
    }
}
?>
