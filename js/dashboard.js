let currentUser = null;
let movimentacoes = [];
let editingMovimentacaoId = null;

function getValueById(elementId) {
  return document.getElementById(elementId).value;
}

function setValueById(elementId, value) {
  document.getElementById(elementId).value = value;
}

function setTextContentById(elementId, text) {
  document.getElementById(elementId).textContent = text;
}

// Carregar usuário logado
document.addEventListener("DOMContentLoaded", () => {
  currentUser = JSON.parse(localStorage.getItem("user"));
  if (currentUser) {
    loadMovimentacoes();
  }

  document
    .getElementById("addMovimentacaoBtn")
    .addEventListener("click", showAddMovimentacaoModal);
  document
    .getElementById("saveMovimentacaoBtn")
    ?.addEventListener("click", saveMovimentacao);

  document.querySelectorAll(".filter-buttons button").forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");
      filterMovimentacoes(filter);

      document
        .querySelectorAll(".filter-buttons button")
        .forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
    });
  });
});

async function getMovimentacoes(userId) {
  return await fetch(`${GET_MOV_URL}?usuario_id=${userId}`);
}

async function loadMovimentacoes() {
  try {
    const userId = currentUser.usuario_id;

    const response = await getMovimentacoes(userId);

    if (response.ok) {
      const { data } = await response.json();
      currentUser.saldo = data.saldo;
      movimentacoes = data.movimentacoes || [];
      renderMovimentacoes();
      updateDashboardStats();
    } else {
      console.error(ERRO_CAR_MOV);
    }
  } catch (error) {
    console.error(ERRO_CONEXAO, error);
  }
}

function renderMovimentacoes() {
  const list = document.getElementById("movimentacoesList");
  list.innerHTML = "";

  if (movimentacoes.length === 0 || !movimentacoes) {
    list.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-receipt fa-3x mb-3 text-muted"></i>
        <h4 class="text-muted">Nenhuma movimentação encontrada</h4>
        <p>Adicione sua primeira movimentação clicando em "Nova Movimentação"</p>
      </div>
    `;
    return;
  }

  movimentacoes.forEach((mov) => {
    const card = document.createElement("movimentacao-card");
    card.setAttribute("data-movimentacao", JSON.stringify(mov));

    // ouvir eventos do card
    card.addEventListener("movimentacao-edit", (e) => {
      editMovimentacao(e.detail.id);
    });

    card.addEventListener("movimentacao-delete", (e) => {
      deleteMovimentacao(e.detail.id);
    });

    list.appendChild(card);
  });
}

function filterMovimentacoes(filter) {
  document.querySelectorAll("movimentacao-card").forEach((card) => {
    const mov = card.movimentacao;
    card.style.display =
      filter === "todos" || mov.tipo.toLowerCase() === filter
        ? "block"
        : "none";
  });
}

function updateDashboardStats() {
  const saldoAtual = currentUser?.saldo || 0;
  const entradas = movimentacoes
    .filter((m) => m.tipo === "ENTRADA")
    .reduce((s, m) => s + m.valor, 0);
  const saidas = movimentacoes
    .filter((m) => m.tipo === "SAIDA")
    .reduce((s, m) => s + m.valor, 0);

  setTextContentById("saldoAtual", `R$ ${saldoAtual.toFixed(2)}`);
  setTextContentById("totalEntradas", `R$ ${entradas.toFixed(2)}`);
  setTextContentById("totalSaidas", `R$ ${saidas.toFixed(2)}`);
}

function showAddMovimentacaoModal() {
  editingMovimentacaoId = null;
  setTextContentById(MODAL_ID, ADD_MOV_TXT);
  document.getElementById(MOV_FOR_ID).reset();
  const modal = new bootstrap.Modal(document.getElementById(MOV_MOD_ID));
  modal.show();
}

function editMovimentacao(id) {
  const mov = movimentacoes.find((m) => m.id === id);
  if (!mov) return;

  const formatedDate = new Date(mov.data_movimentacao)
    .toISOString()
    .slice(0, 16);

  editingMovimentacaoId = id;
  setTextContentById(MODAL_ID, UPD_MOV_TXT);
  setValueById(VALOR_ID, mov.valor);
  setValueById(TIPO_ID, mov.tipo);
  setValueById(DATA_MOVIMENTACAO_ID, formatedDate);
  setValueById(CATEGORIA_ID, mov.categoria);
  setValueById(DESCRICAO_ID, mov.descricao || "");
  setValueById(CONTRAPARTE_ID, mov.contraparte || "");

  const modal = new bootstrap.Modal(document.getElementById(MOV_MOD_ID));
  modal.show();
}
function formatDateToApi(date) {
  date.replace("T", " ");
}
async function saveMovimentacao() {
  const form = document.getElementById(MOV_FOR_ID);
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = {
    valor: parseFloat(getValueById(VALOR_ID)),
    tipo: getValueById(TIPO_ID),
    data_movimentacao: formatDateToApi(getValueById(DATA_MOVIMENTACAO_ID)),
    categoria: getValueById(CATEGORIA_ID),
    descricao: getValueById(DESCRICAO_ID),
    contraparte: getValueById(CONTRAPARTE_ID),
    usuario_id: currentUser.usuario_id,
  };

  if (editingMovimentacaoId) data.id = editingMovimentacaoId;

  try {
    const url = editingMovimentacaoId
      ? `${UPDATE_MOV_URL}`
      : `${CREATE_MOV_URL}`;
    const method = editingMovimentacaoId ? PUT : POST;

    const response = await fetch(url, {
      method,
      headers: HEADERS,
      body: JSON.stringify(data),
    });

    if (response.ok) {
      bootstrap.Modal.getInstance(document.getElementById(MOV_MOD_ID)).hide();
      loadMovimentacoes();
    } else {
      const err = await response.json();
      alert(ERRO + (err.erro || ERRO_DESCONHECIDO));
    }
  } catch (e) {
    alert(ERRO_CONEXAO);
  }
}

async function deleteMovimentacao(id) {
  if (!confirm(CONF_EXCL_MOV)) return;
  try {
    const response = await fetch(
      `${DELETE_MOV_URL}?movimentacao_id=${id}&usuario_id=${currentUser.usuario_id}`,
      {
        method: DELETE,
        headers: HEADERS,
      }
    );

    if (response.ok) {
      loadMovimentacoes();
    } else {
      const err = await response.json();
      alert(ERRO + (err.erro || ERRO_DESCONHECIDO));
    }
  } catch {
    alert(ERRO_CONEXAO);
  }
}

window.editMovimentacao = editMovimentacao;
window.deleteMovimentacao = deleteMovimentacao;
window.getValueById = getValueById;
window.setValueById = setValueById;
window.setTextContentById = setTextContentById;
