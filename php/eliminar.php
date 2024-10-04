<?php
if (isset($_GET['index'])) {
    $index = $_GET['index'];

    // Leer el archivo JSON
    $json_file = '../json/json.json';
    $canciones = file_exists($json_file) ? json_decode(file_get_contents($json_file), true) : array();

    // Verificar que la canción exista
    if (isset($canciones[$index])) {
        // Obtener los archivos asociados
        $archivoMusica = $canciones[$index]['archivoMusica'];
        $archivoCaratula = $canciones[$index]['archivoCaratula'];
        $archivoTexto = isset($canciones[$index]['archivoTexto']) ? $canciones[$index]['archivoTexto'] : null;

        // Eliminar los archivos del servidor
        if (file_exists($archivoMusica)) {
            unlink($archivoMusica);  // Eliminar archivo de música
        }
        if (file_exists($archivoCaratula)) {
            unlink($archivoCaratula);  // Eliminar archivo de carátula
        }
        if ($archivoTexto && file_exists($archivoTexto)) {
            unlink($archivoTexto);  // Eliminar archivo de texto si existe
        }

        // Eliminar la canción del array
        array_splice($canciones, $index, 1);

        // Guardar el archivo JSON actualizado
        file_put_contents($json_file, json_encode($canciones, JSON_PRETTY_PRINT));

        echo "Canción eliminada correctamente.";
    } else {
        echo "La canción no existe.";
    }
} else {
    echo "No se especificó el índice de la canción.";
}
?>
