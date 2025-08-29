const API_BASE_URL = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("registerForm").addEventListener("submit", handleRegister);
});

async function handleRegister(e) {
  e.preventDefault();

  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;
  const saldo = document.getElementById("registerSaldo").value || 0;

  try {
    const response = await fetch(`${API_BASE_URL}/registrar_usuario`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, senha: password, saldo: parseFloat(saldo) })
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("registerSuccess").textContent = "Usuário registrado com sucesso!";
      document.getElementById("registerSuccess").classList.remove("d-none");
      document.getElementById("registerError").classList.add("d-none");
      document.getElementById("registerForm").reset();
    } else {
      document.getElementById("registerError").textContent = data.erro || "Erro ao registrar usuário";
      document.getElementById("registerError").classList.remove("d-none");
      document.getElementById("registerSuccess").classList.add("d-none");
    }
  } catch {
    document.getElementById("registerError").textContent = "Erro de conexão. Tente novamente.";
    document.getElementById("registerError").classList.remove("d-none");
    document.getElementById("registerSuccess").classList.add("d-none");
  }
}
