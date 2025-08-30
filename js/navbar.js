class AppNavbar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
          <a class="navbar-brand" href="index.html">
            <i class="fas fa-wallet me-2"></i>Finanças Pessoais
          </a>
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

    if (user) {
      navLinks.querySelector('a[href="login.html"]').parentElement.classList.add("d-none");
      navLinks.querySelector('a[href="registro.html"]').parentElement.classList.add("d-none");
      navLinks.querySelector('a[href="dashboard.html"]').parentElement.classList.remove("d-none");
      navLinks.querySelector("#logoutBtn").parentElement.classList.remove("d-none");
    } else {
      navLinks.querySelector('a[href="login.html"]').parentElement.classList.remove("d-none");
      navLinks.querySelector('a[href="registro.html"]').parentElement.classList.remove("d-none");
      navLinks.querySelector('a[href="dashboard.html"]').parentElement.classList.add("d-none");
      navLinks.querySelector("#logoutBtn").parentElement.classList.add("d-none");

      if (window.location.pathname.endsWith("dashboard.html")) {
        window.location.href = "login.html";
      }
    }

    this.querySelector("#logoutBtn")?.addEventListener("click", () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "login.html";
    });
  }
}

customElements.define("app-navbar", AppNavbar);
