const {onSchedule} = require("firebase-functions/v2/scheduler");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

const ALPHA_VANTAGE_API_KEY = "1UU5ATMMC6IWDLHE";
/**
 * Busca o preço atual de uma ação usando a API Alpha Vantage.
 * @param {string} ticker - Símbolo da ação.
 * @return {Promise<{price: number}>} - Preço atual da ação.
 */
async function fetchStockData(ticker) {
  const urlPrice = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`;
  const responsePrice = await axios.get(urlPrice);
  const price = parseFloat(responsePrice.data["Global Quote"]["05. price"]);
  return {price};
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
    await new Promise((resolve) => setTimeout(resolve, 15000));
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
    const {price} = await fetchStockData(ticker);
    const docRef = db.collection("acoesDividendos").doc(ticker);
    await docRef.update({valorStock: price});
    return res.status(200).json({ticker, valorStock: price});
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    return res.status(500).send("Erro ao atualizar o ticker.");
  }
});

