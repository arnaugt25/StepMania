  // Función para cargar el ranking desde ranking.json y mostrar solo los 3 primeros
  function loadTopRanking() {
    const leaderboardBody = document.getElementById('leaderboardBody');

    // Cargar el ranking desde ranking.json
    fetch('json/ranking.json')
        .then(response => response.json())
        .then(data => {
            // Ordenar los jugadores por puntuación
            const sortedRanking = data.sort((a, b) => b.score - a.score);

            // Mostrar solo los primeros tres jugadores
            const topRanking = sortedRanking.slice(0, 3);

            topRanking.forEach((player, index) => {
                const row = document.createElement('tr');

                // Si es el top 1, mostrar solo el ícono de trofeo en la columna de ranking
                let rankingText;
                if (index === 0) {
                    rankingText = `<i class="fa-solid fa-trophy" style="color: gold;"></i>`; // Solo el trofeo dorado
                } else {
                    rankingText = index + 1; // Mostrar el número de ranking para otros jugadores
                }

                row.innerHTML = `
                    <td>${rankingText}</td>
                    <td>${player.name}</td>
                    <td>${player.score}</td>
                `;
                leaderboardBody.appendChild(row);
            });

            // Si el ranking está vacío, mostrar un mensaje
            if (topRanking.length === 0) {
                const emptyRow = document.createElement('tr');
                emptyRow.innerHTML = `
                    <td colspan="3">No hay jugadores en el ranking</td>
                `;
                leaderboardBody.appendChild(emptyRow);
            }
        })
        .catch(error => console.error('Error al cargar el ranking:', error));
}

// Llamar a la función cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', loadTopRanking);  // Función para cargar el ranking desde ranking.json y mostrar solo los 3 primeros
function loadTopRanking() {
    const leaderboardBody = document.getElementById('leaderboardBody');

    // Cargar el ranking desde ranking.json
    fetch('json/ranking.json')
        .then(response => response.json())
        .then(data => {
            // Ordenar los jugadores por puntuación
            const sortedRanking = data.sort((a, b) => b.score - a.score);

            // Mostrar solo los primeros tres jugadores
            const topRanking = sortedRanking.slice(0, 3);

            topRanking.forEach((player, index) => {
                const row = document.createElement('tr');

                // Si es el top 1, mostrar solo el ícono de trofeo en la columna de ranking
                let rankingText;
                if (index === 0) {
                    rankingText = `<i class="fa-solid fa-trophy" style="color: gold;"></i>`; // Solo el trofeo dorado
                } else {
                    rankingText = index + 1; // Mostrar el número de ranking para otros jugadores
                }

                row.innerHTML = `
                    <td>${rankingText}</td>
                    <td>${player.name}</td>
                    <td>${player.score}</td>
                `;
                leaderboardBody.appendChild(row);
            });

            // Si el ranking está vacío, mostrar un mensaje
            if (topRanking.length === 0) {
                const emptyRow = document.createElement('tr');
                emptyRow.innerHTML = `
                    <td colspan="3">No hay jugadores en el ranking</td>
                `;
                leaderboardBody.appendChild(emptyRow);
            }
        })
        .catch(error => console.error('Error al cargar el ranking:', error));
}

// Llamar a la función cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', loadTopRanking);