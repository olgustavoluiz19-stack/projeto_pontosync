// --- FUNÇÕES DE MÁSCARA ---
function mascaraCPF(i) {
    let v = i.value;
    if (isNaN(v[v.length - 1])) { i.value = v.substring(0, v.length - 1); return; }
    i.setAttribute("maxlength", "14");
    if (v.length == 3 || v.length == 7) i.value += ".";
    if (v.length == 11) i.value += "-";
}

function mascaraTelefone(i) {
    let v = i.value;
    i.setAttribute("maxlength", "15");
    if (v.length == 1) i.value = "(" + v;
    if (v.length == 3) i.value += ") ";
    if (v.length == 10) i.value += "-";
}

// --- FUNÇÃO DE CADASTRO ---
const cadastrarUsuario = async (event) => {
    event.preventDefault();

    // Capturando TODOS os campos que aparecem no seu formulário
    // Dentro da função cadastrarUsuario:
const dados = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    senha: document.getElementById('senha').value,
    cpf: document.getElementById('cpf').value,
    dataNascimento: document.getElementById('nascimento').value, // ID corrigido aqui
    telefone: document.getElementById('telefone').value
};

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados) // Agora envia o objeto completo
        });

        if (response.ok) {
            alert("✅ Usuário cadastrado com sucesso!");
            // Isso redireciona o navegador para o arquivo login.html
            window.location.href = "login.html"; 
        } else {
            const erro = await response.text();
            alert("❌ Erro no cadastro: " + erro);
        }
    } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
        alert("O servidor está desligado ou inacessível. Verifique o terminal do Node!");
    }
};

// --- VINCULAÇÃO COM PROTEÇÃO (EVITA O ERRO DE NULL) ---
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formCadastro');
    
    if (formulario) {
        formulario.addEventListener('submit', cadastrarUsuario);
        console.log("✅ Script de cadastro vinculado com sucesso!");
    } else {
        console.error("❌ Erro: Não encontrei um formulário com id='formCadastro'. Verifique seu HTML!");
    }
});