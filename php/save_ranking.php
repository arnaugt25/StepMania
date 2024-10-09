<?php
// Ruta al archivo ranking.json
$rankingFile = '../json/ranking.json';

// Leer los datos enviados desde la solicitud
$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'];
$score = $data['score'];

// Leer el contenido actual del archivo ranking.json
$ranking = file_exists($rankingFile) ? json_decode(file_get_contents($rankingFile), true) : [];

// Agregar el nuevo jugador al ranking
$ranking[] = ['name' => $name, 'score' => $score];

// Ordenar el ranking por puntuación (de mayor a menor)
usort($ranking, function ($a, $b) {
    return $b['score'] - $a['score'];
});

// Guardar el ranking actualizado en el archivo
file_put_contents($rankingFile, json_encode($ranking, JSON_PRETTY_PRINT));

// Obtener la posición del jugador actual en el ranking
$position = array_search(['name' => $name, 'score' => $score], $ranking) + 1;

// Enviar la posición al frontend
echo json_encode(['position' => $position]);
?>
