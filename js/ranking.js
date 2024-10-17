// Función asincrónica para cargar el ranking desde el archivo JSON
async function loadRanking() {
    try {
        // Deshabilitar el almacenamiento en caché para obtener siempre la versión más reciente del archivo JSON
        const response = await fetch('json/ranking.json', { cache: 'no-store' });

        // Verificar si la respuesta de la solicitud fue exitosa
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON');  // Lanzar error si la respuesta no es correcta
        }

        // Convertir la respuesta en un objeto JSON
        const ranking = await response.json();
        const rankingBody = document.getElementById('rankingBody');  // Obtener el cuerpo de la tabla de ranking
        
        // Verificar si el elemento rankingBody existe en el DOM
        if (!rankingBody) {
            console.error('rankingBody no está definido en el DOM');  // Mostrar error en consola si el elemento no existe
            return;
        }
        
        // Ordenar el ranking por puntuación, de mayor a menor
        ranking.sort((a, b) => b.score - a.score);

        // Obtener los parámetros 'userName' y 'score' desde la URL
        const urlParams = new URLSearchParams(window.location.search);
        const currentPlayer = urlParams.get('userName');  // Nombre del jugador actual
        const currentScore = parseInt(urlParams.get('score'));  // Puntuación del jugador actual

        // Recorrer cada jugador en el ranking y crear una fila en la tabla para cada uno
        ranking.forEach((player, index) => {
            const row = document.createElement('tr');  // Crear una nueva fila para la tabla
            
            // Si es el primer lugar, mostrar el icono de trofeo dorado
            let rankingText;
            if (index === 0) {
                rankingText = `<i class="fa-solid fa-trophy" style="color: gold;"></i>`;  // Trofeo para el primer lugar
            } else {
                rankingText = index + 1;  // Mostrar el número de posición para los demás jugadores
            }

            // Rellenar la fila con el ranking, el nombre y la puntuación del jugador
            row.innerHTML = `
                <td>${rankingText}</td>
                <td>${player.name}</td>
                <td>${player.score}</td>
            `;

            // Si el jugador actual es el mismo que el usuario en la URL, resaltar la fila
            if (player.name === currentPlayer && player.score === currentScore) {
                row.style.backgroundColor = 'yellow';  // Cambiar el color de fondo a amarillo
                row.style.fontWeight = 'bold';  // Hacer el texto más grueso
            }

            // Añadir la fila a la tabla de ranking
            rankingBody.appendChild(row);
        });

        // Si no hay jugadores en el ranking, mostrar un mensaje
        if (ranking.length === 0) {
            const noPlayersRow = document.createElement('tr');  // Crear una fila vacía
            noPlayersRow.innerHTML = `<td colspan="3">No hay jugadores en el ranking</td>`;  // Mensaje para la fila vacía
            rankingBody.appendChild(noPlayersRow);  // Añadir la fila vacía a la tabla
        }

    } catch (error) {
        // Mostrar en consola si ocurre algún error durante la carga del ranking
        console.error('Error al cargar el ranking:', error);
    }
}

// Ejecutar la función loadRanking cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', loadRanking);
