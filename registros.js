const tabela = document.getElementById('tabela-registros');
const filterWorker = document.getElementById('filter-worker');
const regWorkerSelect = document.getElementById('reg-worker');
const filterDate = document.getElementById('filter-date');

// Define data de hoje no filtro por padrão
const hoje = new Date().toISOString().split('T')[0];
filterDate.value = hoje;

let registros = JSON.parse(localStorage.getItem('registros')) || [];
let funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];

function abrirModalRegistro() {
    preencherSelectFuncionarios();
    document.getElementById('modal-registro').style.display = 'flex';
}

function fecharModalRegistro() {
    document.getElementById('modal-registro').style.display = 'none';
    document.getElementById('form-registro').reset();
}

// Preenche os selects de funcionários com dados da outra aba
function preencherSelectFuncionarios() {
    const options = funcionarios.map(f => `<option value="${f.nome}">${f.nome}</option>`).join('');
    regWorkerSelect.innerHTML = `<option value="" disabled selected>Selecione</option>${options}`;
    
    // Filtro do topo (mantendo o "Todos")
    filterWorker.innerHTML = `<option value="todos">Todos</option>${options}`;
}

// Salvar Registro
document.getElementById('form-registro').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const novoReg = {
        funcionario: document.getElementById('reg-worker').value,
        tipo: document.getElementById('reg-type').value,
        dataHora: document.getElementById('reg-datetime').value,
        obs: document.getElementById('reg-obs').value || '-'
    };

    registros.push(novoReg);
    localStorage.setItem('registros', JSON.stringify(registros));
    
    renderizarTabela();
    fecharModalRegistro();
});

function renderizarTabela() {
    tabela.innerHTML = '';
    
    // Se não houver nada
    if (registros.length === 0) {
        tabela.innerHTML = `<tr><td colspan="5" class="empty-row">Nenhum registro encontrado</td></tr>`;
        return;
    }

    registros.forEach((reg, index) => {
        // Formatação simples da data para exibição
        const dataFormatada = new Date(reg.dataHora).toLocaleString('pt-BR');

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${reg.funcionario}</td>
            <td><strong>${reg.tipo}</strong></td>
            <td>${dataFormatada}</td>
            <td>${reg.obs}</td>
            <td class="text-right">
                <button class="btn-icon delete" onclick="excluirRegistro(${index})"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tabela.appendChild(tr);
    });
}

function excluirRegistro(index) {
    if(confirm("Excluir este registro de ponto?")) {
        registros.splice(index, 1);
        localStorage.setItem('registros', JSON.stringify(registros));
        renderizarTabela();
    }
}

// Inicialização
preencherSelectFuncionarios();
renderizarTabela();