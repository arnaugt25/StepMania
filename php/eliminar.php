<?php
// Verificar si se ha proporcionado el índice de la canción a eliminar mediante el parámetro GET
if (isset($_GET['index'])) {
    $index = $_GET['index'];  // Obtener el índice de la canción

    // Ruta al archivo JSON donde están almacenadas las canciones
    $json_file = '../json/json.json';
    
    // Verificar que el archivo JSON existe
    if (!file_exists($json_file)) {
        echo "El archivo JSON no existe.";  // Mensaje de error si el archivo no existe
        exit;  // Finalizar el script
    }

    // Leer el contenido del archivo JSON y convertirlo en un array asociativo
    $canciones = json_decode(file_get_contents($json_file), true);

    // Verificar que la canción con el índice proporcionado existe
    if (isset($canciones[$index])) {
        // Obtener las rutas de los archivos asociados a la canción (música, carátula, texto)
        $archivoMusica = $canciones[$index]['archivoMusica'];
        $archivoCaratula = $canciones[$index]['archivoCaratula'];
        $archivoTexto = isset($canciones[$index]['archivoTexto']) ? $canciones[$index]['archivoTexto'] : null;

        // Función para eliminar un archivo del servidor y mostrar un mensaje dependiendo del éxito
        function eliminarArchivo($archivo) {
            if (file_exists($archivo)) {
                // Si el archivo existe, intentar eliminarlo
                if (unlink($archivo)) {
                    echo "Archivo eliminado: $archivo\n";  // Mensaje de éxito
                } else {
                    echo "No se pudo eliminar el archivo: $archivo\n";  // Mensaje de error si no se puede eliminar
                }
            } else {
                echo "El archivo no existe: $archivo\n";  // Mensaje si el archivo no existe
            }
        }

        // Eliminar los archivos asociados a la canción del servidor
        eliminarArchivo($archivoMusica);  // Eliminar el archivo de música
        eliminarArchivo($archivoCaratula);  // Eliminar el archivo de carátula
        if ($archivoTexto) {
            eliminarArchivo($archivoTexto);  // Si existe, eliminar el archivo de texto
        }

        // Eliminar la canción del array utilizando array_splice
        array_splice($canciones, $index, 1);

        // Guardar el array actualizado en el archivo JSON
        if (file_put_contents($json_file, json_encode($canciones, JSON_PRETTY_PRINT))) {
            echo "Canción eliminada correctamente.";  // Mensaje de éxito al guardar el archivo
        } else {
            echo "Error al actualizar el archivo JSON.";  // Mensaje de error si no se pudo guardar
        }

    } else {
        // Mensaje si la canción no existe en el índice especificado
        echo "La canción no existe.";
    }
} else {
    // Mensaje si no se proporcionó el índice de la canción
    echo "No se especificó el índice de la canción.";
}
?> 
