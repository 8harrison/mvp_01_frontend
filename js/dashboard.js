const API_BASE_URL = "http://localhost:5000";

let currentUser = null;
let movimentacoes = [];
let editingMovimentacaoId = null;

// Carregar usuário logado
document.addEventListener("DOMContentLoaded", () => {
  currentUser = JSON.parse(localStorage.getItem("user"));
  if (currentUser) {
    loadMovimentacoes();
  }

  document.getElementById("addMovimentacaoBtn").addEventListener("click", showAddMovimentacaoModal);
  document.getElementById("saveMovimentacaoBtn")?.addEventListener("click", saveMovimentacao);

  document.querySelectorAll(".filter-buttons button").forEach(button => {
    button.addEventListener("click", function() {
      const filter = this.getAttribute("data-filter");
      filterMovimentacoes(filter);
      document.querySelectorAll(".filter-buttons button").forEach(btn => btn.classList.remove("active"));
      this.classList.add("active");
    });
  });
});

async function loadMovimentacoes() {
  try {
    const userId = currentUser['usuario_id']
    
    const response = await fetch(`${API_BASE_URL}/listar_movimentacoes?usuario_id=${userId}`);

    if (response.ok) {
      const {data} = await response.json();
      currentUser.saldo = data.saldo
      movimentacoes = data.movimentacoes || [];
      renderMovimentacoes();
      updateDashboardStats();
    } else {
      console.error("Erro ao carregar movimentações");
    }
  } catch (error) {
    console.error("Erro de conexão:", error);
  }
}

function renderMovimentacoes() {
  const list = document.getElementById("movimentacoesList");
  list.innerHTML = "";

  if (movimentacoes.length === 0) {
    list.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-receipt fa-3x mb-3 text-muted"></i>
        <h4 class="text-muted">Nenhuma movimentação encontrada</h4>
        <p>Adicione sua primeira movimentação clicando em "Nova Movimentação"</p>
      </div>
    `;
    return;
  }

  movimentacoes.forEach(mov => {
    const cardClass = mov.tipo === "ENTRADA" ? "card-entrada" : "card-saida";
    const valorClass = mov.tipo === "ENTRADA" ? "entrada" : "saida";
    const icon = mov.tipo === "ENTRADA" ? "fa-arrow-up" : "fa-arrow-down";

    const date = new Date(mov.data_movimentacao);
    const formattedDate = date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR");

    list.innerHTML += `
      <div class="col-md-6 col-lg-4 movimentacao-card" data-type="${mov.tipo.toLowerCase()}">
        <div class="card ${cardClass}">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title">${mov.categoria}</h5>
              <div class="movimentacao-valor ${valorClass}">
                <i class="fas ${icon} me-1"></i>R$ ${mov.valor.toFixed(2)}
              </div>
            </div>
            <p class="card-text">${mov.descricao || "Sem descrição"}</p>
            <p class="card-text"><small class="text-muted">${formattedDate}</small></p>
            <p class="card-text"><small class="text-muted">Contraparte: ${mov.contraparte || "Não informada"}</small></p>
            <div class="d-flex justify-content-end">
              <button class="btn btn-sm btn-outline-primary me-2" onclick="editMovimentacao(${mov.id})"><i class="fas fa-edit"></i></button>
              <button class="btn btn-sm btn-outline-danger" onclick="deleteMovimentacao(${mov.id})"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

function filterMovimentacoes(filter) {
  document.querySelectorAll(".movimentacao-card").forEach(card => {
    card.style.display = (filter === "todos" || card.getAttribute("data-type") === filter) ? "block" : "none";
  });
}

function updateDashboardStats() {
  const saldoAtual = currentUser?.saldo || 0;
  const entradas = movimentacoes.filter(m => m.tipo === "ENTRADA").reduce((s, m) => s + m.valor, 0);
  const saidas = movimentacoes.filter(m => m.tipo === "SAIDA").reduce((s, m) => s + m.valor, 0);

  document.getElementById("saldoAtual").textContent = `R$ ${saldoAtual.toFixed(2)}`;
  document.getElementById("totalEntradas").textContent = `R$ ${entradas.toFixed(2)}`;
  document.getElementById("totalSaidas").textContent = `R$ ${saidas.toFixed(2)}`;
}

function showAddMovimentacaoModal() {
  editingMovimentacaoId = null;
  document.getElementById("modalTitle").textContent = "Adicionar Movimentação";
  document.getElementById("movimentacaoForm").reset();
  const modal = new bootstrap.Modal(document.getElementById("movimentacaoModal"));
  modal.show();
}

function editMovimentacao(id) {
  const mov = movimentacoes.find(m => m.id === id);
  if (!mov) return;

  editingMovimentacaoId = id;
  document.getElementById("modalTitle").textContent = "Editar Movimentação";
  document.getElementById("valor").value = mov.valor;
  document.getElementById("tipo").value = mov.tipo;
  document.getElementById("data_movimentacao").value = new Date(mov.data_movimentacao).toISOString().slice(0,16);
  document.getElementById("categoria").value = mov.categoria;
  document.getElementById("descricao").value = mov.descricao || "";
  document.getElementById("contraparte").value = mov.contraparte || "";

  const modal = new bootstrap.Modal(document.getElementById("movimentacaoModal"));
  modal.show();
}

async function saveMovimentacao() {
  const form = document.getElementById("movimentacaoForm");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = {
    valor: parseFloat(document.getElementById("valor").value),
    tipo: document.getElementById("tipo").value,
    data_movimentacao: document.getElementById("data_movimentacao").value.replace('T', ' '),
    categoria: document.getElementById("categoria").value,
    descricao: document.getElementById("descricao").value,
    contraparte: document.getElementById("contraparte").value,
    usuario_id: currentUser.usuario_id,
  };

  if (editingMovimentacaoId) data.id = editingMovimentacaoId;

  try {
    const url = editingMovimentacaoId ? `${API_BASE_URL}/atualizar_movimentacao` : `${API_BASE_URL}/adicionar_movimentacao`;
    const method = editingMovimentacaoId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      bootstrap.Modal.getInstance(document.getElementById("movimentacaoModal")).hide();
      loadMovimentacoes();
    } else {
      const err = await response.json();
      alert("Erro: " + (err.erro || "Erro desconhecido"));
    }
  } catch(e) {
    console.log(e)
    alert("Erro de conexão. Tente novamente.");
  }
}

async function deleteMovimentacao(id) {
  if (!confirm("Tem certeza que deseja excluir esta movimentação?")) return;
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/excluir_movimentacao`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ movimentacao_id: id, usuario_id: currentUser.usuario_id })
    });

    if (response.ok) {
      loadMovimentacoes();
    } else {
      const err = await response.json();
      alert("Erro: " + (err.erro || "Erro desconhecido"));
    }
  } catch {
    alert("Erro de conexão. Tente novamente.");
  }
}

window.editMovimentacao = editMovimentacao;
window.deleteMovimentacao = deleteMovimentacao;
