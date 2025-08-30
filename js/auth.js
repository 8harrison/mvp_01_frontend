document.addEventListener("DOMContentLoaded", () => {
  // carregar navbar dinâmica
  fetch("partials/navbar.html")
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("navbar-container").innerHTML = html;

      const user = localStorage.getItem("user");
      const navLinks = document.getElementById("nav-links");
      const login = navLinks.querySelector('a[href="login.html"]');
      const registro = navLinks.querySelector('a[href="registro.html"]');
      const dashboard = navLinks.querySelector('a[href="dashboard.html"]');
      const logout = navLinks.querySelector("#logoutBtn");

      if (user) {
        // mostra dashboard e sair
        login.parentElement.classList.add("d-none");
        registro.parentElement.classList.add("d-none");
        dashboard.parentElement.classList.remove("d-none");
        logout.parentElement.classList.remove("d-none");
      } else {
        // mostra login e registro
        login.parentElement.classList.remove("d-none");
        registro.parentElement.classList.remove("d-none");
        dashboard.parentElement.classList.add("d-none");
        logout.parentElement.classList.add("d-none");

        // protege dashboard
        if (window.location.pathname.endsWith("dashboard.html")) {
          window.location.href = "login.html";
        }
      }

      // logout
      logout?.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "login.html";
      });
    });
});
