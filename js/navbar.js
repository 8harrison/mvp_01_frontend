class AppNavbar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
          <a class="navbar-brand" href="index.html">
            <i class="fas fa-wallet me-2"></i>Finanças Pessoais
          </a>
          <!-- 🔹 Botão hambúrguer -->
          <button class="navbar-toggler" type="button"
                  data-bs-toggle="collapse" data-bs-target="#navbarNav"
                  aria-controls="navbarNav" aria-expanded="false" aria-label="Alternar navegação">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto" id="nav-links">
              <li class="nav-item"><a class="nav-link" href="login.html">Login</a></li>
              <li class="nav-item"><a class="nav-link" href="registro.html">Registrar</a></li>
              <li class="nav-item d-none"><a class="nav-link" href="dashboard.html">Dashboard</a></li>
              <li class="nav-item d-none"><a class="nav-link" href="#" id="logoutBtn">Sair</a></li>
            </ul>
          </div>
        </div>
      </nav>
    `;

    this.setupAuth();
  }

  setupAuth() {
    const user = localStorage.getItem("user");
    const navLinks = this.querySelector("#nav-links");
    const login = navLinks.querySelector('a[href="login.html"]')
    const registro = navLinks.querySelector('a[href="registro.html"]')
    const dashboard = navLinks.querySelector('a[href="dashboard.html"]')
    const logout = navLinks.querySelector("#logoutBtn")

    if (user) {
      login.parentElement.classList.add("d-none");
      registro.parentElement.classList.add("d-none");
      dashboard.parentElement.classList.remove("d-none");
      logout.parentElement.classList.remove("d-none");
    } else {
      login.parentElement.classList.remove("d-none");
      registro.parentElement.classList.remove("d-none");
      dashboard.parentElement.classList.add("d-none");
      logout.parentElement.classList.add("d-none");

      if (window.location.pathname.endsWith("dashboard.html")) {
        window.location.href = "login.html";
      }
    }

    logout?.addEventListener("click", () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "login.html";
    });
  }
}

customElements.define("app-navbar", AppNavbar);
