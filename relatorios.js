document.addEventListener('DOMContentLoaded', () => {
    // 1. Puxar dados do LocalStorage
    const funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
    const registros = JSON.parse(localStorage.getItem('registros')) || [];

    // 2. Atualizar Cards de Resumo
    document.getElementById('count-workers').textContent = funcionarios.length;
    document.getElementById('count-records').textContent = registros.length;

    // 3. Preencher Tabela de Detalhes
    const tableBody = document.getElementById('table-report-body');
    tableBody.innerHTML = '';

    funcionarios.forEach(func => {
        // Por enquanto os números são fixos conforme sua lógica de "depois"
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${func.nome}</td>
            <td>0h</td>
            <td>0</td>
            <td>0</td>
        `;
        tableBody.appendChild(tr);
    });

    // 4. Configurar Gráfico (Chart.js)
    const ctx = document.getElementById('hoursChart').getContext('2d');
    
    // Pegamos os nomes dos funcionários para as legendas
    const nomes = funcionarios.map(f => f.nome);
    // Dados zerados conforme imagem
    const dadosHoras = funcionarios.map(() => 0); 

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nomes,
            datasets: [{
                label: 'Horas',
                data: dadosHoras,
                backgroundColor: '#cbd5e1', // Cor cinza da imagem
                borderRadius: 4,
                barThickness: 150 // Deixa a barra larga como na foto
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false } // Esconde a legenda do topo
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 4, // Conforme sua imagem
                    ticks: { stepSize: 1 }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
});