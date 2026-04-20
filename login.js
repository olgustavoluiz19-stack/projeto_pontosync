document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('formLogin');

    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            try {
                // Lembre-se de trocar para a URL do Railway quando fizer o deploy final
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha })
                });

                // VERIFICAÇÃO DE QA: Se o status não for 200-299, cai no else
                if (response.ok) {
                    const data = await response.json();
                    alert(`👋 Bem-vindo, ${data.user.nome}!`);
                    localStorage.setItem('usuarioLogado', JSON.stringify(data.user));
                    window.location.href = "dashboard.html";
                } else {
                    // Aqui pegamos a mensagem "Usuário não encontrado" ou "Senha incorreta"
                    const errorText = await response.text();
                    alert("❌ " + errorText);
                }
            } catch (error) {
                console.error("Erro na requisição:", error);
                alert("Servidor offline! Ligue o backend.");
            }
        });
    }
});