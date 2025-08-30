document.addEventListener("DOMContentLoaded", () => {
  // carregar navbar dinâmica
  fetch("partials/navbar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("navbar-container").innerHTML = html;

      const user = localStorage.getItem("user");
      const navLinks = document.getElementById("nav-links");

      if (user) {
        // mostra dashboard e sair
        navLinks.querySelector('a[href="login.html"]').parentElement.classList.add("d-none");
        navLinks.querySelector('a[href="registro.html"]').parentElement.classList.add("d-none");
        navLinks.querySelector('a[href="dashboard.html"]').parentElement.classList.remove("d-none");
        navLinks.querySelector('#logoutBtn').parentElement.classList.remove("d-none");
      } else {
        // mostra login e registro
        navLinks.querySelector('a[href="login.html"]').parentElement.classList.remove("d-none");
        navLinks.querySelector('a[href="registro.html"]').parentElement.classList.remove("d-none");
        navLinks.querySelector('a[href="dashboard.html"]').parentElement.classList.add("d-none");
        navLinks.querySelector('#logoutBtn').parentElement.classList.add("d-none");

        // protege dashboard
        if (window.location.pathname.endsWith("dashboard.html")) {
          window.location.href = "login.html";
        }
      }

      // logout
      document.getElementById("logoutBtn")?.addEventListener("click", () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.location.href = "login.html";
      });
    });
});
