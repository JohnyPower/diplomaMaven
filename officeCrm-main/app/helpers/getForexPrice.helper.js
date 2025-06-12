const axios = require('axios');

async function getExchangeRate(fromCurrency, toCurrency) {
    const apiKey = process.env.ALPHA_API_KEY;

    const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${apiKey}`;

    try {
        const response = await axios.get(url);

        const data = response.data;
        let price;

        if (data['Realtime Currency Exchange Rate']) {
            price = data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
            return price;
        } else {
            console.log(`Дані для ${fromCurrency}/${toCurrency} не знайдено.`);
        }

    } catch (error) {
        console.error('Помилка при отриманні курсу:', error.message);
    }
}

module.exports = {
    getExchangeRate
}
