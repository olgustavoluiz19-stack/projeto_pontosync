function updateDashboard() {
    const now = new Date();
    const hours = now.getHours();
    
    // 1. Lógica da Saudação
    let saudacao = "";
    let emoji = "";

    if (hours >= 5 && hours < 12) {
        saudacao = "Bom dia";
        emoji = "☀️";
    } else if (hours >= 12 && hours < 18) {
        saudacao = "Boa tarde";
        emoji = "👋";
    } else {
        saudacao = "Boa noite";
        emoji = "🌙";
    }

    // Seleciona o elemento h2 dentro de welcome-text
    const welcomeTitle = document.querySelector('.welcome-text h2');
    welcomeTitle.innerHTML = `${saudacao} ${emoji}`;

    // 2. Relógio em Tempo Real
    const h = String(hours).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('live-clock').textContent = `${h}:${m}:${s}`;

    // 3. Data por Extenso (Ex: quinta-feira, 09 de abril de 2026)
    const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
    let dataFormatada = now.toLocaleDateString('pt-BR', options);
    
    // Deixa a primeira letra maiúscula para ficar elegante
    document.getElementById('current-date').textContent = dataFormatada;
}

// Atualiza a cada 1 segundo
setInterval(updateDashboard, 1000);

// Executa assim que a página carrega
updateDashboard();