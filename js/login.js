
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginForm").addEventListener("submit", handleLogin);
});

async function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch(`${AUTH_USER_URL}`, {
      method: POST,
      headers: HEADERS,
      body: JSON.stringify({ username, senha: password })
    });

    const {data} = await response.json();

    const loginError = document.getElementById("loginError")

    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "dashboard.html";
    } else {
      loginError.textContent = data.erro || ERRO_LOGIN;
      loginError.classList.remove("d-none");
    }
  } catch {
    loginError.textContent = ERRO_CONEXAO;
    loginError.classList.remove("d-none");
  }
}
