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
    lucro: parseFloat(lucroTotal.toFixed(2)),
    crescimentoPercentual: parseFloat(crescimento.toFixed(2)),
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
      <td>${sim.lucro.toFixed(2)}</td>
      <td>${sim.crescimentoPercentual}%</td>
      <td>
        <button onclick="removerSimulacao(${index})">❌</button>
      </td>
      <td>
        <input type="checkbox" onchange="atualizarSomaLucros()" class="checkbox-lucro" data-lucro="${sim.lucro}">
      </td>
    `;
    corpoTabela.appendChild(linha);
  });

  atualizarSomaLucros(); // Atualiza o total sempre que a tabela é renderizada
}

function removerSimulacao(index) {
  simulacoes.splice(index, 1); // Remove 1 elemento na posição index
  atualizarTabela();           // Re-renderiza a tabela
  atualizarGrafico();          // Atualiza o gráfico com as simulações restantes
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
      <td colspan="4" id="valorTotalLucro"><strong>${valor.toFixed(2)} €</strong></td>
    `;
    document.querySelector("#tabelaSimulacoes tbody").appendChild(totalRow);
  } else {
    totalRow.querySelector("#valorTotalLucro").innerHTML = `<strong>${valor.toFixed(2)} €</strong>`;
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
  html += `
    <li>
      <strong>${dados.nome}</strong> (${dados.ticker})<br>
      Setor: ${dados.setor} | Mercado: ${dados.mercado} | Dividendo: €${dados.dividendo} |
      Mês: ${dados.mes} | Periodicidade: ${dados.periodicidade} | Valor da Ação: €${dados.valorStock || "N/D"}<br>
      <div class="botoes-acoes">
        <button title="Editar" onclick="editarAcao('${doc.id}', ${JSON.stringify(dados).replace(/"/g, "&quot;")})">✏️</button>
        <button title="Eliminar" onclick="eliminarAcao('${doc.id}')">🗑️</button>
        <button title="Simular" onclick="prepararSimulacao('${dados.nome}', ${dados.valorStock || 0}, ${dados.dividendo || 0})">📈</button>
      </div>
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
  const dividendo = parseFloat(
    document.getElementById("valorDividendoReg").value
  );
  const mes = document.getElementById("mesDividendoReg").value;

  if (
    !nome ||
    !ticker ||
    !setor ||
    !mercado ||
    isNaN(dividendo) ||
    !mes ||
    !periodicidade
  ) {
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
  const valorStock = parseFloat(
    document.getElementById("valorStock").value
  );
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
      alert(idAcaoEmEdicao ? "✅ Ação atualizada com sucesso!" : "✅ Ação guardada com sucesso na Firebase!");
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
  const invest1 = parseFloat(document.getElementById("invest1").value.replace(",", "."));
  const preco1 = parseFloat(document.getElementById("preco1").value.replace(",", "."));
  const invest22 = parseFloat(document.getElementById("invest22").value.replace(",", "."));
  const preco2 = parseFloat(document.getElementById("preco2").value.replace(",", "."));

  if (!isNaN(invest1) && !isNaN(preco1) && !isNaN(invest22) && !isNaN(preco2) && preco1 > 0 && preco2 > 0) {
    const qtd1 = invest1 / preco1;
    const qtd2 = invest22 / preco2;
    const totalQtd = qtd1 + qtd2;
    const totalInvestido = invest1 + invest22;
    const precoMedio = totalInvestido / totalQtd;

    const html = `
      <p>📊 <strong>Preço Médio:</strong> ${precoMedio.toFixed(2)} €</p>
      <p>📦 <strong>Total de Ações:</strong> ${totalQtd.toFixed(2)}</p>
      <p>💰 <strong>Total Investido:</strong> ${totalInvestido.toFixed(2)} €</p>
    `;

    document.getElementById("resultadoReforco").innerHTML = html;
  } else {
    document.getElementById("resultadoReforco").innerHTML = "❌ Preencha todos os campos corretamente.";
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
  const investimento = parseFloat(document.getElementById('inputInvestimento').value);
  const crescimentoEstimado = parseFloat(document.getElementById('inputCrescimento').value) || 0;
  const lucroDesejado = parseFloat(document.getElementById('inputLucro').value) || 0;

  const db = firebase.firestore();
  const acoesRef = db.collection("acoesDividendos");
  const snapshot = await acoesRef.get();

  let resultados = [];

  snapshot.forEach(doc => {
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
      diferenca: Math.abs(lucroTotal - lucroDesejado)
    });
  });

  const resultado = document.getElementById('resultadoSimulacao');

  if (resultados.length === 0) {
    resultado.innerHTML = "<p>⚠️ Nenhuma ação válida para este investimento.</p>";
    return;
  }

  // Ordenar pelas mais próximas do lucro desejado (menor diferença absoluta)
  const topMaisProximas = resultados.sort((a, b) => a.diferenca - b.diferenca).slice(0, 10);

  let html = `<h3>🔍 Top 10 mais próximas do lucro desejado (${lucroDesejado.toFixed(2)}€)</h3>`;

  topMaisProximas.forEach((acao, i) => {
    html += `
      <hr />
      <p><strong>Top ${i + 1}: ${acao.nome}</strong></p>
      <p>Preço atual: €${acao.preco.toFixed(2)}</p>
      <p>Dividendos: €${acao.dividendo.toFixed(2)} por ação</p>
      <p>Quantidade a comprar: ${acao.quantidade}</p>
      <p>Lucro com valorização: €${acao.lucroValorizacao.toFixed(2)}</p>
      <p>Lucro com dividendos: €${acao.lucroDividendos.toFixed(2)}</p>
      <p><strong>Lucro total estimado: €${acao.lucroTotal.toFixed(2)}</strong> (diferença: €${acao.diferenca.toFixed(2)})</p>
    `;
  });

  resultado.innerHTML = html;
}


function abrirPopupSimuladorGrafico() {
  document.getElementById("popupSimuladorGrafico").classList.remove("popup hidden");
}

function fecharPopupSimuladorGrafico() {
  document.getElementById("popupSimuladorGrafico").classList.add("popup hidden");
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
  const tp1 = parseFloat(document.getElementById("tp1Input").value.replace(",", "."));
  const investimento = parseFloat(document.getElementById("investimentoInput").value.replace(",", "."));
  const lucroDesejado = parseFloat(document.getElementById("lucroDesejadoInput").value.replace(",", "."));
  

  const resultadoDiv = document.getElementById("resultadoTP2");

  if (isNaN(tp1) || isNaN(investimento) || isNaN(lucroDesejado) || tp1 <= 0 || investimento <= 0) {
    resultadoDiv.innerHTML = "❌ Preencha todos os campos corretamente.";
    return;
  }

  const numAcoes = investimento / tp1;
  const tp2 = tp1 + (lucroDesejado / numAcoes);
  const percent = ((tp2/tp1)-1)*100;
    document.getElementById("percent_2").textContent = percent.toFixed(2) + "%";

  resultadoDiv.innerHTML = `
    <p>📈 Para atingir um lucro de <strong>${lucroDesejado.toFixed(2)}€</strong>, a ação tem de atingir:</p>
    <p>🎯 <strong>TP2 = ${tp2.toFixed(2)}€ a uma taxa de crescimento ${percent.toFixed(2)}%</strong></p>
  `;
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
  simulacoes.forEach(sim => {
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
