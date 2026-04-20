document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('formLogin'); // Verifique se o ID no HTML é esse

    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha })
                });

                const data = await response.json();

                if (response.ok) {
                    alert(`👋 Bem-vindo, ${data.user.nome}!`);
                    // Salva os dados básicos na sessão para usar no sistema de ponto
                    localStorage.setItem('usuarioLogado', JSON.stringify(data.user));
                    window.location.href = "dashboard.html"; // Ou sua tela principal
                } else {
                    alert("❌ Erro: " + (data.message || "Credenciais inválidas"));
                }
            } catch (error) {
                console.error("Erro ao logar:", error);
                alert("Servidor offline!");
            }
        });
    }
});