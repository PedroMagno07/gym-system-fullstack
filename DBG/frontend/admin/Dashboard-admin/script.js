const ctx = document.getElementById('dashboardChart').getContext('2d');
let currentChart;

// Configurações globais do Chart.js para manter o estilo visual
Chart.defaults.color = '#333';
Chart.defaults.font.family = "'Segoe UI', sans-serif";
Chart.defaults.font.weight = 'bold';

// Variável para armazenar os dados vindos do servidor PHP
let serverData = null;

// --- 1. FUNÇÃO PARA BUSCAR DADOS DO BACKEND ---
async function fetchData() {
    try {
        const response = await fetch('../../../backend/API/dados-dashboard.php');
        if (!response.ok) throw new Error('Erro na resposta da rede');
        
        serverData = await response.json();
        
        // Após carregar os dados com sucesso, renderiza o primeiro gráfico
        renderChart('planos');
        
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        // Fallback opcional: mostrar dados vazios ou mensagem de erro na tela
        alert('Não foi possível carregar os dados atualizados.');
    }
}

// --- 2. FUNÇÃO DE RENDERIZAÇÃO DO GRÁFICO ---
function renderChart(type) {
    // Se os dados ainda não chegaram, não faz nada
    if (!serverData) return;

    // Destrói o gráfico anterior se existir para criar um novo
    if (currentChart) {
        currentChart.destroy();
    }

    // Define as configurações de dados com base no tipo selecionado
    let chartDataConfig;
    let yAxisConfig = {}; // Configuração dinâmica dos eixos Y

    switch(type) {
        case 'planos':
            chartDataConfig = {
                labels: serverData.planos.labels,
                datasets: [
                    {
                        type: 'bar',
                        label: 'Assinantes',
                        data: serverData.planos.data,
                        backgroundColor: '#9D35E7',
                        borderRadius: 4,
                        barPercentage: 0.6,
                        order: 2,
                        yAxisID: 'y'
                    },
                    {
                        type: 'line',
                        label: 'Porcentagem',
                        data: serverData.planos.percent,
                        borderColor: '#333',
                        borderWidth: 3,
                        pointBackgroundColor: '#333',
                        pointRadius: 5,
                        order: 1,
                        yAxisID: 'y1'
                    }
                ]
            };
            // Configura eixo Y secundário para porcentagem
            yAxisConfig.y1 = {
                beginAtZero: true,
                position: 'right',
                max: 100,
                grid: { display: false },
                ticks: { callback: (val) => val + '%' }
            };
            break;

        case 'usuarios':
            chartDataConfig = {
                labels: serverData.usuarios.labels,
                datasets: [
                    {
                        type: 'bar',
                        label: 'Total',
                        data: serverData.usuarios.data,
                        backgroundColor: '#9D35E7',
                        barPercentage: 0.5,
                        order: 2,
                        yAxisID: 'y'
                    },
                    {
                        type: 'line',
                        label: 'Distribuição (%)',
                        data: serverData.usuarios.percent,
                        borderColor: '#333',
                        borderWidth: 3,
                        pointRadius: 5,
                        order: 1,
                        yAxisID: 'y1'
                    }
                ]
            };
            yAxisConfig.y1 = {
                beginAtZero: true,
                position: 'right',
                max: 100,
                grid: { display: false },
                ticks: { callback: (val) => val + '%' }
            };
            break;

        case 'receita':
            chartDataConfig = {
                labels: serverData.receita.labels,
                datasets: [{
                    type: 'line',
                    label: 'Receita Estimada (R$)',
                    data: serverData.receita.data,
                    borderColor: '#9D35E7',
                    backgroundColor: 'rgba(157, 53, 231, 0.2)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 6,
                    yAxisID: 'y'
                }]
            };
            // Receita não precisa de eixo Y secundário (y1)
            break;
    }

    // Configuração do eixo Y principal (comum a todos)
    yAxisConfig.y = {
        beginAtZero: true,
        grid: { color: '#ccc', lineWidth: 1 },
        ticks: { font: { weight: 'bold' } }
    };

    // Cria o novo gráfico com as configurações definidas
    currentChart = new Chart(ctx, {
        type: 'bar', // Tipo base padrão
        data: chartDataConfig,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }, // Esconde a legenda para visual mais limpo
                tooltip: {
                    backgroundColor: '#000',
                    titleFont: { size: 14 },
                    bodyFont: { size: 14 },
                    padding: 10,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) label += ': ';
                            if (context.parsed.y !== null) {
                                label += context.parsed.y;
                                // Adiciona '%' se for o dataset de porcentagem
                                if (context.dataset.yAxisID === 'y1') label += '%';
                                // Adiciona 'R$' se for receita
                                if (type === 'receita') label = 'R$ ' + context.parsed.y.toFixed(2);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false, drawBorder: true, color: '#000', lineWidth: 2 },
                    ticks: { font: { weight: '900' }, color: '#000' }
                },
                ...yAxisConfig // Espalha as configurações dos eixos Y definidos acima
            }
        }
    });
}

// --- 3. GERENCIAMENTO DOS BOTÕES DE ALTERNÂNCIA ---
const tabButtons = document.querySelectorAll('.tab-btn');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove classe 'active' de todos os botões
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // Adiciona 'active' apenas ao botão clicado
        button.classList.add('active');
        // Renderiza o gráfico correspondente
        renderChart(button.dataset.type);
    });
});

// Inicializa a aplicação buscando os dados
fetchData();