const usuario = JSON.parse(localStorage.getItem("user"));
const usuarioId = usuario['usuario_id']
let pizzaChart, barChart;

document.addEventListener("DOMContentLoaded", () => {
  if (!usuarioId) {
    alert("Usuário não autenticado.");
    window.location.href = "login.html";
    return;
  }

  initFilters();
  loadResumos();
});

function initFilters() {
  const mesSelect = document.getElementById("mesSelect");
  const anoSelect = document.getElementById("anoSelect");

  const hoje = new Date();
  const mesAtual = hoje.getMonth() + 1;
  const anoAtual = hoje.getFullYear();

  // meses
  const meses = [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
  ];
  meses.forEach((nome, idx) => {
    const opt = document.createElement("option");
    opt.value = idx + 1;
    opt.text = nome;
    if (idx + 1 === mesAtual) opt.selected = true;
    mesSelect.appendChild(opt);
  });

  // anos (últimos 5)
  for (let ano = anoAtual; ano >= anoAtual - 5; ano--) {
    const opt = document.createElement("option");
    opt.value = ano;
    opt.text = ano;
    if (ano === anoAtual) opt.selected = true;
    anoSelect.appendChild(opt);
  }

  mesSelect.addEventListener("change", loadResumos);
  anoSelect.addEventListener("change", loadResumos);
  document.getElementById("tipoSelect").addEventListener("change", loadResumos);
}

async function loadResumos() {
  const mes = document.getElementById("mesSelect").value;
  const ano = document.getElementById("anoSelect").value;
  const tipo = document.getElementById("tipoSelect").value;

  try {
    const resp = await fetch(`${GET_RESUMOS_URL}?usuario_id=${usuarioId}&mes=${mes}&ano=${ano}`);
    if (!resp.ok) throw new Error("Erro ao carregar resumos");

    const { data } = await resp.json();

    renderPizzaChart(data, tipo);
    renderBarChart(data);

  } catch (err) {
    console.error("Erro:", err);
    alert("Erro ao carregar resumos.");
  }
}

function renderPizzaChart(data, tipo) {
  const ctx = document.getElementById("pizzaChart").getContext("2d");

  // filtra apenas pelo tipo (ENTRADA ou SAIDA)
  const filtrado = data.filter(item => item.tipo === tipo);

  const labels = filtrado.map(item => item.categoria);
  const valores = filtrado.map(item => item.valor_total);

  if (pizzaChart) pizzaChart.destroy();

  pizzaChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data: valores,
        backgroundColor: [
          "#3498db","#e74c3c","#2ecc71","#9b59b6","#f1c40f",
          "#1abc9c","#e67e22","#34495e","#7f8c8d","#d35400"
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
}

function renderBarChart(data) {
  const ctx = document.getElementById("barChart").getContext("2d");

  const totalEntradas = data
    .filter(item => item.tipo === "ENTRADA")
    .reduce((sum, item) => sum + Number(item.valor_total), 0);

  const totalSaidas = data
    .filter(item => item.tipo === "SAIDA")
    .reduce((sum, item) => sum + Number(item.valor_total), 0);

  if (barChart) barChart.destroy();

  barChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Entradas", "Saídas"],
      datasets: [{
        label: "R$",
        data: [totalEntradas, totalSaidas],
        backgroundColor: ["#2ecc71", "#e74c3c"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
