const axios = require('axios');

async function getExchangeRate(symbol) {
    const apiKey = process.env.ALPHA_API_KEY;

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        let price;

        if (data['Global Quote']) {
            price = data['Global Quote']['05. price'];
            return price
        } else {
            console.log('Дані не знайдені або сталася помилка.');
        }

    } catch (error) {
        console.error('Помилка при отриманні пар:', error.message);
    }
}

module.exports = {
    getExchangeRate
}
