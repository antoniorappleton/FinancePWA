// Firebase Configurações (substituir pelos teus dados reais)
const firebaseConfig = {
  apiKey: "AIzaSyDbSYjVwsOOnBjZe_X8y7gS-W4DhYqHEnE",
  authDomain: "appfinance-812b2.firebaseapp.com",
  projectId: "appfinance-812b2",
  storageBucket: "appfinance-812b2.firebasestorage.app",
  messagingSenderId: "383837988480",
  appId: "1:383837988480:web:dd114574838c6a9dbb2865",
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Navegação entre screens
function goToScreen2() {
  document.getElementById("screen1").classList.add("hidden");
  document.getElementById("screen2").classList.remove("hidden");
}

function goToScreen1() {
  document.getElementById("screen2").classList.add("hidden");
  document.getElementById("screen1").classList.remove("hidden");
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
    crescimentoPercentual: parseFloat(crescimento.toFixed(2)),
  };

  simulacoes.push(novaSimulacao);
  atualizarTabela();
  atualizarGrafico();
}

function atualizarTabela() {
  const corpoTabela = document.querySelector("#tabelaSimulacoes tbody");
  corpoTabela.innerHTML = "";

  simulacoes.forEach((sim) => {
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

function simularEGUardar() {
  const nome = document.getElementById("nomeAcao").value;
  const tp1 = parseFloat(document.getElementById("tp1").value);
  const tp2 = parseFloat(document.getElementById("tp2").value);
  const investimento = parseFloat(
    document.getElementById("investimento").value
  );

  if (!nome || isNaN(tp1) || isNaN(tp2) || isNaN(investimento)) {
    alert("Preenche todos os campos!");
    return;
  }

  guardarSimulacao(nome, tp1, tp2, investimento);
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

//secção 5
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

function prepararSimulacao(nome,dividendo) {
  console.log("Preparar simulação para:", nome, "com dividendo:", dividendo);
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
          !setor || dados.setor?.trim().toLowerCase() === setor.trim().toLowerCase();
        const matchMercado =
          !mercado || dados.mercado?.trim().toLowerCase() === mercado.trim().toLowerCase();
        const matchMes =
          !mes || dados.mes?.trim().toLowerCase() === mes.trim().toLowerCase();
        const matchPeriodicidade =
          !periodicidade || dados.periodicidade?.trim().toLowerCase() === periodicidade.trim().toLowerCase();

        if (matchSetor && matchMercado && matchMes && matchPeriodicidade) {
          html += `<li>
            <strong>${dados.nome}</strong> (${dados.ticker})<br>
            Setor: ${dados.setor} | Mercado: ${dados.mercado} | Dividendo: €${
            dados.dividendo
          } |
            Mês: ${dados.mes} | Periodicidade: ${dados.periodicidade}<br>
            <div style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 5px;">
              <button onclick="editarAcao('${doc.id}', ${JSON.stringify(
            dados
          ).replace(/"/g, "&quot;")})">✏️ Editar</button>
              <button onclick="eliminarAcao('${doc.id}')">🗑️ Eliminar</button>
              <button onclick="prepararSimulacao('${dados.nome}', ${
            dados.dividendo
          })">📊 Simular</button>
            </div>
          </li>`;
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

//Atualizar a Firebase
function atualizarAcaoFirebase() {
  if (!idAcaoEmEdicao) {
    alert("Nenhuma ação selecionada para edição.");
    return;
  }

  const nome = document.getElementById("nomeAcaoReg").value.trim();
  const ticker = document.getElementById("tickerAcaoReg").value.trim();
  const setor = document.getElementById("Setor").value;
  const mercado = document.getElementById("Mercado").value;
  const periodicidade = document.getElementById("Periodicidade").value;
  const dividendo = parseFloat(document.getElementById("valorDividendoReg").value);
  const mes = document.getElementById("mesDividendoReg").value;

  if (!nome || !ticker || !setor || !mercado || isNaN(dividendo) || !mes || !periodicidade) {
    alert("Preenche todos os campos corretamente.");
    return;
  }

  db.collection("acoesDividendos")
    .doc(idAcaoEmEdicao)
    .update({
      nome,
      ticker,
      setor,
      mercado,
      dividendo,
      periodicidade,
      mes,
      timestamp: new Date(),
    })
    .then(() => {
      alert("✅ Ação atualizada com sucesso!");
      limparCamposSec6();
      idAcaoEmEdicao = null;
    })
    .catch((error) => {
      console.error("Erro ao atualizar:", error);
      alert("❌ Erro ao atualizar. Tenta novamente.");
    });
}

//Editar a Firebase
function editarAcao(id, dados) {
  idAcaoEmEdicao = id;
  document.getElementById("nomeAcaoReg").value = dados.nome || "";
  document.getElementById("tickerAcaoReg").value = dados.ticker || "";
  document.getElementById("Setor").value = dados.setor || "";
  document.getElementById("Mercado").value = dados.mercado || "";
  document.getElementById("valorDividendoReg").value = dados.dividendo || "";
  document.getElementById("mesDividendoReg").value = dados.mes || "";
  document.getElementById("periodicidade").value = dados.periodicidade || "";
}

//preparar simulação
function prepararSimulacao(nome, dividendo) {
  // Vai para o screen de Simulação
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.add("hidden"));
  document.getElementById("sec5Screen").classList.remove("hidden");

  // Preenche nome e dividendo
  document.getElementById("nomeAcao").value = nome;
  document.getElementById("dividendo").value = dividendo || 0;

  // Limpa TP1, TP2, Investimento
  document.getElementById("tp1").value = "";
  document.getElementById("tp2").value = "";
  document.getElementById("investimento").value = "";

  // Mostra os botões de simulação rápida
  document.getElementById("botoesSimulacaoRapida").classList.remove("hidden");
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
  document.getElementById("botoesSimulacaoRapida").classList.add("hidden");
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


//Guardar na Firebase
let idAcaoEmEdicao = null;

function guardarOuAtualizarAcaoFirebase() {
  const nome = document.getElementById("nomeAcaoReg").value.trim();
  const ticker = document.getElementById("tickerAcaoReg").value.trim();
  const setor = document.getElementById("Setor").value.trim();
  const mercado = document.getElementById("Mercado").value.trim();
  const dividendo = parseFloat(document.getElementById("valorDividendoReg").value);
  const mes = document.getElementById("mesDividendoReg").value;
  const periodicidade = document.getElementById("periodicidade").value;

  if (!nome || !ticker || !setor || !mercado || isNaN(dividendo) || !mes || !periodicidade) {
    alert("⚠️ Preenche todos os campos corretamente.");
    return;
  }

  const dadosAcao = {
    nome,
    ticker,
    setor,
    mercado,
    dividendo,
    mes,
    periodicidade,
    timestamp: new Date()
  };

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
        alert("❌ Ocorreu um erro ao guardar. Verifica a ligação com a Firebase.");
      });
  }
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