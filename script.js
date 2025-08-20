
// Adicione estas variáveis no início do seu código
let exchangeRates = {
    real: 1,
    dollar: 5.4,    // Valores padrão caso a API falhe
    euro: 6.2,
    libra: 7.32,
    bitcoin: 634450
}

let lastUpdate = null
const UPDATE_INTERVAL = 3600000 // 1 hora em milissegundos

// Adicione esta função para buscar as cotações atualizadas
async function fetchExchangeRates() {
    // Verifica se já atualizou recentemente
    if(lastUpdate && (Date.now() - lastUpdate) < UPDATE_INTERVAL) {
        return
    }

    try {
        // API gratuita para cotações (USD como base)
        const response = await fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,GBP-BRL,BTC-BRL")
        const data = await response.json()
        
        // Atualiza os valores (convertendo para BRL como base)
        exchangeRates.dollar = parseFloat(data.USDBRL.bid)
        exchangeRates.euro = parseFloat(data.EURBRL.bid)
        exchangeRates.libra = parseFloat(data.GBPBRL.bid)
        exchangeRates.bitcoin = parseFloat(data.BTCBRL.bid)
        
        lastUpdate = Date.now()
        console.log("Cotações atualizadas com sucesso!")
    } catch (error) {
        console.error("Erro ao buscar cotações:", error)
        // Mantém os valores padrão em caso de erro
    }
}
const convertButton = document.querySelector(".convert-button")
const currencySelect = document.querySelector(".currency-select")
const currencyFrom = document.querySelector(".currency-from")

// Adicionei este objeto para mapear as moedas de origem
const fromCurrencyMap = {
    "R$ Real Brasileiro": "real",
    "US$ Dollar Americano": "dollar",
    "€ Euro": "euro",
    "£ Libra": "libra",
    "₿ Bitcoin": "bitcoin"
}

function convertValues(){
    fetchExchangeRates() // Busca cotações atualizadas
    
    const inputCurrencyValue = parseFloat(document.querySelector(".input-currency").value.replace(",", "."))
    if(isNaN(inputCurrencyValue)) {
        alert("Por favor, insira um valor válido")
        return
    }
    
    const currencyValueToConvert = document.querySelector(".currency-value-to-convert")
    const currencyValueConverted = document.querySelector(".currency-value")

    // Obtém a moeda de origem selecionada
    const fromCurrency = fromCurrencyMap[currencyFrom.options[currencyFrom.selectedIndex].text]
    
    // Primeiro converte o valor de entrada para Real
    let valueInReal = inputCurrencyValue
    if(fromCurrency === "dollar") valueInReal = inputCurrencyValue * exchangeRates.dollar
    else if(fromCurrency === "euro") valueInReal = inputCurrencyValue * exchangeRates.euro
    else if(fromCurrency === "libra") valueInReal = inputCurrencyValue * exchangeRates.libra
    else if(fromCurrency === "bitcoin") valueInReal = inputCurrencyValue * exchangeRates.bitcoin

    // Depois converte do Real para a moeda de destino
    if(currencySelect.value == "dollar"){
        const convertedValue = valueInReal / exchangeRates.dollar
        currencyValueConverted.innerHTML = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(convertedValue)
    }

    if(currencySelect.value == "euro"){
        const convertedValue = valueInReal / exchangeRates.euro
        currencyValueConverted.innerHTML = new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR"
        }).format(convertedValue)
    }

    if(currencySelect.value == "libra"){
        const convertedValue = valueInReal / exchangeRates.libra
        currencyValueConverted.innerHTML = new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP"
        }).format(convertedValue)
    }

    if(currencySelect.value == "bitcoin"){
        const convertedValue = valueInReal / exchangeRates.bitcoin
        currencyValueConverted.innerHTML = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "BTC"
        }).format(convertedValue)
    }

    if(currencySelect.value == "real"){
        currencyValueConverted.innerHTML = new Intl.NumberFormat("pt-BR", {
            style: "currency", 
            currency: "BRL"
        }).format(valueInReal)
    }

    // Atualiza o valor na moeda de origem (lado esquerdo)
    if(fromCurrency === "real"){
        currencyValueToConvert.innerHTML = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(inputCurrencyValue)
    } else if(fromCurrency === "dollar"){
        currencyValueToConvert.innerHTML = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(inputCurrencyValue)
    } else if(fromCurrency === "euro"){
        currencyValueToConvert.innerHTML = new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR"
        }).format(inputCurrencyValue)
    } else if(fromCurrency === "libra"){
        currencyValueToConvert.innerHTML = new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP"
        }).format(inputCurrencyValue)
    } else if(fromCurrency === "bitcoin"){
        currencyValueToConvert.innerHTML = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "BTC"
        }).format(inputCurrencyValue)
    }
}

// Chama a função uma vez quando a página carrega para ter valores atualizados
fetchExchangeRates()

function changeCurrency(){
    const currencyName = document.getElementById("currency-name")
    const currencyImage = document.querySelector(".currency-img")

    if(currencySelect.value == "dollar"){
        currencyName.innerHTML = "Dollar Americano"
        currencyImage.src = "./assets/Dolar.png" 
    }

    if(currencySelect.value == "euro"){
        currencyName.innerHTML = "Euro"
        currencyImage.src = "./assets/Euro.png"
    }

    if(currencySelect.value == "libra"){
        currencyName.innerHTML = "Libra"
        currencyImage.src = "./assets/Libra.png"
    }

    if(currencySelect.value == "bitcoin"){
        currencyName.innerHTML = "BTC"
        currencyImage.src = "./assets/BTC.png"
    }    

    if(currencySelect.value == "real"){
        currencyName.innerHTML = "Real"
        currencyImage.src = "./assets/Real.png"
    }

    convertValues()
}

// Adicionei esta função para mudar a imagem da moeda de origem
function changeFromCurrency(){
    const fromCurrencyImage = document.querySelector(".logo-brasil")
    const fromCurrency = fromCurrencyMap[currencyFrom.options[currencyFrom.selectedIndex].text]
    
    if(fromCurrency === "real"){
        fromCurrencyImage.src = "./assets/Real.png"
    } else if(fromCurrency === "dollar"){
        fromCurrencyImage.src = "./assets/Dolar.png"
    } else if(fromCurrency === "euro"){
        fromCurrencyImage.src = "./assets/Euro.png"
    } else if(fromCurrency === "libra"){
        fromCurrencyImage.src = "./assets/Libra.png"
    } else if(fromCurrency === "bitcoin"){
        fromCurrencyImage.src = "./assets/BTC.png"
    }
    
    convertValues()
}

currencySelect.addEventListener("change", changeCurrency)
currencyFrom.addEventListener("change", changeFromCurrency)
convertButton.addEventListener("click", convertValues)

// =========================
// TICKER MISTO (Ações + Criptos)
// =========================

document.addEventListener('DOMContentLoaded', function() {
    const ticker = document.querySelector('.mixed-ticker');
    
    // Lista de símbolos (ações + criptos)
    const symbols = [
        // Ações
        { proName: "NASDAQ:AAPL", title: "AAPL" },
        { proName: "NASDAQ:MSFT", title: "MSFT" },
        { proName: "NASDAQ:GOOGL", title: "GOOGL" },
        { proName: "NASDAQ:AMZN", title: "AMZN" },
        { proName: "NASDAQ:TSLA", title: "TSLA" },
        { proName: "NASDAQ:NVDA", title: "NVDA" },
        { proName: "NASDAQ:FB", title: "META" },
        { proName: "NASDAQ:INTC", title: "INTC" },
        { proName: "NASDAQ:AMD", title: "AMD" },
        { proName: "NYSE:IBM", title: "IBM" },
        
        // Criptomoedas
        { proName: "BINANCE:BTCUSDT", title: "BTC" },
        { proName: "BINANCE:ETHUSDT", title: "ETH" },
        { proName: "BINANCE:BNBUSDT", title: "BNB" },
        { proName: "BINANCE:SOLUSDT", title: "SOL" },
        { proName: "BINANCE:XRPUSDT", title: "XRP" },
        { proName: "BINANCE:DOGEUSDT", title: "DOGE" },
        { proName: "BINANCE:ADAUSDT", title: "ADA" },
        { proName: "BINANCE:MATICUSDT", title: "MATIC" },
        { proName: "BINANCE:AVAXUSDT", title: "AVAX" },
        { proName: "BINANCE:DOTUSDT", title: "DOT" }
    ];

    // Carrega o widget do TradingView
    function loadTradingViewWidget() {
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-tickers.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            "symbols": symbols,
            "colorTheme": "dark",
            "isTransparent": false,
            "showSymbolLogo": true,
            "locale": "br"
        });
        
        ticker.innerHTML = '';
        ticker.appendChild(script);
    }

    // Alternativa caso o widget do TradingView não funcione
    function loadFallbackTicker() {
        ticker.innerHTML = symbols.map(symbol => `
            <div class="ticker-item">
                <span class="ticker-symbol">${symbol.title}</span>
                <span class="ticker-price">$--.--</span>
                <span class="ticker-change">+0.00%</span>
            </div>
        `).join('');
        
        // Simula atualizações (substitua por chamadas reais à API)
        setInterval(() => {
            document.querySelectorAll('.ticker-item').forEach(item => {
                const change = (Math.random() * 10 - 5).toFixed(2);
                const price = (Math.random() * 500).toFixed(2);
                const changeElement = item.querySelector('.ticker-change');
                
                changeElement.textContent = `${change}%`;
                changeElement.className = `ticker-change ${change >= 0 ? 'positive' : 'negative'}`;
                
                item.querySelector('.ticker-price').textContent = `$${price}`;
            });
        }, 3000);
    }

    // Tenta carregar o widget oficial, caso falhe usa o fallback
    loadTradingViewWidget();
    
    // Verifica se o widget carregou após 5 segundos
    setTimeout(() => {
        if (ticker.querySelector('.ticker-item') === null) {
            loadFallbackTicker();
        }
    }, 5000);
});