<?php
// Ruta al archivo JSON donde se guarda el ranking de los jugadores
$rankingFile = '../json/ranking.json';

// Leer los datos enviados desde la solicitud POST en formato JSON
$data = json_decode(file_get_contents('php://input'), true);
// Obtener el nombre del jugador y su puntuación de los datos enviados
$name = $data['name'] ?? '';  // Si no se envía el nombre, se asigna una cadena vacía
$score = $data['score'] ?? '';  // Si no se envía la puntuación, se asigna una cadena vacía

// Verificar si se recibieron los datos requeridos (nombre y puntuación)
if (empty($name) || empty($score)) {
    // Enviar una respuesta de error si los datos están incompletos
    echo json_encode(['status' => 'error', 'message' => 'Datos incompletos']);
    exit;  // Finalizar el script
}

// Verificar si el archivo de ranking existe y si tiene permisos de escritura
if (!file_exists($rankingFile)) {
    // Enviar una respuesta de error si el archivo no existe
    echo json_encode(['status' => 'error', 'message' => 'El archivo ranking.json no existe']);
    exit;
} elseif (!is_writable($rankingFile)) {
    // Enviar una respuesta de error si el archivo no tiene permisos de escritura
    echo json_encode(['status' => 'error', 'message' => 'El archivo ranking.json no tiene permisos de escritura']);
    exit;
}

// Leer el contenido actual del archivo ranking.json, si existe, y convertirlo en un array
$ranking = file_exists($rankingFile) ? json_decode(file_get_contents($rankingFile), true) : [];

// Verificar si el archivo JSON se leyó correctamente
if ($ranking === null) {
    // Enviar una respuesta de error si hubo problemas al leer el archivo JSON
    echo json_encode(['status' => 'error', 'message' => 'Error al leer el archivo ranking.json']);
    exit;
}

// Agregar el nuevo jugador y su puntuación al ranking
$ranking[] = ['name' => $name, 'score' => $score];

// Ordenar el ranking por la puntuación, de mayor a menor
usort($ranking, function($a, $b) {
    return $b['score'] - $a['score'];  // Comparar las puntuaciones para ordenar
});

// Guardar el ranking actualizado en el archivo ranking.json
if (file_put_contents($rankingFile, json_encode($ranking, JSON_PRETTY_PRINT)) === false) {
    // Enviar una respuesta de error si hubo problemas al guardar el archivo JSON
    echo json_encode(['status' => 'error', 'message' => 'Error al guardar']);
    exit;
}

// Enviar una respuesta de éxito si todo se realizó correctamente
echo json_encode(['status' => 'success']);
?>
