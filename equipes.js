const container = document.getElementById('equipes-container');
const modal = document.getElementById('modal-equipe');
const form = document.getElementById('form-equipe');
const inputNome = document.getElementById('equipe-nome');
const modalTitulo = document.getElementById('modal-titulo');

let equipes = JSON.parse(localStorage.getItem('equipes')) || [];
let editIndex = -1;

function abrirModalEquipe(index = -1) {
    editIndex = index;
    modal.style.display = 'flex';
    if (index === -1) {
        modalTitulo.textContent = "Nova Equipe";
        form.reset();
    } else {
        modalTitulo.textContent = "Editar Equipe";
        inputNome.value = equipes[index].nome;
    }
}

function fecharModalEquipe() {
    modal.style.display = 'none';
    editIndex = -1;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = inputNome.value;

    if (editIndex === -1) {
        equipes.push({ nome: nome, membros: [] });
    } else {
        equipes[editIndex].nome = nome;
    }

    localStorage.setItem('equipes', JSON.stringify(equipes));
    renderizarEquipes();
    fecharModalEquipe();
});

function excluirEquipe(index) {
    if (confirm(`Excluir a equipe "${equipes[index].nome}"?`)) {
        equipes.splice(index, 1);
        localStorage.setItem('equipes', JSON.stringify(equipes));
        renderizarEquipes();
    }
}

function renderizarEquipes() {
    if (equipes.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>Nenhuma equipe cadastrada</p></div>`;
        return;
    }

    container.innerHTML = '';
    equipes.forEach((eq, index) => {
        const card = document.createElement('div');
        card.className = 'equipe-card';
        card.innerHTML = `
            <div class="equipe-header">
                <div class="equipe-icon-box">
                    <i class="fa-solid fa-users"></i>
                </div>
                <span class="equipe-nome">${eq.nome}</span>
                <div class="equipe-actions">
                    <button class="btn-card-icon edit" onclick="abrirModalEquipe(${index})"><i class="fa-solid fa-pencil"></i></button>
                    <button class="btn-card-icon delete" onclick="excluirEquipe(${index})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            <button class="btn-manage" onclick="abrirGerenciarMembros(${index})">
                <i class="fa-solid fa-user-plus"></i> Gerenciar Membros
            </button>
        `;
        container.appendChild(card);
    });
}

// Iniciar
renderizarEquipes();


// VARIÁVEL GLOBAL DE ESTADO (Crucial para o PROJETO PONTO)
let equipeAtualIndex = -1; // Mantém o índice da equipe que está sendo gerenciada

const modalMembros = document.getElementById('modal-membros');
const listaMembrosContent = document.getElementById('lista-funcionarios-disponiveis');
const nomeEquipeMembro = document.getElementById('nome-equipe-membro');

function abrirGerenciarMembros(index) {
    equipeAtualIndex = index; 
    const equipe = equipes[equipeAtualIndex]; 
    nomeEquipeMembro.textContent = equipe.nome;
    
    // Puxa os funcionários cadastrados na aba Funcionários
    const todosFuncionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
    listaMembrosContent.innerHTML = '';

    if (todosFuncionarios.length === 0) {
        listaMembrosContent.innerHTML = '<p class="empty-list-msg">Nenhum funcionário cadastrado no sistema.</p>';
    } else {
        todosFuncionarios.forEach(func => {
            // REGRA DE OURO: Verifica se o CPF deste funcionário já está no array de membros da equipe
            // Usamos o CPF porque nomes podem se repetir, mas CPF é único (ID).
            const jaEhMembro = equipe.membros && equipe.membros.some(m => m.cpf === func.cpf);
            
            const label = document.createElement('label');
            label.className = 'membro-selection-card';
            
            // O atributo 'checked' só é adicionado se jaEhMembro for true
            label.innerHTML = `
                <input type="checkbox" value="${func.cpf}" ${jaEhMembro ? 'checked' : ''}>
                <div class="membro-info">
                    <span class="nome">${func.nome}</span>
                    <span class="cargo">${func.tipo} - CPF: ${func.cpf}</span>
                </div>
            `;
            listaMembrosContent.appendChild(label);
        });
    }

    modalMembros.style.display = 'flex';
}

function fecharModalMembros() {
    modalMembros.style.display = 'none';
    equipeAtualIndex = -1; // Limpa o estado ao fechar
}

function salvarMembros() {
    if (equipeAtualIndex === -1) return;

    const checkboxes = listaMembrosContent.querySelectorAll('input[type="checkbox"]:checked');
    const todosFuncionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
    
    // Criamos um novo array apenas com os funcionários que foram marcados
    const selecionados = Array.from(checkboxes).map(cb => {
        return todosFuncionarios.find(f => f.cpf === cb.value);
    });

    // Atualizamos a equipe no nosso array global
    equipes[equipeAtualIndex].membros = selecionados;
    
    // Salvamos o array de equipes inteiro de volta no LocalStorage
    localStorage.setItem('equipes', JSON.stringify(equipes));
    
    fecharModalMembros();
    renderizarEquipes(); // Opcional: para atualizar algum contador no card se houver
}