// Función para cargar el ranking desde ranking.json y mostrar solo los 3 primeros jugadores
function loadTopRanking() {
    const leaderboardBody = document.getElementById('leaderboardBody');  // Seleccionar el cuerpo de la tabla de ranking

    // Cargar el ranking desde el archivo ranking.json con la caché deshabilitada para obtener siempre la versión más reciente
    fetch('json/ranking.json', { cache: 'no-store' })  // Evitar el almacenamiento en caché
        .then(response => response.json())  // Parsear el archivo JSON
        .then(data => {
            // Ordenar los jugadores por puntuación en orden descendente (de mayor a menor)
            const sortedRanking = data.sort((a, b) => b.score - a.score);

            // Seleccionar solo los tres primeros jugadores del ranking
            const topRanking = sortedRanking.slice(0, 3);

            // Recorrer los tres primeros jugadores y crear una fila para cada uno
            topRanking.forEach((player, index) => {
                const row = document.createElement('tr');  // Crear una nueva fila para la tabla

                // Asignar un texto diferente para el primer lugar (mostrar el trofeo dorado) y los demás lugares (mostrar el número)
                let rankingText;
                if (index === 0) {
                    // Mostrar solo el icono de trofeo dorado para el primer lugar
                    rankingText = `<i class="fa-solid fa-trophy" style="color: gold;"></i>`;
                } else {
                    // Mostrar el número de ranking (2, 3, etc.) para los demás jugadores
                    rankingText = index + 1;
                }

                // Crear la fila con las columnas de ranking, nombre y puntuación del jugador
                row.innerHTML = `
                    <td>${rankingText}</td>
                    <td>${player.name}</td>
                    <td>${player.score}</td>
                `;
                leaderboardBody.appendChild(row);  // Añadir la fila a la tabla
            });

            // Si no hay jugadores en el ranking, mostrar un mensaje de "No hay jugadores en el ranking"
            if (topRanking.length === 0) {
                const emptyRow = document.createElement('tr');  // Crear una fila vacía
                emptyRow.innerHTML = `<td colspan="3">No Players in the ranking</td>`  ;// Colocar el mensaje en toda la fila   
                leaderboardBody.appendChild(emptyRow);  // Añadir la fila a la tabla
            }
        })
        .catch(error => console.error('Error al cargar el ranking:', error));  // Mostrar errores en la consola si los hay
}

// Llamar a la función para cargar el ranking cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', loadTopRanking);
