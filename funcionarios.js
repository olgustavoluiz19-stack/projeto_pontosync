const modal = document.getElementById('modal-funcionario');
const form = document.getElementById('form-funcionario');
const tabela = document.getElementById('tabela-funcionarios');
const modalTitle = document.querySelector('.modal-header h2');

// Variável para controlar se estamos editando (-1 significa "Novo")
let editIndex = -1;

// Lista de Funcionários persistida
let listaFuncionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];

function abrirModal(index = -1) {
    editIndex = index;
    modal.style.display = 'flex';

    if (index === -1) {
        modalTitle.textContent = "Novo Funcionário";
        form.reset();
    } else {
        modalTitle.textContent = "Editar Funcionário";
        preencherModal(index);
    }
}

function fecharModal() {
    modal.style.display = 'none';
    form.reset();
    editIndex = -1;
}

// Preenche os campos para edição
function preencherModal(index) {
    const func = listaFuncionarios[index];
    document.getElementById('modal-nome').value = func.nome;
    document.getElementById('modal-cpf').value = func.cpf;
    document.getElementById('modal-tel').value = func.tel;
    document.getElementById('modal-nascimento').value = func.nascimento;
    document.getElementById('modal-tipo').value = func.tipo;
}

// Salvar (Criação ou Edição)
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const dadosFunc = {
        nome: document.getElementById('modal-nome').value,
        cpf: document.getElementById('modal-cpf').value,
        tel: document.getElementById('modal-tel').value,
        nascimento: document.getElementById('modal-nascimento').value,
        tipo: document.getElementById('modal-tipo').value
    };

    if (editIndex === -1) {
        // Create
        listaFuncionarios.push(dadosFunc);
    } else {
        // Update
        listaFuncionarios[editIndex] = dadosFunc;
    }

    localStorage.setItem('funcionarios', JSON.stringify(listaFuncionarios));
    renderizarTabela();
    fecharModal();
});

function renderizarTabela() {
    tabela.innerHTML = '';
    listaFuncionarios.forEach((func, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${func.nome}</td>
            <td>${func.cpf}</td>
            <td>${func.tel}</td>
            <td><span class="badge ${func.tipo === 'Gerente' ? 'badge-purple' : 'badge-blue'}">${func.tipo}</span></td>
            <td class="actions text-right">
                <button class="btn-icon edit" title="Editar" onclick="abrirModal(${index})">
                    <i class="fa-solid fa-pencil"></i>
                </button>
                <button class="btn-icon delete" title="Excluir" onclick="excluirFuncionario(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tabela.appendChild(tr);
    });
}

function excluirFuncionario(index) {
    if (confirm("Deseja realmente excluir este funcionário?")) {
        listaFuncionarios.splice(index, 1);
        localStorage.setItem('funcionarios', JSON.stringify(listaFuncionarios));
        renderizarTabela();
    }
}

// Funções de Máscara (Mantenha as que já criamos)
function mascaraCPF(i) { /* ... */ }
function mascaraTelefone(i) { /* ... */ }

renderizarTabela();