const {onSchedule} = require("firebase-functions/v2/scheduler");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

/**
 * Busca o preço atual de uma ação usando a API Alpha Vantage.
 * @param {string} ticker - Símbolo da ação.
 * @return {Promise<{price: number}>} - Preço atual da ação.
 */
async function fetchStockData(ticker) {
  const ALPHA_VANTAGE_API_KEY = "1UU5ATMMC6IWDLHE";

  // 1. Overview (dividendo)
  const urlOverview = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=
  ${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`;
  const resOverview = await axios.get(urlOverview);
  const dividend = parseFloat(resOverview.data.DividendPerShare) || 0;

  // 2. Time series para calcular crescimento
  const urlTimeSeries =`https://www.alphavantage.co/query?
  function=TIME_SERIES_DAILY_ADJUSTED&symbol
  =${ticker}&apikey
  =${ALPHA_VANTAGE_API_KEY}&outputsize=compact`;
  const resTime = await axios.get(urlTimeSeries);
  const timeSeries = resTime.data["Time Series (Daily)"];

  if (!timeSeries) throw new Error("❌ Dados de time series não disponíveis.");

  const dates = Object.keys(timeSeries).sort().reverse();
  const priceToday =
  parseFloat(timeSeries[dates[0]]["5. adjusted close"]);
  const price7d =
  parseFloat(timeSeries[dates[5]]["5. adjusted close"] || priceToday);
  const price30d =
  parseFloat(timeSeries[dates[21]]["5. adjusted close"] || priceToday);
  const price250d =
  parseFloat(timeSeries[dates[250]]["5. adjusted close"] || priceToday);

  const crescimento1s =(((priceToday - price7d) / price7d) * 100).toFixed(3);
  const crescimento1m =(((priceToday - price30d) / price30d) * 100).toFixed(3);
  const crescimento1a =
  (((priceToday - price250d) / price250d) * 100).toFixed(3);

  return {
    dividendo: dividend,
    taxaCrescimento_1semana: parseFloat(crescimento1s),
    taxaCrescimento_1mes: parseFloat(crescimento1m),
    taxaCrescimento_1ano: parseFloat(crescimento1a),
  };
}

// Função agendada (a cada hora)
exports.atualizaAcoes = onSchedule("every 1 hours", async (event) => {
  const snapshot = await db.collection("acoesDividendos").get();
  const docs = snapshot.docs;

  console.log(`🔄 A atualizar ${docs.length} tickers...`);

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const dados = doc.data();
    const ticker = dados.ticker;

    if (!ticker) continue;

    try {
      console.log(`📈 [${i + 1}/${docs.length}] A atualizar ${ticker}...`);
      const {price} = await fetchStockData(ticker);
      await doc.ref.update({valorStock: price});
      console.log(`✅ ${ticker}: €${price}`);
    } catch (error) {
      console.error(`❌ Erro ao atualizar ${ticker}:`, error.message);
    }

    // Esperar 15 segundos entre chamadas
    await new Promise((resolve) => setTimeout(resolve, 60000));
  }

  console.log("🏁 Atualização completa.");
  return null;
});


// Função HTTP (chamada pelo frontend)
exports.atualizaTickerHTTP = functions.https.onRequest(async (req, res) => {
  const ticker = req.query.ticker;

  if (!ticker) {
    return res.status(400).send("Ticker não fornecido.");
  }

  try {
    const novosDados = await fetchStockData(ticker);
    const docRef = db.collection("acoesDividendos").doc(ticker);
    await docRef.update(novosDados);
    return res.status(200).json({ticker, ...novosDados});
  } catch (error) {
    console.error("Erro ao atualizar:", error.message);
    return res.status(500).send("Erro ao atualizar o ticker.");
  }
});
