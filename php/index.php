<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $titulo = $_POST['titulo'];
    $artista = $_POST['artista'];

    // Crear el directorio de subida si no existe
    $targetDir = "uploads/";
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0755, true);
    }

    // Subir el archivo de música
    $archivoMusica = $targetDir . basename($_FILES["musica"]["name"]);
    $archivoCaratula = $targetDir . basename($_FILES["caratula"]["name"]);

    if (move_uploaded_file($_FILES["musica"]["tmp_name"], $archivoMusica) && move_uploaded_file($_FILES["caratula"]["tmp_name"], $archivoCaratula)) {
        
        // Leer o crear el archivo JSON de canciones
        $jsonFile = 'canciones.json';
        if (!file_exists($jsonFile)) {
            file_put_contents($jsonFile, '[]');
        }

        $jsonData = file_get_contents($jsonFile);
        $canciones = json_decode($jsonData, true);

        // Añadir la nueva canción al archivo JSON
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
        header("Location: play.html");
        exit();
    } else {
        echo "Error al subir los archivos.";
    }
} else {
    echo "Método no permitido.";
}
?>
