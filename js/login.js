const API_BASE_URL = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginForm").addEventListener("submit", handleLogin);
});

async function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch(`${API_BASE_URL}/autenticar_usuario`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, senha: password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("loginError").textContent = data.erro || "Erro ao fazer login";
      document.getElementById("loginError").classList.remove("d-none");
    }
  } catch {
    document.getElementById("loginError").textContent = "Erro de conexão. Tente novamente.";
    document.getElementById("loginError").classList.remove("d-none");
  }
}
