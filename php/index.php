<?php
// Habilitar la visualización de errores
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener los datos enviados desde el formulario
    $titulo = $_POST['titulo'];
    $artista = $_POST['artista'];

    // Crear el directorio para subir archivos si no existe
    $targetDir = "uploads/";
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0755, true); // Crear el directorio con permisos de escritura
    }

    // Procesar los archivos subidos
    $archivoMusica = $targetDir . basename($_FILES["musica"]["name"]);
    $archivoCaratula = $targetDir . basename($_FILES["caratula"]["name"]);

    // Verificar si se subió correctamente el archivo de música
    if ($_FILES["musica"]["error"] !== UPLOAD_ERR_OK) {
        echo "Error al subir el archivo de música: " . $_FILES["musica"]["error"];
        exit();
    }

    // Verificar si se subió correctamente el archivo de carátula
    if ($_FILES["caratula"]["error"] !== UPLOAD_ERR_OK) {
        echo "Error al subir el archivo de carátula: " . $_FILES["caratula"]["error"];
        exit();
    }

    // Mover los archivos subidos al directorio 'uploads'
    if (move_uploaded_file($_FILES["musica"]["tmp_name"], $archivoMusica) &&
        move_uploaded_file($_FILES["caratula"]["tmp_name"], $archivoCaratula)) {
        
        // Leer el archivo JSON de canciones
        $jsonFile = 'json.json'; // Asegúrate de que json.json esté en el mismo directorio
        if (!file_exists($jsonFile)) {
            file_put_contents($jsonFile, '[]'); // Si no existe, crear un archivo JSON vacío
        }

        $jsonData = file_get_contents($jsonFile);
        $canciones = json_decode($jsonData, true);

        // Añadir la nueva canción al array
        $nuevaCancion = array(
            "titulo" => $titulo,
            "artista" => $artista,
            "archivoMusica" => $archivoMusica,
            "archivoCaratula" => $archivoCaratula
        );
        array_push($canciones, $nuevaCancion);

        // Guardar el nuevo contenido en el archivo JSON
        file_put_contents($jsonFile, json_encode($canciones, JSON_PRETTY_PRINT));

        // Redirigir a la página de Play
        header("Location: play.html"); // Redirección simplificada
        exit();
    } else {
        echo "Error al mover los archivos.";
    }
} else {
    echo "Método no permitido.";
}
