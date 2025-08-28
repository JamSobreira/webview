// API Base URL
const API_BASE = '/api';

// Estado da aplicação
let currentSection = 'dashboard';
let currentData = {
    computadores: [],
    funcionarios: [],
    problemas: [],
    pecas: [],
    manutencoes: []
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupEventListeners();
    loadDashboardData();
}

// Configuração da navegação
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.dataset.section;
            switchSection(section);
        });
    });
}

function switchSection(sectionName) {
    // Atualizar botões de navegação
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Atualizar seções
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName).classList.add('active');
    
    currentSection = sectionName;
    
    // Carregar dados da seção
    loadSectionData(sectionName);
}

// Configuração dos event listeners
function setupEventListeners() {
    // Botões de adicionar
    document.getElementById('add-computador-btn').addEventListener('click', () => openComputadorModal());
    document.getElementById('add-funcionario-btn').addEventListener('click', () => openFuncionarioModal());
    document.getElementById('add-problema-btn').addEventListener('click', () => openProblemaModal());
    document.getElementById('add-peca-btn').addEventListener('click', () => openPecaModal());
    document.getElementById('add-manutencao-btn').addEventListener('click', () => openManutencaoModal());
    
    // Campos de busca
    document.getElementById('search-computadores').addEventListener('input', debounce(searchComputadores, 300));
    document.getElementById('search-funcionarios').addEventListener('input', debounce(searchFuncionarios, 300));
    document.getElementById('search-problemas').addEventListener('input', debounce(searchProblemas, 300));
    document.getElementById('search-pecas').addEventListener('input', debounce(searchPecas, 300));
    document.getElementById('search-manutencoes').addEventListener('input', debounce(searchManutencoes, 300));
    
    // Filtros de manutenções
    document.getElementById('filter-computador').addEventListener('change', filterManutencoes);
    document.getElementById('filter-tipo').addEventListener('change', filterManutencoes);
    document.getElementById('filter-data-inicio').addEventListener('change', filterManutencoes);
    document.getElementById('filter-data-fim').addEventListener('change', filterManutencoes);
    
    // Modal overlay
    document.getElementById('modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
}

// Utilitários
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showLoading() {
    document.getElementById('loading').classList.add('active');
}

function hideLoading() {
    document.getElementById('loading').classList.remove('active');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 
                 type === 'error' ? 'fas fa-exclamation-circle' : 
                 'fas fa-info-circle';
    
    toast.innerHTML = `
        <i class="toast-icon ${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// API Functions
async function apiRequest(endpoint, options = {}) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Erro na requisição');
        }
        
        return data;
    } catch (error) {
        showToast(error.message, 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

// Dashboard Functions
async function loadDashboardData() {
    try {
        const [computadores, funcionarios, pecas, manutencoes] = await Promise.all([
            apiRequest('/computadores'),
            apiRequest('/funcionarios'),
            apiRequest('/pecas'),
            apiRequest('/manutencoes')
        ]);
        
        // Atualizar estatísticas
        document.getElementById('total-computadores').textContent = computadores.length;
        document.getElementById('total-funcionarios').textContent = funcionarios.length;
        document.getElementById('total-pecas').textContent = pecas.length;
        document.getElementById('total-manutencoes').textContent = manutencoes.length;
        
        // Carregar últimas manutenções
        loadRecentManutencoes(manutencoes.slice(0, 5));
        
    } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
    }
}

function loadRecentManutencoes(manutencoes) {
    const tbody = document.querySelector('#recent-manutencoes-table tbody');
    tbody.innerHTML = '';
    
    if (manutencoes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Nenhuma manutenção encontrada</td></tr>';
        return;
    }
    
    manutencoes.forEach(manutencao => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(manutencao.data_manutencao)}</td>
            <td>${manutencao.computador ? `${manutencao.computador.marca} ${manutencao.computador.modelo}` : 'N/A'}</td>
            <td>${manutencao.tipo_manutencao}</td>
            <td>${manutencao.funcionario ? manutencao.funcionario.nome : 'N/A'}</td>
            <td><span class="status-badge concluida">Concluída</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Section Data Loading
async function loadSectionData(section) {
    switch (section) {
        case 'computadores':
            await loadComputadores();
            break;
        case 'funcionarios':
            await loadFuncionarios();
            break;
        case 'problemas':
            await loadProblemas();
            break;
        case 'pecas':
            await loadPecas();
            break;
        case 'manutencoes':
            await loadManutencoes();
            break;
    }
}

// Computadores Functions
async function loadComputadores() {
    try {
        const computadores = await apiRequest('/computadores');
        currentData.computadores = computadores;
        renderComputadoresTable(computadores);
    } catch (error) {
        console.error('Erro ao carregar computadores:', error);
    }
}

function renderComputadoresTable(computadores) {
    const tbody = document.querySelector('#computadores-table tbody');
    tbody.innerHTML = '';
    
    if (computadores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum computador encontrado</td></tr>';
        return;
    }
    
    computadores.forEach(computador => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${computador.id}</td>
            <td>${computador.marca}</td>
            <td>${computador.modelo}</td>
            <td>${computador.numero_serie}</td>
            <td>${formatDate(computador.data_aquisicao)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editComputador(${computador.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteComputador(${computador.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function searchComputadores() {
    const query = document.getElementById('search-computadores').value.toLowerCase();
    const filtered = currentData.computadores.filter(comp => 
        comp.marca.toLowerCase().includes(query) ||
        comp.modelo.toLowerCase().includes(query) ||
        comp.numero_serie.toLowerCase().includes(query)
    );
    renderComputadoresTable(filtered);
}

// Funcionários Functions
async function loadFuncionarios() {
    try {
        const funcionarios = await apiRequest('/funcionarios');
        currentData.funcionarios = funcionarios;
        renderFuncionariosTable(funcionarios);
    } catch (error) {
        console.error('Erro ao carregar funcionários:', error);
    }
}

function renderFuncionariosTable(funcionarios) {
    const tbody = document.querySelector('#funcionarios-table tbody');
    tbody.innerHTML = '';
    
    if (funcionarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Nenhum funcionário encontrado</td></tr>';
        return;
    }
    
    funcionarios.forEach(funcionario => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${funcionario.id}</td>
            <td>${funcionario.nome}</td>
            <td>${funcionario.cargo}</td>
            <td>${funcionario.departamento}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editFuncionario(${funcionario.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteFuncionario(${funcionario.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function searchFuncionarios() {
    const query = document.getElementById('search-funcionarios').value.toLowerCase();
    const filtered = currentData.funcionarios.filter(func => 
        func.nome.toLowerCase().includes(query) ||
        func.cargo.toLowerCase().includes(query) ||
        func.departamento.toLowerCase().includes(query)
    );
    renderFuncionariosTable(filtered);
}

// Problemas Functions
async function loadProblemas() {
    try {
        const problemas = await apiRequest('/problemas');
        currentData.problemas = problemas;
        renderProblemasTable(problemas);
    } catch (error) {
        console.error('Erro ao carregar problemas:', error);
    }
}

function renderProblemasTable(problemas) {
    const tbody = document.querySelector('#problemas-table tbody');
    tbody.innerHTML = '';
    
    if (problemas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Nenhum problema encontrado</td></tr>';
        return;
    }
    
    problemas.forEach(problema => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${problema.id}</td>
            <td>${problema.descricao}</td>
            <td>${problema.categoria}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editProblema(${problema.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteProblema(${problema.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function searchProblemas() {
    const query = document.getElementById('search-problemas').value.toLowerCase();
    const filtered = currentData.problemas.filter(prob => 
        prob.descricao.toLowerCase().includes(query) ||
        prob.categoria.toLowerCase().includes(query)
    );
    renderProblemasTable(filtered);
}

// Peças Functions
async function loadPecas() {
    try {
        const pecas = await apiRequest('/pecas');
        currentData.pecas = pecas;
        renderPecasTable(pecas);
    } catch (error) {
        console.error('Erro ao carregar peças:', error);
    }
}

function renderPecasTable(pecas) {
    const tbody = document.querySelector('#pecas-table tbody');
    tbody.innerHTML = '';
    
    if (pecas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Nenhuma peça encontrada</td></tr>';
        return;
    }
    
    pecas.forEach(peca => {
        const row = document.createElement('tr');
        const status = peca.manutencao_id ? 'em-uso' : 'disponivel';
        const statusText = peca.manutencao_id ? 'Em Uso' : 'Disponível';
        
        row.innerHTML = `
            <td>${peca.id}</td>
            <td>${peca.nome_peca}</td>
            <td>${peca.fabricante}</td>
            <td>R$ ${parseFloat(peca.custo).toFixed(2)}</td>
            <td>${formatDate(peca.data_aquisicao_peca)}</td>
            <td><span class="status-badge ${status}">${statusText}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editPeca(${peca.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deletePeca(${peca.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function searchPecas() {
    const query = document.getElementById('search-pecas').value.toLowerCase();
    const filtered = currentData.pecas.filter(peca => 
        peca.nome_peca.toLowerCase().includes(query) ||
        peca.fabricante.toLowerCase().includes(query)
    );
    renderPecasTable(filtered);
}

// Manutenções Functions
async function loadManutencoes() {
    try {
        const [manutencoes, computadores] = await Promise.all([
            apiRequest('/manutencoes'),
            apiRequest('/computadores')
        ]);
        
        currentData.manutencoes = manutencoes;
        currentData.computadores = computadores;
        
        // Preencher filtro de computadores
        populateComputadorFilter(computadores);
        
        renderManutencoesTable(manutencoes);
    } catch (error) {
        console.error('Erro ao carregar manutenções:', error);
    }
}

function populateComputadorFilter(computadores) {
    const select = document.getElementById('filter-computador');
    select.innerHTML = '<option value="">Todos os Computadores</option>';
    
    computadores.forEach(comp => {
        const option = document.createElement('option');
        option.value = comp.id;
        option.textContent = `${comp.marca} ${comp.modelo} (${comp.numero_serie})`;
        select.appendChild(option);
    });
}

function renderManutencoesTable(manutencoes) {
    const tbody = document.querySelector('#manutencoes-table tbody');
    tbody.innerHTML = '';
    
    if (manutencoes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Nenhuma manutenção encontrada</td></tr>';
        return;
    }
    
    manutencoes.forEach(manutencao => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${manutencao.id}</td>
            <td>${formatDateTime(manutencao.data_manutencao)}</td>
            <td>${manutencao.computador ? `${manutencao.computador.marca} ${manutencao.computador.modelo}` : 'N/A'}</td>
            <td>${manutencao.tipo_manutencao}</td>
            <td>${manutencao.problema ? manutencao.problema.descricao : 'N/A'}</td>
            <td>${manutencao.funcionario ? manutencao.funcionario.nome : 'N/A'}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewManutencao(${manutencao.id})" title="Ver Detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="editManutencao(${manutencao.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteManutencao(${manutencao.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function searchManutencoes() {
    const query = document.getElementById('search-manutencoes').value.toLowerCase();
    const filtered = currentData.manutencoes.filter(manutencao => 
        (manutencao.computador && (manutencao.computador.marca.toLowerCase().includes(query) || 
         manutencao.computador.modelo.toLowerCase().includes(query))) ||
        manutencao.tipo_manutencao.toLowerCase().includes(query) ||
        (manutencao.funcionario && manutencao.funcionario.nome.toLowerCase().includes(query))
    );
    renderManutencoesTable(filtered);
}

function filterManutencoes() {
    const computadorId = document.getElementById('filter-computador').value;
    const tipo = document.getElementById('filter-tipo').value;
    const dataInicio = document.getElementById('filter-data-inicio').value;
    const dataFim = document.getElementById('filter-data-fim').value;
    
    let filtered = [...currentData.manutencoes];
    
    if (computadorId) {
        filtered = filtered.filter(m => m.computador_id == computadorId);
    }
    
    if (tipo) {
        filtered = filtered.filter(m => m.tipo_manutencao === tipo);
    }
    
    if (dataInicio) {
        filtered = filtered.filter(m => new Date(m.data_manutencao) >= new Date(dataInicio));
    }
    
    if (dataFim) {
        filtered = filtered.filter(m => new Date(m.data_manutencao) <= new Date(dataFim));
    }
    
    renderManutencoesTable(filtered);
}

// Modal Functions
function openModal(title, content) {
    const modal = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>${title}</h3>
            <button class="close-btn" onclick="closeModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        ${content}
    `;
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

// CRUD Functions - Computadores
function openComputadorModal(computador = null) {
    const isEdit = computador !== null;
    const title = isEdit ? 'Editar Computador' : 'Novo Computador';
    
    const content = `
        <form id="computador-form">
            <div class="form-group">
                <label for="marca">Marca</label>
                <input type="text" id="marca" name="marca" value="${isEdit ? computador.marca : ''}" required>
            </div>
            <div class="form-group">
                <label for="modelo">Modelo</label>
                <input type="text" id="modelo" name="modelo" value="${isEdit ? computador.modelo : ''}" required>
            </div>
            <div class="form-group">
                <label for="numero_serie">Número de Série</label>
                <input type="text" id="numero_serie" name="numero_serie" value="${isEdit ? computador.numero_serie : ''}" required>
            </div>
            <div class="form-group">
                <label for="data_aquisicao">Data de Aquisição</label>
                <input type="date" id="data_aquisicao" name="data_aquisicao" value="${isEdit ? computador.data_aquisicao : ''}" required>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="btn btn-primary">${isEdit ? 'Atualizar' : 'Salvar'}</button>
            </div>
        </form>
    `;
    
    openModal(title, content);
    
    document.getElementById('computador-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        try {
            if (isEdit) {
                await apiRequest(`/computadores/${computador.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                });
                showToast('Computador atualizado com sucesso!', 'success');
            } else {
                await apiRequest('/computadores', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                showToast('Computador criado com sucesso!', 'success');
            }
            
            closeModal();
            loadComputadores();
            loadDashboardData();
        } catch (error) {
            console.error('Erro ao salvar computador:', error);
        }
    });
}

async function editComputador(id) {
    try {
        const computador = await apiRequest(`/computadores/${id}`);
        openComputadorModal(computador);
    } catch (error) {
        console.error('Erro ao carregar computador:', error);
    }
}

async function deleteComputador(id) {
    if (!confirm('Tem certeza que deseja excluir este computador?')) {
        return;
    }
    
    try {
        await apiRequest(`/computadores/${id}`, { method: 'DELETE' });
        showToast('Computador excluído com sucesso!', 'success');
        loadComputadores();
        loadDashboardData();
    } catch (error) {
        console.error('Erro ao excluir computador:', error);
    }
}

// CRUD Functions - Funcionários
function openFuncionarioModal(funcionario = null) {
    const isEdit = funcionario !== null;
    const title = isEdit ? 'Editar Funcionário' : 'Novo Funcionário';
    
    const content = `
        <form id="funcionario-form">
            <div class="form-group">
                <label for="nome">Nome</label>
                <input type="text" id="nome" name="nome" value="${isEdit ? funcionario.nome : ''}" required>
            </div>
            <div class="form-group">
                <label for="cargo">Cargo</label>
                <input type="text" id="cargo" name="cargo" value="${isEdit ? funcionario.cargo : ''}" required>
            </div>
            <div class="form-group">
                <label for="departamento">Departamento</label>
                <input type="text" id="departamento" name="departamento" value="${isEdit ? funcionario.departamento : ''}" required>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="btn btn-primary">${isEdit ? 'Atualizar' : 'Salvar'}</button>
            </div>
        </form>
    `;
    
    openModal(title, content);
    
    document.getElementById('funcionario-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        try {
            if (isEdit) {
                await apiRequest(`/funcionarios/${funcionario.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                });
                showToast('Funcionário atualizado com sucesso!', 'success');
            } else {
                await apiRequest('/funcionarios', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                showToast('Funcionário criado com sucesso!', 'success');
            }
            
            closeModal();
            loadFuncionarios();
            loadDashboardData();
        } catch (error) {
            console.error('Erro ao salvar funcionário:', error);
        }
    });
}

async function editFuncionario(id) {
    try {
        const funcionario = await apiRequest(`/funcionarios/${id}`);
        openFuncionarioModal(funcionario);
    } catch (error) {
        console.error('Erro ao carregar funcionário:', error);
    }
}

async function deleteFuncionario(id) {
    if (!confirm('Tem certeza que deseja excluir este funcionário?')) {
        return;
    }
    
    try {
        await apiRequest(`/funcionarios/${id}`, { method: 'DELETE' });
        showToast('Funcionário excluído com sucesso!', 'success');
        loadFuncionarios();
        loadDashboardData();
    } catch (error) {
        console.error('Erro ao excluir funcionário:', error);
    }
}

// CRUD Functions - Problemas
function openProblemaModal(problema = null) {
    const isEdit = problema !== null;
    const title = isEdit ? 'Editar Problema' : 'Novo Problema';
    
    const content = `
        <form id="problema-form">
            <div class="form-group">
                <label for="descricao">Descrição</label>
                <textarea id="descricao" name="descricao" required>${isEdit ? problema.descricao : ''}</textarea>
            </div>
            <div class="form-group">
                <label for="categoria">Categoria</label>
                <select id="categoria" name="categoria" required>
                    <option value="">Selecione uma categoria</option>
                    <option value="Hardware" ${isEdit && problema.categoria === 'Hardware' ? 'selected' : ''}>Hardware</option>
                    <option value="Software" ${isEdit && problema.categoria === 'Software' ? 'selected' : ''}>Software</option>
                    <option value="Rede" ${isEdit && problema.categoria === 'Rede' ? 'selected' : ''}>Rede</option>
                    <option value="Sistema Operacional" ${isEdit && problema.categoria === 'Sistema Operacional' ? 'selected' : ''}>Sistema Operacional</option>
                    <option value="Periféricos" ${isEdit && problema.categoria === 'Periféricos' ? 'selected' : ''}>Periféricos</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="btn btn-primary">${isEdit ? 'Atualizar' : 'Salvar'}</button>
            </div>
        </form>
    `;
    
    openModal(title, content);
    
    document.getElementById('problema-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        try {
            if (isEdit) {
                await apiRequest(`/problemas/${problema.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                });
                showToast('Problema atualizado com sucesso!', 'success');
            } else {
                await apiRequest('/problemas', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                showToast('Problema criado com sucesso!', 'success');
            }
            
            closeModal();
            loadProblemas();
        } catch (error) {
            console.error('Erro ao salvar problema:', error);
        }
    });
}

async function editProblema(id) {
    try {
        const problema = await apiRequest(`/problemas/${id}`);
        openProblemaModal(problema);
    } catch (error) {
        console.error('Erro ao carregar problema:', error);
    }
}

async function deleteProblema(id) {
    if (!confirm('Tem certeza que deseja excluir este problema?')) {
        return;
    }
    
    try {
        await apiRequest(`/problemas/${id}`, { method: 'DELETE' });
        showToast('Problema excluído com sucesso!', 'success');
        loadProblemas();
    } catch (error) {
        console.error('Erro ao excluir problema:', error);
    }
}

// CRUD Functions - Peças
function openPecaModal(peca = null) {
    const isEdit = peca !== null;
    const title = isEdit ? 'Editar Peça' : 'Nova Peça';
    
    const content = `
        <form id="peca-form">
            <div class="form-group">
                <label for="nome_peca">Nome da Peça</label>
                <input type="text" id="nome_peca" name="nome_peca" value="${isEdit ? peca.nome_peca : ''}" required>
            </div>
            <div class="form-group">
                <label for="numero_serie_peca">Número de Série (Opcional)</label>
                <input type="text" id="numero_serie_peca" name="numero_serie_peca" value="${isEdit ? (peca.numero_serie_peca || '') : ''}">
            </div>
            <div class="form-group">
                <label for="fabricante">Fabricante</label>
                <input type="text" id="fabricante" name="fabricante" value="${isEdit ? peca.fabricante : ''}" required>
            </div>
            <div class="form-group">
                <label for="custo">Custo (R$)</label>
                <input type="number" step="0.01" id="custo" name="custo" value="${isEdit ? peca.custo : ''}" required>
            </div>
            <div class="form-group">
                <label for="data_aquisicao_peca">Data de Aquisição</label>
                <input type="date" id="data_aquisicao_peca" name="data_aquisicao_peca" value="${isEdit ? peca.data_aquisicao_peca : ''}" required>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="btn btn-primary">${isEdit ? 'Atualizar' : 'Salvar'}</button>
            </div>
        </form>
    `;
    
    openModal(title, content);
    
    document.getElementById('peca-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        try {
            if (isEdit) {
                await apiRequest(`/pecas/${peca.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                });
                showToast('Peça atualizada com sucesso!', 'success');
            } else {
                await apiRequest('/pecas', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                showToast('Peça criada com sucesso!', 'success');
            }
            
            closeModal();
            loadPecas();
            loadDashboardData();
        } catch (error) {
            console.error('Erro ao salvar peça:', error);
        }
    });
}

async function editPeca(id) {
    try {
        const peca = await apiRequest(`/pecas/${id}`);
        openPecaModal(peca);
    } catch (error) {
        console.error('Erro ao carregar peça:', error);
    }
}

async function deletePeca(id) {
    if (!confirm('Tem certeza que deseja excluir esta peça?')) {
        return;
    }
    
    try {
        await apiRequest(`/pecas/${id}`, { method: 'DELETE' });
        showToast('Peça excluída com sucesso!', 'success');
        loadPecas();
        loadDashboardData();
    } catch (error) {
        console.error('Erro ao excluir peça:', error);
    }
}

// CRUD Functions - Manutenções
async function openManutencaoModal(manutencao = null) {
    const isEdit = manutencao !== null;
    const title = isEdit ? 'Editar Manutenção' : 'Nova Manutenção';
    
    try {
        // Carregar dados necessários
        const [computadores, funcionarios, problemas, pecasDisponiveis] = await Promise.all([
            apiRequest('/computadores'),
            apiRequest('/funcionarios'),
            apiRequest('/problemas'),
            apiRequest('/pecas/disponiveis')
        ]);
        
        const content = `
            <form id="manutencao-form">
                <div class="form-group">
                    <label for="computador_id">Computador</label>
                    <select id="computador_id" name="computador_id" required>
                        <option value="">Selecione um computador</option>
                        ${computadores.map(comp => 
                            `<option value="${comp.id}" ${isEdit && manutencao.computador_id === comp.id ? 'selected' : ''}>
                                ${comp.marca} ${comp.modelo} (${comp.numero_serie})
                            </option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="funcionario_id">Funcionário Responsável</label>
                    <select id="funcionario_id" name="funcionario_id" required>
                        <option value="">Selecione um funcionário</option>
                        ${funcionarios.map(func => 
                            `<option value="${func.id}" ${isEdit && manutencao.funcionario_id === func.id ? 'selected' : ''}>
                                ${func.nome} - ${func.cargo}
                            </option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="problema_id">Problema</label>
                    <select id="problema_id" name="problema_id" required>
                        <option value="">Selecione um problema</option>
                        ${problemas.map(prob => 
                            `<option value="${prob.id}" ${isEdit && manutencao.problema_id === prob.id ? 'selected' : ''}>
                                ${prob.descricao}
                            </option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="data_manutencao">Data e Hora da Manutenção</label>
                    <input type="datetime-local" id="data_manutencao" name="data_manutencao" 
                           value="${isEdit ? formatDateTimeForInput(manutencao.data_manutencao) : ''}" required>
                </div>
                <div class="form-group">
                    <label for="tipo_manutencao">Tipo de Manutenção</label>
                    <select id="tipo_manutencao" name="tipo_manutencao" required>
                        <option value="">Selecione o tipo</option>
                        <option value="Preventiva" ${isEdit && manutencao.tipo_manutencao === 'Preventiva' ? 'selected' : ''}>Preventiva</option>
                        <option value="Corretiva" ${isEdit && manutencao.tipo_manutencao === 'Corretiva' ? 'selected' : ''}>Corretiva</option>
                        <option value="Upgrade" ${isEdit && manutencao.tipo_manutencao === 'Upgrade' ? 'selected' : ''}>Upgrade</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="descricao_problema">Descrição do Problema</label>
                    <textarea id="descricao_problema" name="descricao_problema" required>${isEdit ? manutencao.descricao_problema : ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="solucao_aplicada">Solução Aplicada</label>
                    <textarea id="solucao_aplicada" name="solucao_aplicada" required>${isEdit ? manutencao.solucao_aplicada : ''}</textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">${isEdit ? 'Atualizar' : 'Salvar'}</button>
                </div>
            </form>
        `;
        
        openModal(title, content);
        
        document.getElementById('manutencao-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            try {
                if (isEdit) {
                    await apiRequest(`/manutencoes/${manutencao.id}`, {
                        method: 'PUT',
                        body: JSON.stringify(data)
                    });
                    showToast('Manutenção atualizada com sucesso!', 'success');
                } else {
                    await apiRequest('/manutencoes', {
                        method: 'POST',
                        body: JSON.stringify(data)
                    });
                    showToast('Manutenção criada com sucesso!', 'success');
                }
                
                closeModal();
                loadManutencoes();
                loadDashboardData();
            } catch (error) {
                console.error('Erro ao salvar manutenção:', error);
            }
        });
        
    } catch (error) {
        console.error('Erro ao carregar dados para o modal:', error);
    }
}

async function editManutencao(id) {
    try {
        const manutencao = await apiRequest(`/manutencoes/${id}`);
        openManutencaoModal(manutencao);
    } catch (error) {
        console.error('Erro ao carregar manutenção:', error);
    }
}

async function viewManutencao(id) {
    try {
        const manutencao = await apiRequest(`/manutencoes/${id}`);
        
        const content = `
            <div class="manutencao-details">
                <h4>Detalhes da Manutenção #${manutencao.id}</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Data:</strong> ${formatDateTime(manutencao.data_manutencao)}
                    </div>
                    <div class="detail-item">
                        <strong>Tipo:</strong> ${manutencao.tipo_manutencao}
                    </div>
                    <div class="detail-item">
                        <strong>Computador:</strong> ${manutencao.computador ? `${manutencao.computador.marca} ${manutencao.computador.modelo} (${manutencao.computador.numero_serie})` : 'N/A'}
                    </div>
                    <div class="detail-item">
                        <strong>Funcionário:</strong> ${manutencao.funcionario ? `${manutencao.funcionario.nome} - ${manutencao.funcionario.cargo}` : 'N/A'}
                    </div>
                    <div class="detail-item">
                        <strong>Problema:</strong> ${manutencao.problema ? manutencao.problema.descricao : 'N/A'}
                    </div>
                    <div class="detail-item full-width">
                        <strong>Descrição do Problema:</strong><br>
                        ${manutencao.descricao_problema}
                    </div>
                    <div class="detail-item full-width">
                        <strong>Solução Aplicada:</strong><br>
                        ${manutencao.solucao_aplicada}
                    </div>
                    ${manutencao.pecas && manutencao.pecas.length > 0 ? `
                        <div class="detail-item full-width">
                            <strong>Peças Utilizadas:</strong><br>
                            ${manutencao.pecas.map(peca => `• ${peca.nome_peca} - ${peca.fabricante} (R$ ${parseFloat(peca.custo).toFixed(2)})`).join('<br>')}
                        </div>
                    ` : ''}
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Fechar</button>
                </div>
            </div>
            <style>
                .detail-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin: 1rem 0;
                }
                .detail-item {
                    padding: 0.75rem;
                    background: #f7fafc;
                    border-radius: 6px;
                }
                .detail-item.full-width {
                    grid-column: 1 / -1;
                }
            </style>
        `;
        
        openModal('Detalhes da Manutenção', content);
        
    } catch (error) {
        console.error('Erro ao carregar detalhes da manutenção:', error);
    }
}

async function deleteManutencao(id) {
    if (!confirm('Tem certeza que deseja excluir esta manutenção?')) {
        return;
    }
    
    try {
        await apiRequest(`/manutencoes/${id}`, { method: 'DELETE' });
        showToast('Manutenção excluída com sucesso!', 'success');
        loadManutencoes();
        loadDashboardData();
    } catch (error) {
        console.error('Erro ao excluir manutenção:', error);
    }
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
}

function formatDateTimeForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
}

