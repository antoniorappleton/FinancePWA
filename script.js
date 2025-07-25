// Firebase Configurações (substituir pelos teus dados reais)
const firebaseConfig = {
  apiKey: "AIzaSyDbSYjVwsOOnBjZe_X8y7gS-W4DhYqHEnE",
  authDomain: "appfinance-812b2.firebaseapp.com",
  projectId: "appfinance-812b2",
  storageBucket: "appfinance-812b2.firebasestorage.app",
  messagingSenderId: "383837988480",
  appId: "1:383837988480:web:dd114574838c6a9dbb2865",
};

// Registo do Service Worker (PWA)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then((reg) => console.log("SW registado!", reg))
    .catch((err) => console.error("SW falhou:", err));
}

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Navegação entre screens
function goToScreen2() {
  document.getElementById("screen1").classList.add("hidden");
  document.getElementById("screen2").classList.remove("hidden");
  document
    .getElementById("botoesSimulacaoRapida")
    .classList.add("hidden buttons");
}

function goToScreen1() {
  carregarTop10Crescimento();
  document.getElementById("screen2").classList.add("hidden");
  document.getElementById("screen1").classList.remove("hidden");
}

// Secção 1 - Lucro e lucro total com dividendos
setInterval(() => {
  carregarTop10Crescimento();
}, 30000); // 30 segundos (30000 milissegundos)

document.addEventListener("DOMContentLoaded", () => {
  carregarTop10Crescimento();
});

document.addEventListener("DOMContentLoaded", () => {
  carregarTop7("1s"); // Carrega ao abrir

  // Atualiza a cada 30 segundos
  setInterval(() => {
    carregarTop10Crescimento();
  }, 30000);
});

//top 10 empresas da Firebase Crescimento
function carregarTop10Crescimento(periodo = "1s") {
  const lista = document.getElementById("listaTop10");
  lista.innerHTML = "🔄 A carregar...";

  db.collection("acoesDividendos")
    .get()
    .then((querySnapshot) => {
      const acoes = [];

      querySnapshot.forEach((doc) => {
        const dados = doc.data();
        let crescimento = 0;

        if (periodo === "1s") crescimento = parseFloat(dados.taxaCrescimento_1s || 0);
        else if (periodo === "1m") crescimento = parseFloat(dados.taxaCrescimento_1m || 0);
        else if (periodo === "1ano") crescimento = parseFloat(dados.taxaCrescimento_1ano || 0);

        if (crescimento > 0) {
          acoes.push({
            nome: dados.nome,
            ticker: dados.ticker,
            crescimento: crescimento.toFixed(3),
          });
        }
      });

      const top10 = acoes
        .sort((a, b) => b.crescimento - a.crescimento)
        .slice(0, 10);

      if (top10.length === 0) {
        lista.innerHTML = "<li>😕 Nenhuma ação com crescimento positivo.</li>";
        return;
      }

      lista.innerHTML = top10
        .map((acao) => `<li><strong>${acao.nome}</strong> (${acao.ticker}) — +${acao.crescimento}%</li>`)
        .join("");
    })
    .catch((error) => {
      console.error("Erro ao carregar Top 10:", error);
      lista.innerHTML = "<li style='color:red;'>Erro ao carregar dados.</li>";
    });
}


//Botões filtro top semana/mes/ano
function carregarTop7(periodo) {
  const lista = document.getElementById("listaTopAcoes");
  lista.innerHTML = "🔄 A carregar...";

  db.collection("acoesDividendos")
    .get()
    .then((querySnapshot) => {
      const acoes = [];

      querySnapshot.forEach((doc) => {
        const dados = doc.data();
        let crescimento = null;

        if (periodo === "1s") crescimento = dados.taxaCrescimento_1s;
        else if (periodo === "1m") crescimento = dados.taxaCrescimento_1m;
        else if (periodo === "1ano") crescimento = dados.taxaCrescimento_1ano;

        if (typeof crescimento === "number" && crescimento > 0) {
          acoes.push({
            nome: dados.nome,
            ticker: dados.ticker,
            crescimento: crescimento.toFixed(3),
          });
        }
      });

      const top7 = acoes
        .sort((a, b) => b.crescimento - a.crescimento)
        .slice(0, 7);

      if (top7.length === 0) {
        lista.innerHTML = "<li>😕 Nenhuma ação com crescimento positivo.</li>";
        return;
      }

      lista.innerHTML = top7
        .map(
          (acao) =>
            `<li><strong>${acao.nome}</strong> (${acao.ticker}) — 📈 +${acao.crescimento}%</li>`
        )
        .join("");
    })
    .catch((error) => {
      console.error("Erro ao carregar top ações:", error);
      lista.innerHTML =
        "<li style='color:red;'>Erro ao carregar ações.</li>";
    });
}


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

// Atualiza % crescimento dinamicamente com base em TP1 e TP2 Crescimento

function atualizarTP2_2() {
  const tp1 = parseFloat(document.getElementById("tp1_2").value);
  const tp2 = parseFloat(document.getElementById("tp2_2").value);

  if (!isNaN(tp1) && !isNaN(tp2) && tp1 !== 0) {
    const percent = ((tp2 - tp1) / tp1) * 100;
    document.getElementById("percent_2").textContent = percent.toFixed(2) + "%";
  } else {
    document.getElementById("percent_2").textContent = "-";
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
  for (let i = 1; i <= 7; i++) {
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

//Fórmulas de Lucros
function guardarSimulacao(nomeAcao, tp1, tp2, valorInvestido, dividendo = 0) {
  const crescimento = ((tp2 - tp1) / tp1) * 100;
  const numeroAcoes = valorInvestido / tp1;
  const lucroValorizacao = (tp2 - tp1) * numeroAcoes;
  const lucroDividendos = numeroAcoes * dividendo;
  const lucroTotal = lucroValorizacao + lucroDividendos;

  const novaSimulacao = {
    nomeAcao,
    tp1,
    tp2,
    valorInvestido,
    lucro: parseFloat(lucroTotal.toFixed(3)),
    crescimentoPercentual: parseFloat(crescimento.toFixed(3)),
  };

  simulacoes.push(novaSimulacao);
  atualizarTabela();
  atualizarGrafico();
}

//Atualizar a Tabela
function atualizarTabela() {
  const corpoTabela = document.querySelector("#tabelaSimulacoes tbody");
  corpoTabela.innerHTML = "";

  simulacoes.forEach((sim, index) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${sim.nomeAcao}</td>
      <td>${sim.tp1}</td>
      <td>${sim.tp2}</td>
      <td>${sim.valorInvestido}</td>
      <td>${sim.lucro.toFixed(3)}</td>
      <td>${sim.crescimentoPercentual}%</td>
      <td>
        <button onclick="removerSimulacao(${index})">❌</button>
      </td>
      <td>
        <input type="checkbox" onchange="atualizarSomaLucros()" class="checkbox-lucro" data-lucro="${
          sim.lucro
        }">
      </td>
    `;
    corpoTabela.appendChild(linha);
  });

  atualizarSomaLucros(); // Atualiza o total sempre que a tabela é renderizada
}

function removerSimulacao(index) {
  simulacoes.splice(index, 1); // Remove 1 elemento na posição index
  atualizarTabela(); // Re-renderiza a tabela
  atualizarGrafico(); // Atualiza o gráfico com as simulações restantes
}

function atualizarSomaLucros() {
  const checkboxes = document.querySelectorAll(".checkbox-lucro");
  let total = 0;

  checkboxes.forEach((cb) => {
    if (cb.checked) {
      total += parseFloat(cb.dataset.lucro);
    }
  });

  mostrarTotalLucro(total);
}
function mostrarTotalLucro(valor) {
  let totalRow = document.getElementById("linha-total-lucro");

  if (!totalRow) {
    totalRow = document.createElement("tr");
    totalRow.id = "linha-total-lucro";
    totalRow.innerHTML = `
      <td colspan="4"><strong>Total Lucro Selecionado:</strong></td>
      <td colspan="4" id="valorTotalLucro"><strong>${valor.toFixed(3)} €</strong></td>
    `;
    document.querySelector("#tabelaSimulacoes tbody").appendChild(totalRow);
  } else {
    totalRow.querySelector(
      "#valorTotalLucro"
    ).innerHTML = `<strong>${valor.toFixed(3)} €</strong>`;
  }
}

let grafico;

function atualizarGrafico() {
  const labels = simulacoes.map((s) => s.nomeAcao);
  const dadosLucro = simulacoes.map((s) => s.lucro);

  if (grafico) grafico.destroy();

  const ctx = document.getElementById("graficoLucro").getContext("2d");
  grafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Lucro (€)",
          data: dadosLucro,
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}
//Botão Simular e Guardar para passar para o gráfico
function simularEGUardar() {
  document.querySelector(".tabela-scroll-wrapper")?.classList.remove("hidden");
  const nome = document.getElementById("nomeAcao").value;
  const tp1 = parseFloat(document.getElementById("tp1").value);
  const tp2 = parseFloat(document.getElementById("tp2").value);
  const investimento = parseFloat(
    document.getElementById("investimento").value
  );
  const dividendo = parseFloat(document.getElementById("dividendo").value || 0);

  if (!nome || isNaN(tp1) || isNaN(tp2) || isNaN(investimento)) {
    alert("Preenche todos os campos!");
    return;
  }

  guardarSimulacao(nome, tp1, tp2, investimento, dividendo);
}

function voltarMenu() {
  // Esconde todas as secções
  const secoes = document.querySelectorAll(".screen");
  secoes.forEach((secao) => secao.classList.add("hidden"));

  // Mostra apenas o menu principal
  document.getElementById("screen2").classList.remove("hidden");
  secoes.forEach((secao) => secao.classList.add("hidden"));

  document.getElementById("screen2").classList.remove("hidden");

  // 🔒 Esconde os botões de simulação rápida se estiverem visíveis
  const botoes = document.getElementById("botoesSimulacaoRapida");
  if (botoes) botoes.classList.add("hidden");
}

function limparCampos() {
  // Encontra a secção visível (sem a classe "hidden")
  const secaoVisivel = document.querySelector(".screen:not(.hidden)");

  if (secaoVisivel) {
    // Limpa todos os inputs do tipo number e text dentro da secção visível
    const inputs = secaoVisivel.querySelectorAll(
      "input[type=number], input[type=text]"
    );
    inputs.forEach((input) => (input.value = ""));

    // Limpa todos os spans com resultados dentro da secção visível
    const spans = secaoVisivel.querySelectorAll("span");
    spans.forEach((span) => {
      if (span.id) {
        span.textContent = "-";
      }
    });
  }
}

//secção 5 - Simulador
function abrirSecao(num) {
  document.getElementById("screen2").classList.add("hidden");
  for (let i = 1; i <= 6; i++) {
    document.getElementById(`sec${i}Screen`).classList.add("hidden");
  }
  document.getElementById(`sec${num}Screen`).classList.remove("hidden");

  // 🔄 Garante que os botões de simulação rápida estão sempre escondidos ao entrar no screen 5
  if (num === 5) {
    const botoes = document.getElementById("botoesSimulacaoRapida");
    if (botoes && !botoes.classList.contains("hidden")) {
      botoes.classList.add("hidden");
    }
  }
}

function prepararSimulacao(nome, valorStock, dividendo) {
  console.log(
    "Preparar simulação para:",
    nome,
    "a TP1",
    valorStock,
    "com dividendo:",
    dividendo
  );
  abrirSecao(5); // Vai para screen simulação
  document.getElementById("nomeAcao").value = nome;

  // Mostra os botões de simulação rápida
  const botoes = document.getElementById("botoesSimulacaoRapida");
  if (botoes) {
    botoes.classList.remove("hidden");
  }
}

// 🚨 NOVO: Limpar Gráfico
function limparGrafico() {
  simulacoes.length = 0; // Apaga todas as simulações
  atualizarTabela(); // Atualiza a tabela (fica vazia)

  if (grafico) {
    grafico.destroy(); // Destrói o gráfico existente
    grafico = null;
  }
}

//Enviar Email
function abrirPopupEmail() {
  document.getElementById("popupSimulacao").classList.add("hidden");
  const popup = document.getElementById("popupEmail");
  popup.classList.remove("hidden");

  const dadosDiv = document.getElementById("dadosSimulacao");

  if (simulacoes.length > 0) {
    let html = "<h4>Simulações Guardadas:</h4>";
    simulacoes.forEach((sim, index) => {
      html += `
        <p><strong>Simulação ${index + 1}</strong></p>
        <p>Ação: ${sim.nomeAcao}</p>
        <p>Preço Inicial: €${sim.tp1}</p>
        <p>Preço Final: €${sim.tp2}</p>
        <p>Investimento: €${sim.valorInvestido}</p>
        <p>Lucro: €${sim.lucro}</p>
        <p>Crescimento: ${sim.crescimentoPercentual}%</p>
        <hr>
      `;
    });
    dadosDiv.innerHTML = html;
  } else {
    dadosDiv.innerHTML = "<p>Sem simulações disponíveis.</p>";
  }
}

function fecharPopupEmail() {
  document.getElementById("popupEmail").classList.add("hidden");
}

//Enviar Email
function enviarEmail() {
  const emailDestino = document.getElementById("emailDestino").value;

  if (!emailDestino || simulacoes.length === 0) {
    alert("Preenche o email e faz pelo menos uma simulação.");
    return;
  }

  const assunto = encodeURIComponent("Resumo de Simulações Financeiras");

  let corpoTexto = "Resumo das Simulações:\n\n";

  simulacoes.forEach((sim, index) => {
    corpoTexto += `Simulação ${index + 1}:\n`;
    corpoTexto += `Ação: ${sim.nomeAcao}\n`;
    corpoTexto += `Preço Inicial: €${sim.tp1}\n`;
    corpoTexto += `Preço Final: €${sim.tp2}\n`;
    corpoTexto += `Investimento: €${sim.valorInvestido}\n`;
    corpoTexto += `Lucro: €${sim.lucro}\n`;
    corpoTexto += `Crescimento: ${sim.crescimentoPercentual}%\n\n`;
  });

  const corpo = encodeURIComponent(corpoTexto);
  const mailtoLink = `mailto:${emailDestino}?subject=${assunto}&body=${corpo}`;
  window.location.href = mailtoLink;
}

//Menu 6 - Registar/Editar e Filtrar Empresas com Dividendos

let acoesSelecionadasParaBloco = [];

function selecionarAcao(acao) {
  acoesSelecionadasParaBloco.push(acao);
}
function simularAcoesSelecionadas() {
  calcularDistribuicao(); // já usa a variável global
}

//Botão secção dos filtros
function toggleFiltrosMes() {
  const filtrosDiv = document.getElementById("filtrosMesContainer");
  const botao = document.getElementById("btnMostrarFiltros");

  if (filtrosDiv.classList.contains("hidden")) {
    filtrosDiv.classList.remove("hidden");
    botao.textContent = "▲";
  } else {
    filtrosDiv.classList.add("hidden");
    botao.textContent = "▼";
  }
}

// Filtrar Base Dados Firebase por múltiplos critérios combinados
function filtrarAcoes() {
  const setor = document.getElementById("filtroSetor").value;
  const mercado = document.getElementById("filtroMercado").value;
  const mes = document.getElementById("filtroMes").value;
  const periodicidade = document.getElementById("filtroPeriodicidade").value;
  const nomeInput = document
    .getElementById("filtroNome")
    .value.trim()
    .toLowerCase();
  const tickerInput = document
    .getElementById("filtroTicker")
    .value.trim()
    .toLowerCase();

  const resultadoDiv = document.getElementById("resultadoFiltroMes");
  resultadoDiv.innerHTML = "A carregar...";

  db.collection("acoesDividendos")
    .get()
    .then((querySnapshot) => {
      let html = "<ul>";
      let count = 0;

      querySnapshot.forEach((doc) => {
        const dados = doc.data();

        const matchSetor =
          !setor ||
          dados.setor?.trim().toLowerCase() === setor.trim().toLowerCase();
        const matchMercado =
          !mercado ||
          dados.mercado?.trim().toLowerCase() === mercado.trim().toLowerCase();
        const matchMes =
          !mes || dados.mes?.trim().toLowerCase() === mes.trim().toLowerCase();
        const matchPeriodicidade =
          !periodicidade ||
          dados.periodicidade?.trim().toLowerCase() ===
            periodicidade.trim().toLowerCase();
        const matchNome =
          !nomeInput || dados.nome?.toLowerCase().includes(nomeInput);
        const matchTicker =
          !tickerInput || dados.ticker?.toLowerCase().includes(tickerInput);

        if (
          matchSetor &&
          matchMercado &&
          matchMes &&
          matchPeriodicidade &&
          matchNome &&
          matchTicker
        ) {
          const jaSelecionada = acoesSelecionadasParaBloco.some(
            (a) => a.ticker === dados.ticker
          );

          html += `
              <li>
                <input type="checkbox" class="checkbox-selecao"
                      onchange='atualizarSelecao(this)'
                      value='${JSON.stringify(dados)}' />
                <strong>${dados.nome}</strong> (${dados.ticker})<br>
                Setor: ${dados.setor} | Mercado: ${dados.mercado} | Dividendo: €${dados.dividendo} |
                Mês: ${dados.mes} | Periodicidade: ${dados.periodicidade} | Valor da Ação: €${dados.valorStock || "N/D"}<br>
              </li>
              `;
          count++;
        }
      });

      html += "</ul>";
      resultadoDiv.innerHTML =
        count > 0
          ? html
          : "<p>Nenhuma ação encontrada com os filtros aplicados.</p>";
    })
    .catch((error) => {
      console.error("Erro ao filtrar:", error);
      resultadoDiv.innerHTML =
        "<p style='color:red;'>Erro ao carregar dados.</p>";
    });
}

//Atualizar Seleccionadas
function atualizarSelecao(checkbox) {
  const dados = JSON.parse(checkbox.value);

  // Verifica se já está selecionada
  const index = acoesSelecionadasParaBloco.findIndex(
    (acao) => acao.ticker === dados.ticker
  );

  if (checkbox.checked) {
    if (index === -1) {
      acoesSelecionadasParaBloco.push(dados);
    }
  } else {
    if (index > -1) {
      acoesSelecionadasParaBloco.splice(index, 1);
    }
  }

  console.log("Selecionadas:", acoesSelecionadasParaBloco);
}

//Simular Ações Selecionadas
function prepararSimulacaoBloco() {
  if (!acoesSelecionadasParaBloco || acoesSelecionadasParaBloco.length === 0) {
    alert("⚠️ Nenhuma ação selecionada");
    return;
  }

  // Montar a tabela de ações
  const tabelaContainer = document.getElementById("tabelaAcoesSelecionadas");
  let html = `
    <table>
      <thead>
        <tr><th>Nome</th><th>Ticker</th><th>Valor (€)</th><th>Dividendo (€)</th></tr>
      </thead><tbody>
  `;
  acoesSelecionadasParaBloco.forEach((dados) => {
    html += `
      <tr>
        <td>${dados.nome}</td>
        <td>${dados.ticker}</td>
        <td>${dados.valorStock}</td>
        <td>${dados.dividendo}</td>
      </tr>
    `;
  });
  html += "</tbody></table>";
  tabelaContainer.innerHTML = html;

  // Abrir popup
  document.getElementById("popupSimulacaoBloco").classList.remove("hidden");

  // Forçar o cálculo inicial (caso já haja valor)
  calcularDistribuicao();
}

//Mostrar as ações selecionada
function preencherTabelaSimulacaoBloco(acoes) {
  const tbody = document.querySelector("#tabelaAcoesSelecionadas tbody");
  tbody.innerHTML = "";

  acoes.forEach((acao) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${acao.nome}</td>
      <td>${acao.ticker}</td>
      <td>€${acao.valorStock.toFixed(3)}</td>
      <td>€${acao.dividendo.toFixed(3)}</td>
    `;
    tbody.appendChild(linha);
  });
}

//Fechar popup Bloco
function fecharPopupSimulacaoBloco() {
  // 1. Fechar o popup
  document.getElementById("popupSimulacaoBloco").classList.add("hidden");

  // 2. Limpar a lista de ações selecionadas
  acoesSelecionadasParaBloco = [];

  // 3. Limpar o conteúdo da tabela de ações selecionadas
  document.getElementById("tabelaAcoesSelecionadas").innerHTML = "";

  // 4. Limpar o resultado da distribuição
  document.getElementById("resultadoDistribuicao").innerHTML = "";

  // 5. (Opcional) desmarcar checkboxes
  const checkboxes = document.querySelectorAll(".checkbox-selecao");
  checkboxes.forEach(cb => cb.checked = false);
}

let acoesParaSimulacao = []; // <-- isto deve estar fora das funções, no topo do ficheiro .js

//checkboxes para selecionar investimento completo ou parcelar
document.getElementById("usarTotal").addEventListener("change", () => {
    if (usarTotal.checked) {
      acoesCompletas.checked = false;
    }
    calcularDistribuicao();
  });

  document.getElementById("acoesCompletas").addEventListener("change", () => {
    if (acoesCompletas.checked) {
      usarTotal.checked = false;
    }
    calcularDistribuicao();
  });

  document.getElementById("investimentoTotal").addEventListener("input", calcularDistribuicao);

//Lucro máximo
function calcularDistribuicao() {
  const investimentoTotal = parseFloat(document.getElementById("investimentoTotal").value);
  const resultadoDiv = document.getElementById("resultadoDistribuicao");
  const usarTotal = document.getElementById("usarTotal").checked;
  const apenasCompletas = document.getElementById("acoesCompletas").checked;

  if (!investimentoTotal || investimentoTotal <= 0) {
    resultadoDiv.innerHTML = "<p style='color:red;'>⚠️ Introduz um valor de investimento válido.</p>";
    return;
  }

  if (!acoesSelecionadasParaBloco || acoesSelecionadasParaBloco.length === 0) {
    resultadoDiv.innerHTML = "<p style='color:red;'>⚠️ Nenhuma ação selecionada.</p>";
    return;
  }

  const tipoCrescimento = document.getElementById("periodoCrescimento").value || "taxaCrescimento_1s";

  // 1. Enriquecer ações com dados calculados
  const acoesComLucro = acoesSelecionadasParaBloco.map((acao) => {
    const preco = parseFloat(acao.valorStock || 0);
    const dividendo = parseFloat(acao.dividendo || 0);
    const taxa = parseFloat(acao[tipoCrescimento] || 0);
    const dividendoAnual = dividirPeriodicidade(dividendo, acao.periodicidade);
    const lucroUnidade = dividendoAnual + (preco * taxa / 100);
    const retornoPorEuro = lucroUnidade / preco;

    return {
      ...acao,
      preco,
      dividendoAnual,
      taxa,
      lucroUnidade,
      retornoPorEuro
    };
  });

  // 2. Calcular soma total de retorno por euro
  const totalRetornoPorEuro = acoesComLucro.reduce((sum, a) => sum + a.retornoPorEuro, 0);
  if (totalRetornoPorEuro === 0) {
    resultadoDiv.innerHTML = "<p style='color:red;'>⚠️ As ações selecionadas não têm retorno estimado.</p>";
    return;
  }

  let totalLucro = 0;
  let distribuicao = [];

  // 3. Distribuir o investimento proporcionalmente
  acoesComLucro.forEach((acao) => {
    const proporcao = acao.retornoPorEuro / totalRetornoPorEuro;
    let valorInvestido = investimentoTotal * proporcao;
    let qtd = valorInvestido / acao.preco;

    if (apenasCompletas) {
      qtd = Math.floor(qtd);
      valorInvestido = qtd * acao.preco;
    }

    const lucro = qtd * acao.lucroUnidade;
    totalLucro += lucro;

    if (qtd > 0) {
      distribuicao.push({
        nome: acao.nome,
        ticker: acao.ticker,
        quantidade: apenasCompletas ? qtd : qtd.toFixed(4),
        investido: valorInvestido.toFixed(3),
        lucro: lucro.toFixed(3),
        crescimento: `${acao.taxa.toFixed(3)}%`,
        dividendo: acao.dividendoAnual.toFixed(3)
      });
    }
  });

  // 4. Apresentar resultados
  let html = `
    <table>
      <thead>
        <tr>
          <th>Ação</th><th>Ticker</th><th>Qtd</th><th>Investido (€)</th><th>Lucro (€)</th><th>Tx Crescimento</th><th>Dividendo Anual</th>
        </tr>
      </thead>
      <tbody>
  `;

  distribuicao.forEach((linha) => {
    html += `<tr>
      <td>${linha.nome}</td>
      <td>${linha.ticker}</td>
      <td>${linha.quantidade}</td>
      <td>${linha.investido}</td>
      <td>${linha.lucro}</td>
      <td>${linha.crescimento}</td>
      <td>${linha.dividendo}</td>
    </tr>`;
  });

  html += `</tbody></table><p><strong>Lucro Total Estimado: €${totalLucro.toFixed(3)}</strong></p>`;
  resultadoDiv.innerHTML = html;
}

function dividirPeriodicidade(dividendo, periodicidade) {
  switch ((periodicidade || "").toLowerCase()) {
    case "mensal": return dividendo * 12;
    case "trimestral": return dividendo * 4;
    case "semestral": return dividendo * 2;
    case "anual": return dividendo;
    default: return dividendo; // fallback
  }
}


function abrirPopupFiltro() {
  filtrarAcoes(); // mostra todas as empresas
  const popup = document.getElementById("popupFiltro");
  popup.classList.remove("hidden");
  popup.classList.add("show");
}

function fecharPopupFiltro() {
  const popup = document.getElementById("popupFiltro");
  popup.classList.remove("show");
  popup.classList.add("hidden");
}

// preparar simulação do screen 6 para o 5
function prepararSimulacao(nome, valorStock, dividendo) {
  fecharPopupFiltro(); // fecha o popup ao simular
  console.log(
    "Preparar simulação para:",
    nome,
    "com dividendo:",
    dividendo,
    "e TP1:",
    valorStock
  );
  abrirSecao(5); // Vai para screen simulação

  document.getElementById("nomeAcao").value = nome;
  document.getElementById("dividendo").value = dividendo || 0;
  document.getElementById("tp1").value = valorStock || "";

  document.getElementById("tp2").value = "";
  document.getElementById("investimento").value = "";

  document.getElementById("botoesSimulacaoRapida").classList.remove("hidden");
}

// editar ação
function editarAcao(id, dados) {
  fecharPopupFiltro(); // fecha o popup ao editar
  idAcaoEmEdicao = id;
  document.getElementById("nomeAcaoReg").value = dados.nome || "";
  document.getElementById("tickerAcaoReg").value = dados.ticker || "";
  document.getElementById("Setor").value = dados.setor || "";
  document.getElementById("Mercado").value = dados.mercado || "";
  document.getElementById("valorDividendoReg").value = dados.dividendo || "";
  document.getElementById("mesDividendoReg").value = dados.mes || "";
  document.getElementById("periodicidade").value = dados.periodicidade || "";
}

//Função simularValorRapido(valor)
function simularValorRapido(valor) {
  const tp1 = parseFloat(document.getElementById("tp1").value);
  const tp2 = parseFloat(document.getElementById("tp2").value);
  const dividendo = parseFloat(document.getElementById("dividendo").value || 0);

  if (isNaN(tp1) || isNaN(tp2)) {
    alert("⚠️ Introduz TP1 e TP2 antes de simular.");
    return;
  }

  document.getElementById("investimento").value = valor;
  guardarSimulacao(
    document.getElementById("nomeAcao").value,
    tp1,
    tp2,
    valor,
    dividendo
  );

  // Esconde os botões após simular
  //document.getElementById("botoesSimulacaoRapida").classList.add("hidden");
}
//Quando clico no Botão Voltar no menu Simular
function voltarMenu() {
  // Esconde todas as secções
  const secoes = document.querySelectorAll(".screen");
  secoes.forEach((secao) => secao.classList.add("hidden"));

  // Mostra apenas o menu principal
  document.getElementById("screen2").classList.remove("hidden");

  // Esconde os botões de simulação rápida
  const botoes = document.getElementById("botoesSimulacaoRapida");
  if (botoes) botoes.classList.add("hidden");
}

//Use o ticker como ID do documento no Firestore (evita duplicações).
//Adicione o campo origem: "webapp" para rastrear a origem dos dados
//Use .set(..., { merge: true }) para atualizar ou criar o documento de forma segura.

let idAcaoEmEdicao = null;

function guardarOuAtualizarAcaoFirebase() {
  const nome = document.getElementById("nomeAcaoReg").value.trim();
  const ticker = document.getElementById("tickerAcaoReg").value.trim();
  const setor = document.getElementById("Setor").value.trim();
  const mercado = document.getElementById("Mercado").value.trim();
  const dividendo = parseFloat(
    document.getElementById("valorDividendoReg").value
  );
  const valorStock = parseFloat(document.getElementById("valorStock").value);
  const mes = document.getElementById("mesDividendoReg").value;
  const periodicidade = document.getElementById("periodicidade").value;

  if (
    !nome ||
    !ticker ||
    !setor ||
    !mercado ||
    isNaN(dividendo) ||
    isNaN(valorStock) ||
    !mes ||
    !periodicidade
  ) {
    alert("⚠️ Preenche todos os campos corretamente.");
    return;
  }

  const dadosAcao = {
    nome,
    ticker,
    setor,
    mercado,
    valorStock,
    dividendo,
    mes,
    periodicidade,
    origem: "webapp",
    timestamp: new Date(),
  };

  // Se estiver a editar, usa o ID do documento em edição; senão, usa o ticker como ID
  const docId = idAcaoEmEdicao || ticker;

  db.collection("acoesDividendos")
    .doc(docId)
    .set(dadosAcao, { merge: true }) // Cria ou atualiza sem apagar campos existentes
    .then(() => {
      alert(
        idAcaoEmEdicao
          ? "✅ Ação atualizada com sucesso!"
          : "✅ Ação guardada com sucesso na Firebase!"
      );
      limparCamposSec6();
      idAcaoEmEdicao = null;
    })
    .catch((error) => {
      console.error("Erro ao guardar/atualizar:", error);
      alert("❌ Erro ao guardar/atualizar. Verifica a ligação com a Firebase.");
    });
}

if (idAcaoEmEdicao) {
  // Atualizar ação existente
  db.collection("acoesDividendos")
    .doc(idAcaoEmEdicao)
    .update(dadosAcao)
    .then(() => {
      alert("✅ Ação atualizada com sucesso!");
      limparCamposSec6();
      idAcaoEmEdicao = null;
    })
    .catch((error) => {
      console.error("Erro ao atualizar:", error);
      alert("❌ Erro ao atualizar. Tenta novamente.");
    });
} else {
  // Guardar nova ação
  db.collection("acoesDividendos")
    .add(dadosAcao)
    .then(() => {
      alert("✅ Ação guardada com sucesso na Firebase!");
      limparCamposSec6();
    })
    .catch((error) => {
      console.error("Erro ao guardar ação:", error);
      alert(
        "❌ Ocorreu um erro ao guardar. Verifica a ligação com a Firebase."
      );
    });
}

//Eliminar um Registo
function eliminarAcao(id) {
  if (confirm("⚠️ Tens a certeza que queres eliminar esta ação?")) {
    db.collection("acoesDividendos")
      .doc(id)
      .delete()
      .then(() => {
        alert("✅ Ação eliminada com sucesso.");
        filtrarAcoes(); // Recarrega os resultados após eliminar
      })
      .catch((error) => {
        console.error("Erro ao eliminar ação:", error);
        alert("❌ Erro ao eliminar. Tenta novamente.");
      });
  }
}

function mostrarSecao(id) {
  document
    .querySelectorAll(".screen")
    .forEach((sec) => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

//Secção Reforço
function abrirPopupReforco() {
  document.getElementById("popupReforco").classList.remove("hidden");
}

function fecharPopupReforco() {
  document.getElementById("popupReforco").classList.add("hidden");
}

function calcularMediaPonderada() {
  const invest1 = parseFloat(
    document.getElementById("invest1").value.replace(",", ".")
  );
  const preco1 = parseFloat(
    document.getElementById("preco1").value.replace(",", ".")
  );
  const invest22 = parseFloat(
    document.getElementById("invest22").value.replace(",", ".")
  );
  const preco2 = parseFloat(
    document.getElementById("preco2").value.replace(",", ".")
  );

  if (
    !isNaN(invest1) &&
    !isNaN(preco1) &&
    !isNaN(invest22) &&
    !isNaN(preco2) &&
    preco1 > 0 &&
    preco2 > 0
  ) {
    const qtd1 = invest1 / preco1;
    const qtd2 = invest22 / preco2;
    const totalQtd = qtd1 + qtd2;
    const totalInvestido = invest1 + invest22;
    const precoMedio = totalInvestido / totalQtd;

    const html = `
      <p>📊 <strong>Preço Médio:</strong> ${precoMedio.toFixed(3)} €</p>
      <p>📦 <strong>Total de Ações:</strong> ${totalQtd.toFixed(3)}</p>
      <p>💰 <strong>Total Investido:</strong> ${totalInvestido.toFixed(3)} €</p>
    `;

    document.getElementById("resultadoReforco").innerHTML = html;
  } else {
    document.getElementById("resultadoReforco").innerHTML =
      "❌ Preencha todos os campos corretamente.";
  }
}
//Objetivo: Identificar, entre várias ações (com base em dados reais), qual é a mais provável de atingir
// um lucro X com um investimento Y, considerando o preço da ação, o dividendo anual e eventualmente uma previsão de valorização.

// Simulador de ações com base em investimento, crescimento esperado e lucro desejado

function abrirSimulador() {
  document.getElementById("simuladorModal").classList.remove("hidden");
}

function fecharSimulador() {
  document.getElementById("simuladorModal").classList.add("hidden");
}

async function simular() {
  const investimento = parseFloat(
    document.getElementById("inputInvestimento").value
  );
  const crescimentoEstimado =
    parseFloat(document.getElementById("inputCrescimento").value) || 0;
  const lucroDesejado =
    parseFloat(document.getElementById("inputLucro").value) || 0;

  const db = firebase.firestore();
  const acoesRef = db.collection("acoesDividendos");
  const snapshot = await acoesRef.get();

  let resultados = [];

  snapshot.forEach((doc) => {
    const acao = doc.data();

    let preco = parseFloat(acao.valorStock);
    let dividendo = parseFloat(acao.dividendo);

    if (!preco || preco <= 0 || isNaN(preco)) return;
    if (isNaN(dividendo)) dividendo = 0;

    const quantidade = Math.floor(investimento / preco);
    if (quantidade === 0) return;

    const lucroValorizacao = quantidade * preco * (crescimentoEstimado / 100);
    const lucroDividendos = quantidade * dividendo;
    const lucroTotal = lucroValorizacao + lucroDividendos;

    resultados.push({
      nome: acao.nome,
      preco,
      dividendo,
      quantidade,
      lucroValorizacao,
      lucroDividendos,
      lucroTotal,
      diferenca: Math.abs(lucroTotal - lucroDesejado),
    });
  });

  const resultado = document.getElementById("resultadoSimulacao");

  if (resultados.length === 0) {
    resultado.innerHTML =
      "<p>⚠️ Nenhuma ação válida para este investimento.</p>";
    return;
  }

  // Ordenar pelas mais próximas do lucro desejado (menor diferença absoluta)
  const topMaisProximas = resultados
    .sort((a, b) => a.diferenca - b.diferenca)
    .slice(0, 10);

  let html = `<h3>🔍 Top 10 mais próximas do lucro desejado (${lucroDesejado.toFixed(3)}€)</h3>`;

  topMaisProximas.forEach((acao, i) => {
    html += `
      <hr />
      <p><strong>Top ${i + 1}: ${acao.nome}</strong></p>
      <p>Preço atual: €${acao.preco.toFixed(3)}</p>
      <p>Dividendos: €${acao.dividendo.toFixed(3)} por ação</p>
      <p>Quantidade a comprar: ${acao.quantidade}</p>
      <p>Lucro com valorização: €${acao.lucroValorizacao.toFixed(3)}</p>
      <p>Lucro com dividendos: €${acao.lucroDividendos.toFixed(3)}</p>
      <p><strong>Lucro total estimado: €${acao.lucroTotal.toFixed(3)}</strong> (diferença: €${acao.diferenca.toFixed(3)})</p>
    `;
  });

  resultado.innerHTML = html;
}

function abrirPopupSimuladorGrafico() {
  document
    .getElementById("popupSimuladorGrafico")
    .classList.remove("popup hidden");
}

function fecharPopupSimuladorGrafico() {
  document
    .getElementById("popupSimuladorGrafico")
    .classList.add("popup hidden");
}

//TP2
function abrirSimuladorTP2() {
  document.getElementById("popupTP2").classList.remove("hidden");
}

function fecharSimuladorTP2() {
  document.getElementById("popupTP2").classList.add("hidden");
  document.getElementById("resultadoTP2").innerHTML = "";
  document.getElementById("tp1Input").value = "";
  document.getElementById("investimentoInput").value = "";
  document.getElementById("lucroDesejadoInput").value = "";
}

function calcularTP2() {
  const tp1 = parseFloat(document.getElementById("tp1Input").value);
  const investimento = parseFloat(document.getElementById("investimentoInput").value);
  const lucroDesejado = parseFloat(document.getElementById("lucroDesejadoInput").value);

  if (isNaN(tp1) || isNaN(investimento) || isNaN(lucroDesejado) || tp1 <= 0) {
    document.getElementById("resultadoTP2").innerHTML = "⚠️ Preenche todos os campos corretamente.";
    return;
  }

  const quantidade = investimento / tp1;
  const tp2 = calcularTp2(tp1, lucroDesejado, quantidade);
  const crescimento = ((tp2 - tp1) / tp1) * 100;

  document.getElementById("resultadoTP2").innerHTML = `
    💰 <strong>TP2:</strong> €${tp2.toFixed(3)}<br>
    📈 <strong>Taxa de crescimento:</strong> ${crescimento.toFixed(3)}%
  `;
}

function calcularTp2(precoCompra, lucroAlvo, quantidade) {
  if (!precoCompra || !lucroAlvo || !quantidade) return 0;
  return precoCompra + lucroAlvo / quantidade;
}



function abrirPopupSimulacao() {
  document.getElementById("popupSimulacao").classList.remove("hidden");
}

function fecharPopupSimulacao() {
  document.getElementById("popupSimulacao").classList.add("hidden");
}

//botão Somar Lucros
function somarLucros() {
  const corpoTabela = document.querySelector("#tabelaSimulacoes tbody");
  if (!corpoTabela) return;

  // Soma os lucros
  let totalLucro = 0;
  simulacoes.forEach((sim) => {
    totalLucro += Number(sim.lucro || 0);
  });

  // Remove linha de total anterior, se já existir
  const linhaAnterior = document.querySelector(".linha-total");
  if (linhaAnterior) linhaAnterior.remove();

  // Cria nova linha de total
  const linhaTotal = document.createElement("tr");
  linhaTotal.classList.add("linha-total");
  linhaTotal.style.fontWeight = "bold";
  linhaTotal.style.backgroundColor = "#d1f0d1"; // verde claro

  linhaTotal.innerHTML = `
    <td colspan="4" style="text-align:right;">Total de Lucros:</td>
    <td>${totalLucro.toFixed(2)} €</td>
    <td>-</td>
  `;

  corpoTabela.appendChild(linhaTotal);
}
function selecionarTudoCheckboxes(checkboxSelecionarTudo) {
  const checkboxes = document.querySelectorAll("#listaAcoesCheckbox .checkboxAcao");
  checkboxes.forEach(cb => {
    cb.checked = checkboxSelecionarTudo.checked;
  });
}
  //Registo de compra de acçoes
  collection(db, "ativos")
  function guardarCompraAcaoOuEtf() {
    const nome = document.getElementById("nomeAtivo").value.trim();
    const ticker = document.getElementById("tickerAtivo").value.trim().toUpperCase();
    const tipoAtivo = document.getElementById("tipoAtivo").value;
    const precoCompra = parseFloat(document.getElementById("precoCompra").value);
    const quantidade = parseFloat(document.getElementById("quantidade").value);
    const setor = document.getElementById("setorCompra").value.trim();
    const mercado = document.getElementById("mercadoCompra").value.trim();
    const tipoObjetivo = document.getElementById("tipoObjetivo").value;
    const objetivoFinanceiro = parseFloat(document.getElementById("objetivoFinanceiro").value);

    if (!nome || !ticker || isNaN(precoCompra) || isNaN(quantidade) || isNaN(objetivoFinanceiro)) {
      alert("⚠️ Preenche todos os campos obrigatórios.");
      return;
    }

    const dados = {
      nome,
      ticker,
      tipoAtivo,
      precoCompra,
      quantidade,
      setor,
      mercado,
      tipoObjetivo,
      objetivoFinanceiro
    };

    db.collection("ativos")
      .add(dados)
      .then(() => {
        alert("✅ Compra registada com sucesso!");
        // Limpar campos
        document.querySelectorAll("#sec7Screen input").forEach((el) => (el.value = ""));
      })
      .catch((error) => {
        console.error("Erro ao guardar:", error);
        alert("❌ Erro ao guardar dados.");
      });
  }

  //Analisar progresso do objetivo (por ticker)
  async function verificarProgressoObjetivo(tickerAtual) {
    try {
      // 1. Buscar a compra em 'ativos'
      const ativosSnapshot = await db
        .collection("ativos")
        .where("ticker", "==", tickerAtual.toUpperCase())
        .get();

      if (ativosSnapshot.empty) {
        alert("⚠️ Nenhum ativo encontrado com esse ticker.");
        return;
      }

      let totalInvestido = 0;
      let totalQuantidade = 0;
      let tipoObjetivo = "";
      let objetivoFinanceiro = 0;
      let nome = "";

      ativosSnapshot.forEach((doc) => {
        const data = doc.data();
        totalInvestido += data.precoCompra * data.quantidade;
        totalQuantidade += data.quantidade;
        tipoObjetivo = data.tipoObjetivo;
        objetivoFinanceiro = data.objetivoFinanceiro;
        nome = data.nome;
      });

      // 2. Buscar o preço atual na coleção 'acoesDividendos'
      const cotacaoSnap = await db.collection("acoesDividendos").doc(tickerAtual).get();
      if (!cotacaoSnap.exists) {
        alert("⚠️ Cotação não encontrada para esse ticker.");
        return;
      }

      const valorAtual = cotacaoSnap.data().valorStock;
      const valorTotalAtual = valorAtual * totalQuantidade;

      let progresso = 0;
      let mensagem = "";

      if (tipoObjetivo === "lucro") {
        const lucroAtual = valorTotalAtual - totalInvestido;
        progresso = (lucroAtual / objetivoFinanceiro) * 100;
        const lucroEmFalta = objetivoFinanceiro - lucroAtual;
        const tpNecessario = (totalInvestido + objetivoFinanceiro) / totalQuantidade;
        mensagem = `
          🎯 Objetivo: Lucro de €${objetivoFinanceiro.toFixed(3)}<br>
          📊 Progresso: ${progresso.toFixed(1)}%<br>
          💰 Preço atual: €${valorAtual.toFixed(3)}<br>
          🎯 Preço alvo necessário (TP2): €${tpNecessario.toFixed(3)}
        `;
      } else if (tipoObjetivo === "valorFinal") {
        progresso = (valorTotalAtual / objetivoFinanceiro) * 100;
        mensagem = `
          🎯 Objetivo: Valor final de €${objetivoFinanceiro.toFixed(3)}<br>
          📊 Progresso: ${progresso.toFixed(1)}%<br>
          💰 Valor atual da posição: €${valorTotalAtual.toFixed(3)}
        `;
      } else if (tipoObjetivo === "quantidade") {
        progresso = (totalQuantidade / objetivoFinanceiro) * 100;
        mensagem = `
          🎯 Objetivo: ${objetivoFinanceiro} unidades<br>
          📊 Progresso: ${progresso.toFixed(1)}%<br>
          💼 Já tens: ${totalQuantidade} unidades
        `;
      }

      document.getElementById("analiseResultados").innerHTML = `
        <h3>${nome} (${tickerAtual})</h3>
        <p>${mensagem}</p>
      `;
    } catch (error) {
      console.error("Erro ao analisar objetivo:", error);
      alert("❌ Erro ao consultar Firestore.");
    }
  }
  //função para mostrar situação atual:
  function analisarObjetivos(tickerAtual, precoAtual) {
    db.collection("ativos")
      .where("ticker", "==", tickerAtual.toUpperCase())
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          alert("⚠️ Nenhuma compra encontrada para esse ticker.");
          return;
        }

        let totalInvestido = 0;
        let totalQuantidade = 0;
        let objetivoFinanceiro = 0;
        let nomeAtivo = "";

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          totalInvestido += data.valorInvestido || 0; // corrigido: era 'totalInvestido'
          totalQuantidade += data.quantidade || 0;
          objetivoFinanceiro = data.objetivoFinanceiro || 0;
          nomeAtivo = data.nome;
        });

        const valorAtual = totalQuantidade * precoAtual;
        const lucroAtual = valorAtual - totalInvestido;
        const faltaParaObjetivo = objetivoFinanceiro - valorAtual;

        let html = `
          <h3>📈 Situação Atual: ${nomeAtivo} (${tickerAtual.toUpperCase()})</h3>
          <ul>
            <li><strong>Total Investido:</strong> €${totalInvestido.toFixed(3)}</li>
            <li><strong>Quantidade Total:</strong> ${totalQuantidade}</li>
            <li><strong>Preço Atual:</strong> €${precoAtual.toFixed(3)}</li>
            <li><strong>Valor Atual:</strong> €${valorAtual.toFixed(3)}</li>
            <li><strong>Lucro/Perda:</strong> €${lucroAtual.toFixed(3)}</li>
            <li><strong>Objetivo Financeiro:</strong> €${objetivoFinanceiro.toFixed(3)}</li>
        `;

        if (faltaParaObjetivo > 0) {
          const quantidadeNecessaria = faltaParaObjetivo / precoAtual;
          html += `<li style="color:orange;"><strong>⚠️ Para atingir o objetivo, investe mais €${faltaParaObjetivo.toFixed(3)} (${quantidadeNecessaria.toFixed(3)} unidades)</strong></li>`;
        } else {
          html += `<li style="color:green;"><strong>🎯 Objetivo já atingido!</strong></li>`;
        }

        html += `</ul>`;
        document.getElementById("analiseResultados").innerHTML = html;
      })
      .catch((error) => {
        console.error("❌ Erro na análise:", error);
        alert("Erro ao consultar dados do Firestore.");
      });
  }
  function obterPrecoAtualDoAtivo(ticker) {
    return fetch(`https://api.exemplo.com/preco?ticker=${ticker}`)
      .then((res) => res.json())
      .then((data) => data.precoAtual || null)
      .catch(() => null);
  }
  //lista de progressos
  async function listarProgressoDosAtivos() {
    const container = document.getElementById("listaProgressoAtivos");
    container.innerHTML = "🔄 A carregar...";

    try {
      const snapshot = await db.collection("ativos").get();
      if (snapshot.empty) {
        container.innerHTML = "❗ Não há ativos registados.";
        return;
      }

      const promessas = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        promessas.push(verificarProgressoDeItem(data));
      });

      const resultados = await Promise.all(promessas);
      container.innerHTML = resultados.join("<hr>");
    } catch (error) {
      console.error("Erro ao listar progresso:", error);
      container.innerHTML = "❌ Erro ao carregar progresso.";
    }
  }
  //Função mais importante dos Ativos e valorização
  async function verificarProgressoDeItem(data) {
  try {
    const cotacaoSnap = await db.collection("acoesDividendos").doc(data.ticker).get();

    if (!cotacaoSnap.exists) {
      return `<strong>${data.nome} (${data.ticker})</strong><br>❌ Cotação não encontrada.`;
    }

    const cotacao = cotacaoSnap.data();
    const valorAtual = cotacao.valorStock;

    const totalInvestido = data.precoCompra * data.quantidade;
    const valorTotalAtual = valorAtual * data.quantidade;
    const lucroRealizado = valorTotalAtual - totalInvestido;

    let progresso = 0;
    let mensagem = "";

    let crescimentoNecessario = 0;
    let tpNecessario = 0;
    const estimativas = [];

    if (data.tipoObjetivo === "lucro") {
      progresso = (lucroRealizado / data.objetivoFinanceiro) * 100;
      tpNecessario = (totalInvestido + data.objetivoFinanceiro) / data.quantidade;
      crescimentoNecessario = ((tpNecessario - valorAtual) / valorAtual) * 100;

      const crescimentoSemanal = cotacao.taxaCrescimento_1s;
      const crescimentoMensal = cotacao.taxaCrescimento_1m;
      const crescimentoAnual = cotacao.taxaCrescimento_1ano;

      if (crescimentoSemanal > 0) {
        const semanas = Math.ceil(crescimentoNecessario / crescimentoSemanal);
        estimativas.push(`📅 TP2 em ~${semanas} semanas`);
      } else {
        estimativas.push("❌ Sem taxa semanal");
      }

      if (crescimentoMensal > 0) {
        const meses = Math.ceil(crescimentoNecessario / crescimentoMensal);
        estimativas.push(`📅 TP2 em ~${meses} meses`);
      } else {
        estimativas.push("❌ Sem taxa mensal");
      }

      if (crescimentoAnual > 0) {
        const anos = Math.ceil(crescimentoNecessario / crescimentoAnual);
        estimativas.push(`📅 TP2 em ~${anos} anos`);
      } else {
        estimativas.push("❌ Sem taxa anual");
      }

      mensagem = `
        💼 <strong>Investido:</strong> €${totalInvestido.toFixed(3)}<br>
        💸 <strong>Lucro Realizado:</strong> €${lucroRealizado.toFixed(3)}<br><br>
        🎯 <strong>Lucro alvo:</strong> €${data.objetivoFinanceiro.toFixed(3)}<br>
        📈 <strong>Progresso:</strong> ${progresso.toFixed(1)}%<br>
        💰 <strong>Preço atual:</strong> €${valorAtual.toFixed(3)}<br>
        🎯 <strong>TP2 necessário:</strong> €${tpNecessario.toFixed(3)}<br>
        📊 <strong>Crescimento necessário:</strong> ${crescimentoNecessario.toFixed(3)}%<br>
        ${estimativas.join("<br>")}
      `;
    }

    return `<strong>${data.nome} (${data.ticker})</strong><br>${mensagem}`;
  } catch (err) {
    return `<strong>${data.nome} (${data.ticker})</strong><br>❌ Erro ao consultar cotação.`;
  }
}


  //JS para gerar linhas dinamicamente
  function mostrarProgressoAtivos(dadosAtivos) {
    const container = document.getElementById("listaProgressoAtivos");
    container.innerHTML = "";

    dadosAtivos.forEach((ativo) => {
      const {
        nomeAtivo,
        tickerAtivo,
        precoCompra,
        quantidade,
        tipoObjetivo,
        objetivoFinanceiro,
        valorStockAtual, // cotação atual
      } = ativo;

      // Calcula TP2 com base no objetivo
      const tp2 = tipoObjetivo === "lucro"
        ? calcularTp2(precoCompra, objetivoFinanceiro, quantidade)
        : objetivoFinanceiro;

      const progresso = valorStockAtual && tp2
        ? ((valorStockAtual - precoCompra) / (tp2 - precoCompra)) * 100
        : 0;

      // Cria o bloco HTML com os dados
      const html = `
        <div class="ativo-box">
          <h4>${nomeAtivo} (${tickerAtivo})</h4>
          <ul>
            <li>Preço de compra: €${precoCompra}</li>
            <li>Quantidade: ${quantidade}</li>
            <li>Objetivo: ${tipoObjetivo === "lucro" ? `Lucro de €${objetivoFinanceiro}` : `€${objetivoFinanceiro}`}</li>
            <li>TP2 (Preço objetivo): <strong>€${tp2.toFixed(3)}</strong></li>
            <li>Cotação atual: ${valorStockAtual ? `€${valorStockAtual}` : "❌ Não encontrada"}</li>
            <li>Progresso: ${valorStockAtual ? `${progresso.toFixed(1)}%` : "N/A"}</li>
          </ul>
        </div>
      `;

      container.innerHTML += html;
    });
  }
   function abrirPopupProgresso() {
    document.getElementById("popupProgresso").classList.remove("hidden");
    listarProgressoDosAtivos();
  }
  function fecharPopupProgresso() {
    document.getElementById("popupProgresso").classList.add("hidden");
  }

  