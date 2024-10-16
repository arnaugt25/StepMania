<?php
$rankingFile = '../json/ranking.json';

// Leer los datos enviados desde la solicitud
$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'] ?? '';
$score = $data['score'] ?? '';

// Verificar si los datos se recibieron correctamente
if (empty($name) || empty($score)) {
    echo json_encode(['status' => 'error', 'message' => 'Datos incompletos']);
    exit;
}

// Verificar si el archivo de ranking existe y si es escribible
if (!file_exists($rankingFile)) {
    echo json_encode(['status' => 'error', 'message' => 'El archivo ranking.json no existe']);
    exit;
} elseif (!is_writable($rankingFile)) {
    echo json_encode(['status' => 'error', 'message' => 'El archivo ranking.json no tiene permisos de escritura']);
    exit;
}

// Leer el contenido actual del archivo ranking.json
$ranking = file_exists($rankingFile) ? json_decode(file_get_contents($rankingFile), true) : [];

// Verificar si el archivo JSON es válido
if ($ranking === null) {
    echo json_encode(['status' => 'error', 'message' => 'Error al leer el archivo ranking.json']);
    exit;
}

// Agregar el nuevo jugador al ranking
$ranking[] = ['name' => $name, 'score' => $score];

// Ordenar el ranking por puntuación (de mayor a menor)
usort($ranking, function($a, $b) {
    return $b['score'] - $a['score'];
});

// Guardar el ranking actualizado en el archivo
if (file_put_contents($rankingFile, json_encode($ranking, JSON_PRETTY_PRINT)) === false) {
    echo json_encode(['status' => 'error', 'message' => 'Error al guardar']);
    exit;
}

// Enviar respuesta de éxito
echo json_encode(['status' => 'success']);
?>
        