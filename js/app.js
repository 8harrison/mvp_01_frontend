// Lógica principal da aplicação
const { querySelectorAll, getElementById, addEventListener } = document;

class App {
  loginForm = getElementById("loginForm");
  registerForm = getElementById("registerForm");
  addMovimentacaoBtn = getElementById("addMovimentacaoBtn");
  saveMovimentacaoBtn = getElementById("saveMovimentacaoBtn")

  static init() {
    // Configurar navegação
    querySelectorAll(".section-link").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const sectionId = this.getAttribute("data-section");
        App.showSection(sectionId);
      });
    });

    // Configurar formulários
    this.loginForm?.addEventListener("submit", Auth.handleLogin);
    this.registerForm?.addEventListener("submit", Auth.handleRegister);
    this.addMovimentacaoBtn?.addEventListener(
      "click",
      Movimentacoes.showAddMovimentacaoModal
    );
    this.saveMovimentacaoBtn?.addEventListener(
      "click",
      Movimentacoes.saveMovimentacao
    );

    // Configurar filtros
    querySelectorAll(".filter-buttons button")?.forEach((button) => {
      button.addEventListener("click", function () {
        const filter = this.getAttribute("data-filter");
        Movimentacoes.filterMovimentacoes(filter);

        // Ativar botão selecionado
        querySelectorAll(".filter-buttons button").forEach((btn) => {
          btn.classList.remove("active");
        });
        this.classList.add("active");
      });
    });

    // Verificar autenticação
    Auth.checkAuth();

    // Mostrar a seção de login por padrão se não estiver autenticado
    if (!window.currentUser) {
      App.showSection("login");
    }
  }

  static async showSection(sectionId) {
    // Carregar o conteúdo da seção
    try {
      const response = await fetch(`partials/${sectionId}.html`);
      const content = await response.text();

      getElementById("main-content").innerHTML = content;

      // Reconfigurar event listeners para os elementos carregados dinamicamente
      if (sectionId === "login") {
        this.loginForm.addEventListener("submit", Auth.handleLogin);
      } else if (sectionId === "registro") {
        this.registerForm.addEventListener("submit", Auth.handleRegister);
      } else if (sectionId === "dashboard") {
        this.addMovimentacaoBtn.addEventListener(
          "click",
          Movimentacoes.showAddMovimentacaoModal
        );

        // Configurar filtros
        querySelectorAll(".filter-buttons button").forEach((button) => {
          button.addEventListener("click", function () {
            const filter = this.getAttribute("data-filter");
            Movimentacoes.filterMovimentacoes(filter);

            querySelectorAll(".filter-buttons button").forEach((btn) => {
              btn.classList.remove("active");
            });
            this.classList.add("active");
          });
        });

        // Carregar movimentações se o usuário estiver autenticado
        if (window.currentUser) {
          Movimentacoes.loadMovimentacoes();
        }
      }
    } catch (error) {
      console.error("Erro ao carregar a seção:", error);
    }
  }
}

// Inicializar a aplicação quando o DOM estiver carregado
addEventListener("DOMContentLoaded", App.init);

// Funções globais para uso nos event listeners
window.editMovimentacao = Movimentacoes.editMovimentacao;
window.deleteMovimentacao = Movimentacoes.deleteMovimentacao;
