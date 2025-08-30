class MovimentacaoCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["data-movimentacao"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get movimentacao() {
    const data = this.getAttribute("data-movimentacao");
    return data ? JSON.parse(data) : null;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR")
    );
  }

  render() {
    const mov = this.movimentacao;
    if (!mov) return;

    this.setAttribute("data-type", mov.tipo.toLowerCase())
    this.classList.add("col-md-6","col-lg-4")

    const cardClass = mov.tipo === "ENTRADA" ? "card-entrada" : "card-saida";
    const valorClass = mov.tipo === "ENTRADA" ? "entrada" : "saida";
    const icon = mov.tipo === "ENTRADA" ? "fa-arrow-up" : "fa-arrow-down";

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="css/style.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <div class="card ${cardClass}">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title">${mov.categoria}</h5>
              <div class="movimentacao-valor ${valorClass}">
                <i class="fas ${icon} me-1"></i>R$ ${mov.valor.toFixed(2)}
              </div>
            </div>
            <p class="card-text descricao" title="${
              mov.descricao || "Sem descrição"
            }">
              ${mov.descricao || "Sem descrição"}
            </p>
            <p class="card-text"><small class="text-muted">${this.formatDate(
              mov.data_movimentacao
            )}</small></p>
            <p class="card-text"><small class="text-muted">Contraparte: ${
              mov.contraparte || "Não informada"
            }</small></p>
            <div class="d-flex justify-content-end">
              <button class="btn btn-sm btn-outline-primary me-2" data-action="edit" data-id="${
                mov.id
              }">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${
                mov.id
              }">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
    `;

    this.shadowRoot.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.action;
        const id = parseInt(btn.dataset.id);
        this.dispatchEvent(
          new CustomEvent(`movimentacao-${action}`, {
            detail: { id, movimentacao: mov },
            bubbles: true,
          })
        );
      });
    });
  }
}

customElements.define("movimentacao-card", MovimentacaoCard);
