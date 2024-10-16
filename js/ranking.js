async function loadRanking() {
    try {
        // Deshabilitar el almacenamiento en caché con { cache: 'no-store' }
        const response = await fetch('json/ranking.json', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON');
        }

        const ranking = await response.json();
        const rankingBody = document.getElementById('rankingBody');
        
        // Asegúrate de que rankingBody está definido
        if (!rankingBody) {
            console.error('rankingBody no está definido en el DOM');
            return;
        }
        
        ranking.sort((a, b) => b.score - a.score);

        const urlParams = new URLSearchParams(window.location.search);
        const currentPlayer = urlParams.get('userName');
        const currentScore = parseInt(urlParams.get('score'));

        ranking.forEach((player, index) => {
            const row = document.createElement('tr');
            
            let rankingText;
            if (index === 0) {
                rankingText = `<i class="fa-solid fa-trophy" style="color: gold;"></i>`;
            } else {
                rankingText = index + 1;
            }

            row.innerHTML = `
                <td>${rankingText}</td>
                <td>${player.name}</td>
                <td>${player.score}</td>
            `;

            if (player.name === currentPlayer && player.score === currentScore) {
                row.style.backgroundColor = 'yellow';
                row.style.fontWeight = 'bold';
            }

            rankingBody.appendChild(row);
        });

        if (ranking.length === 0) {
            const noPlayersRow = document.createElement('tr');
            noPlayersRow.innerHTML = `<td colspan="3">No hay jugadores en el ranking</td>`;
            rankingBody.appendChild(noPlayersRow);
        }

    } catch (error) {
        console.error('Error al cargar el ranking:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadRanking);
