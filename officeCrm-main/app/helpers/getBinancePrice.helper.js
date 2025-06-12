const axios = require('axios');

async function getExchangeRate(pair) {
    const url = `https://api.binance.com/api/v3/ticker/price?symbol=${pair}`;

    try {
        const response = await axios.get(url);
        return response.data?.price;
    } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);

    }
}

module.exports = {
    getExchangeRate
}
