// Navegação entre screens
function goToScreen2() {
  document.getElementById("screen1").classList.add("hidden");
  document.getElementById("screen2").classList.remove("hidden");
}

function goToScreen1() {
  document.getElementById("screen2").classList.add("hidden");
  document.getElementById("screen1").classList.remove("hidden");
}

// Limpar todos os campos e resultados
function limparCampos() {
  const inputs = document.querySelectorAll("#screen2 input[type=number]");
  inputs.forEach((input) => (input.value = ""));
  const spans = document.querySelectorAll("#screen2 span");
  spans.forEach((span) => (span.textContent = "-"));
}

// Secção 1 - Lucro e lucro total com dividendos
function calcularLucro1() {
  let tp1 = parseFloat(document.getElementById("tp1_1").value);
  let tp2 = parseFloat(document.getElementById("tp2_1").value);
  let invest = parseFloat(document.getElementById("invest_1").value);
  let dividendo = parseFloat(document.getElementById("dividendo_1").value);

  if (!isNaN(tp1) && !isNaN(tp2) && !isNaN(invest) && !isNaN(dividendo)) {
    let lucro_valorizacao = (invest * (tp2 - tp1)) / tp1;
    let numero_acoes = invest / tp1;
    let lucro_dividendos = numero_acoes * dividendo;
    let lucro_total = lucro_valorizacao + lucro_dividendos;

    document.getElementById("lucro_valorizacao1").textContent =
      lucro_valorizacao.toFixed(2);
    document.getElementById("lucro_total1").textContent =
      lucro_total.toFixed(2);
  } else {
    document.getElementById("lucro_valorizacao1").textContent =
      "Preencha todos os campos.";
    document.getElementById("lucro_total1").textContent = "-";
  }
}

// Secção 2 - Investimento para lucro desejado (sem dividendos)
function calcularInvestimento2() {
  let tp1 = parseFloat(document.getElementById("tp1_2").value);
  let tp2 = parseFloat(document.getElementById("tp2_2").value);
  let lucro = parseFloat(document.getElementById("lucro_2").value);

  if (!isNaN(tp1) && !isNaN(tp2) && !isNaN(lucro)) {
    let invest = (lucro * tp1) / (tp2 - tp1);
    if (invest < 0) invest = 0;
    document.getElementById("invest2").textContent = invest.toFixed(2);
  } else {
    document.getElementById("invest2").textContent =
      "Preencha todos os campos.";
  }
}

// Secção 3 - Lucro e lucro total com dividendos (percentagem crescimento)
function calcularLucro3() {
  let tp1 = parseFloat(document.getElementById("tp1_3").value);
  let percent = parseFloat(document.getElementById("percent_3").value);
  let invest = parseFloat(document.getElementById("invest_3").value);
  let dividendo = parseFloat(document.getElementById("dividendo_3").value);

  if (!isNaN(tp1) && !isNaN(percent) && !isNaN(invest) && !isNaN(dividendo)) {
    let tp2 = tp1 * (1 + percent / 100);
    let lucro_valorizacao = (invest * (tp2 - tp1)) / tp1;
    let numero_acoes = invest / tp1;
    let lucro_dividendos = numero_acoes * dividendo;
    let lucro_total = lucro_valorizacao + lucro_dividendos;

    document.getElementById("lucro_valorizacao3").textContent =
      lucro_valorizacao.toFixed(2);
    document.getElementById("lucro_total3").textContent =
      lucro_total.toFixed(2);
  } else {
    document.getElementById("lucro_valorizacao3").textContent =
      "Preencha todos os campos.";
    document.getElementById("lucro_total3").textContent = "-";
  }
}
// Secção 4 - Lucro e lucro total (percentagem crescimento)
// Atualiza TP2 dinamicamente com base em TP1 e % Crescimento
function atualizarTP2_4() {
  const tp1 = parseFloat(document.getElementById("tp1_4").value);
  const percent = parseFloat(document.getElementById("percent_4").value);

  if (!isNaN(tp1) && !isNaN(percent)) {
    const tp2 = tp1 * (1 + percent / 100);
    document.getElementById("tp2_4").textContent = tp2.toFixed(2);
  } else {
    document.getElementById("tp2_4").textContent = "-";
  }
}

// Calcula o investimento necessário para obter o lucro desejado
function calcularInvestimento4() {
  const tp1 = parseFloat(document.getElementById("tp1_4").value);
  const percent = parseFloat(document.getElementById("percent_4").value);
  const lucro = parseFloat(document.getElementById("lucro_4").value);

  if (!isNaN(tp1) && !isNaN(percent) && !isNaN(lucro)) {
    const tp2 = tp1 * (1 + percent / 100);
    const invest = (lucro * tp1) / (tp2 - tp1);

    document.getElementById("tp2_4").textContent = tp2.toFixed(2);
    document.getElementById("invest4").textContent =
      invest < 0 ? "0.00" : invest.toFixed(2);
  } else {
    document.getElementById("invest4").textContent =
      "Preencha todos os campos.";
  }
}

// Registo do Service Worker (PWA)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then((reg) => console.log("SW registado!", reg))
    .catch((err) => console.error("SW falhou:", err));
}
//Botão +Info
function toggleInfo(id) {
  const info = document.getElementById(id);
  if (info.style.display === "none" || info.style.display === "") {
    info.style.display = "block";
  } else {
    info.style.display = "none";
  }
}
function mostrarSecao(secaoId) {
  document.getElementById("menuSecoes").classList.add("hidden");
  document.querySelectorAll("#screen2 > div").forEach((div) => {
    if (div.id.startsWith("secao")) {
      div.classList.add("hidden");
    }
  });
  document.getElementById(secaoId).classList.remove("hidden");
}

function voltarMenuSecoes() {
  document.querySelectorAll("#screen2 > div").forEach((div) => {
    if (div.id.startsWith("secao")) {
      div.classList.add("hidden");
    }
  });
  document.getElementById("menuSecoes").classList.remove("hidden");
}

function abrirSecao(num) {
  document.getElementById("screen2").classList.add("hidden");
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`sec${i}Screen`).classList.add("hidden");
  }
  document.getElementById(`sec${num}Screen`).classList.remove("hidden");
}

function voltarMenu() {
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`sec${i}Screen`).classList.add("hidden");
  }
  document.getElementById("screen2").classList.remove("hidden");
}

//Simulações
const simulacoes = [];

function guardarSimulacao(nomeAcao, tp1, tp2, valorInvestido) {
  const crescimento = ((tp2 - tp1) / tp1) * 100;
  const lucro = (tp2 - tp1) * (valorInvestido / tp1);

  const novaSimulacao = {
    nomeAcao,
    tp1,
    tp2,
    valorInvestido,
    lucro: parseFloat(lucro.toFixed(2)),
    crescimentoPercentual: parseFloat(crescimento.toFixed(2))
  };

  simulacoes.push(novaSimulacao);
  atualizarTabela();
  atualizarGrafico();
}

function atualizarTabela() {
  const corpoTabela = document.querySelector("#tabelaSimulacoes tbody");
  corpoTabela.innerHTML = "";

  simulacoes.forEach(sim => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${sim.nomeAcao}</td>
      <td>${sim.tp1}</td>
      <td>${sim.tp2}</td>
      <td>${sim.valorInvestido}</td>
      <td>${sim.lucro}</td>
      <td>${sim.crescimentoPercentual}%</td>
    `;
    corpoTabela.appendChild(linha);
  });
}

let grafico;

function atualizarGrafico() {
  const labels = simulacoes.map(s => s.nomeAcao);
  const dadosLucro = simulacoes.map(s => s.lucro);

  if (grafico) grafico.destroy();

  const ctx = document.getElementById("graficoLucro").getContext("2d");
  grafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Lucro (€)",
        data: dadosLucro,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function simularEGUardar() {
  const nome = document.getElementById("nomeAcao").value;
  const tp1 = parseFloat(document.getElementById("tp1").value);
  const tp2 = parseFloat(document.getElementById("tp2").value);
  const investimento = parseFloat(document.getElementById("investimento").value);

  if (!nome || isNaN(tp1) || isNaN(tp2) || isNaN(investimento)) {
    alert("Preenche todos os campos!");
    return;
  }

  guardarSimulacao(nome, tp1, tp2, investimento);
}


//Botão voltar
function voltarParaScreen2() {
  document.getElementById("screen-simulacoes").classList.add("hidden");
  document.getElementById("screen2").classList.remove("hidden");
}
