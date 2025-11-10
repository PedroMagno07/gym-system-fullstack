const ctx = document.getElementById('dashboardChart').getContext('2d');
let currentChart;


Chart.defaults.color = '#333';
Chart.defaults.font.family = "'Segoe UI', sans-serif";
Chart.defaults.font.weight = 'bold';


let serverData = null;

async function fetchData() {
    try {
      
        const response = await fetch('../../../backend/admin/dados-dashboard.php');
        if (!response.ok) throw new Error('Erro na resposta da rede');
        
        serverData = await response.json();
        
     
        renderChart('planos');
        
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        
        alert('Não foi possível carregar os dados atualizados.');
    }
}


function renderChart(type) {

    if (!serverData) return;


    if (currentChart) {
        currentChart.destroy();
    }


    let chartDataConfig;
    let yAxisConfig = {}; 

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

            break;
    }


    yAxisConfig.y = {
        beginAtZero: true,
        grid: { color: '#ccc', lineWidth: 1 },
        ticks: { font: { weight: 'bold' } }
    };

    currentChart = new Chart(ctx, {
        type: 'bar', 
        data: chartDataConfig,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }, 
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
                                
                                if (context.dataset.yAxisID === 'y1') label += '%';
                                
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
                ...yAxisConfig 
            }
        }
    });
}

const tabButtons = document.querySelectorAll('.tab-btn');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
     
        tabButtons.forEach(btn => btn.classList.remove('active'));
  
        button.classList.add('active');

        renderChart(button.dataset.type);
    });
});

fetchData();