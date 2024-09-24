<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Verificar que los campos del formulario estén presentes
    $titulo = isset($_POST['titulo']) ? $_POST['titulo'] : null;
    $artista = isset($_POST['artista']) ? $_POST['artista'] : null;

    // Asegurarse de que se hayan enviado los archivos correctamente
    if (isset($_FILES['musica']) && isset($_FILES['caratula'])) {
        
        // Directorios de subida
        $musica_dir = 'uploads/musica/';
        $caratula_dir = 'uploads/caratula/';

        // Verificar y crear los directorios si no existen
        if (!is_dir($musica_dir)) {
            mkdir($musica_dir, 0777, true);
        }
        if (!is_dir($caratula_dir)) {
            mkdir($caratula_dir, 0777, true);
        }

        // Subir el archivo de música
        $musica_file = $musica_dir . basename($_FILES['musica']['name']);
        if (!move_uploaded_file($_FILES['musica']['tmp_name'], $musica_file)) {
            echo "Error al subir el archivo de música.";
            exit();
        }

        // Subir el archivo de carátula
        $caratula_file = $caratula_dir . basename($_FILES['caratula']['name']);
        if (!move_uploaded_file($_FILES['caratula']['tmp_name'], $caratula_file)) {
            echo "Error al subir el archivo de carátula.";
            exit();
        }

        // Leer el archivo JSON existente
        $json_file = 'json.json';
        $canciones = file_exists($json_file) ? json_decode(file_get_contents($json_file), true) : array();

        // Crear la nueva entrada de canción
        $nueva_cancion = array(
            'titulo' => $titulo,
            'artista' => $artista,
            'archivoMusica' => $musica_file,
            'archivoCaratula' => $caratula_file
        );

        // Añadir la nueva canción al array de canciones
        array_push($canciones, $nueva_cancion);

        // Guardar el archivo JSON actualizado
        file_put_contents($json_file, json_encode($canciones, JSON_PRETTY_PRINT));

        // Redirigir a la página play.html para ver la nueva canción
        header('Location: ../play.html');
        exit();
    } else {
        echo "No se han enviado los archivos correctamente.";
    }
}
?>
