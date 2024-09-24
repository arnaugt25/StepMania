<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $titulo = $_POST['titulo'];
    $artista = $_POST['artista'];

    // Directorios de subida
    $musica_dir = 'uploads/musica/';
    $caratula_dir = 'uploads/caratula/';

    // Subir archivo de música
    $musica_file = $musica_dir . basename($_FILES['musica']['name']);
    move_uploaded_file($_FILES['musica']['tmp_name'], $musica_file);

    // Subir archivo de carátula
    $caratula_file = $caratula_dir . basename($_FILES['caratula']['name']);
    move_uploaded_file($_FILES['caratula']['tmp_name'], $caratula_file);

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

    // Redirigir a la página play.html
    header('Location: play.html');
    exit();
}
?>
