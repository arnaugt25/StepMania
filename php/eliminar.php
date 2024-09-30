<?php
if (isset($_GET['index'])) {
    $index = intval($_GET['index']);

    // Ruta del archivo JSON
    $jsonFile = 'json.json';

    // Leer el archivo JSON
    $jsonData = file_get_contents($jsonFile);
    $data = json_decode($jsonData, true);

    // Verificar si el índice es válido
    if ($index >= 0 && $index < count($data)) {
        // Eliminar la entrada en el índice
        array_splice($data, $index, 1);

        // Guardar los cambios en el archivo JSON
        file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT));

        echo "Canción eliminada exitosamente.";
    } else {
        echo "Índice inválido.";
    }
} else {
    echo "Índice no proporcionado.";
}
?>
