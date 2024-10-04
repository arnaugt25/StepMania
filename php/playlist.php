<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verificar que los campos del formulario estén presentes
    $titulo = $_POST['titulo'] ?? null;
    $artista = $_POST['artista'] ?? null;
    $descripcion = $_POST['descripcion'] ?? null;

    if (isset($_FILES['musica']) && isset($_FILES['caratula'])) {
        // Directorios de subida
        $musica_dir = '../uploads/musica/';
        $caratula_dir = '../uploads/caratula/';
        $text_dir = '../uploads/text/';

        // Verificar y crear los directorios si no existen
        if (!is_dir($musica_dir)) {
            mkdir($musica_dir, 0777, true);
        }
        if (!is_dir($caratula_dir)) {
            mkdir($caratula_dir, 0777, true);
        }
        if (!is_dir($text_dir)) {
            mkdir($text_dir, 0777, true);
        }

        // Generar un nombre único para la música y la carátula
        $musica_ext = pathinfo($_FILES['musica']['name'], PATHINFO_EXTENSION);
        $musica_file = $musica_dir . uniqid('musica_') . '.' . $musica_ext;
        if (!move_uploaded_file($_FILES['musica']['tmp_name'], $musica_file)) {
            echo "Error al subir el archivo de música.";
            exit();
        }

        $caratula_ext = pathinfo($_FILES['caratula']['name'], PATHINFO_EXTENSION);
        $caratula_file = $caratula_dir . uniqid('caratula_') . '.' . $caratula_ext;
        if (!move_uploaded_file($_FILES['caratula']['tmp_name'], $caratula_file)) {
            echo "Error al mover el archivo de carátula.";
            exit();
        }

        // Subir el archivo de texto si fue enviado
        $text_file = null;
        if (isset($_FILES['textFile']) && $_FILES['textFile']['error'] === UPLOAD_ERR_OK) {
            $text_ext = pathinfo($_FILES['textFile']['name'], PATHINFO_EXTENSION);
            $text_file = $text_dir . uniqid('text_') . '.' . $text_ext;
            if (!move_uploaded_file($_FILES['textFile']['tmp_name'], $text_file)) {
                echo "Error al subir el archivo de texto.";
                exit();
            }
        } elseif (!empty($descripcion)) {
            $text_file_name = 'descripcion_' . uniqid() . '.txt';
            $text_file = $text_dir . $text_file_name;
            if (file_put_contents($text_file, $descripcion) === false) {
                echo "Error al guardar la descripción como archivo de texto.";
                exit();
            }
        }

        // Leer el archivo JSON existente
        $json_file = '../json/json.json';
        $canciones = file_exists($json_file) ? json_decode(file_get_contents($json_file), true) : [];

        // Crear la nueva entrada de canción
        $nuevo_id = count($canciones) + 1;
        $nueva_cancion = [
            'id' => $nuevo_id,
            'titulo' => $titulo,
            'artista' => $artista,
            'descripcion' => $descripcion,
            'archivoMusica' => $musica_file,
            'archivoCaratula' => $caratula_file,
            'archivoTexto' => $text_file
        ];

        // Añadir la nueva canción al array de canciones
        $canciones[] = $nueva_cancion;

        // Guardar el archivo JSON actualizado
        file_put_contents($json_file, json_encode($canciones, JSON_PRETTY_PRINT));

        // Redirigir a la página de éxito o de listado
        header('Location: ../playlist.html');
        exit();
    } else {
        echo "No se han enviado los archivos correctamente.";
    }
}
?>
