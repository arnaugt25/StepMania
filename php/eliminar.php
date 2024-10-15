<?php
if (isset($_GET['index'])) {
    $index = $_GET['index'];

    // Ruta al archivo JSON
    $json_file = '../json/json.json';
    
    // Verificar que el archivo JSON existe
    if (!file_exists($json_file)) {
        echo "El archivo JSON no existe.";
        exit;
    }

    // Leer el archivo JSON
    $canciones = json_decode(file_get_contents($json_file), true);

    // Verificar que la canción en el índice existe
    if (isset($canciones[$index])) {
        // Obtener los archivos asociados
        $archivoMusica = $canciones[$index]['archivoMusica'];
        $archivoCaratula = $canciones[$index]['archivoCaratula'];
        $archivoTexto = isset($canciones[$index]['archivoTexto']) ? $canciones[$index]['archivoTexto'] : null;

        // Función para eliminar un archivo y verificar si se elimina correctamente
        function eliminarArchivo($archivo) {
            if (file_exists($archivo)) {
                if (unlink($archivo)) {
                    echo "Archivo eliminado: $archivo\n";
                } else {
                    echo "No se pudo eliminar el archivo: $archivo\n";
                }
            } else {
                echo "El archivo no existe: $archivo\n";
            }
        }

        // Eliminar los archivos del servidor
        eliminarArchivo($archivoMusica);
        eliminarArchivo($archivoCaratula);
        if ($archivoTexto) {
            eliminarArchivo($archivoTexto);
        }

        // Eliminar la canción del array
        array_splice($canciones, $index, 1);

        // Guardar el archivo JSON actualizado
        if (file_put_contents($json_file, json_encode($canciones, JSON_PRETTY_PRINT))) {
            echo "Canción eliminada correctamente.";
        } else {
            echo "Error al actualizar el archivo JSON.";
        }

    } else {
        echo "La canción no existe.";
    }
} else {
    echo "No se especificó el índice de la canción.";
}
?>
