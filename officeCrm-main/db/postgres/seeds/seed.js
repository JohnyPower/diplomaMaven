const bcrypt = require('bcryptjs');

module.exports = {
    up: async (queryInterface) => {
        const adminData = {
            userName: 'admin',
            email: 'voznikevicho@gmail.com',
            created_at: new Date(),
            type: 'head',
            password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10)
        };

        const pairsData = [
            // Forex
            {id: 1, pair: 'EUR/USD', type: 'forex', createdAt: new Date()},
            {id: 2, pair: 'GBP/USD', type: 'forex', createdAt: new Date()},
            {id: 3, pair: 'USD/JPY', type: 'forex', createdAt: new Date()},
            {id: 4, pair: 'USD/CHF', type: 'forex', createdAt: new Date()},
            {id: 5, pair: 'AUD/USD', type: 'forex', createdAt: new Date()},
            {id: 6, pair: 'NZD/USD', type: 'forex', createdAt: new Date()},
            {id: 7, pair: 'USD/CAD', type: 'forex', createdAt: new Date()},
            {id: 8, pair: 'EUR/GBP', type: 'forex', createdAt: new Date()},
            {id: 9, pair: 'EUR/JPY', type: 'forex', createdAt: new Date()},
            {id: 10, pair: 'GBP/JPY', type: 'forex', createdAt: new Date()},
            {id: 11, pair: 'AUD/JPY', type: 'forex', createdAt: new Date()},
            {id: 12, pair: 'EUR/AUD', type: 'forex', createdAt: new Date()},
            {id: 13, pair: 'GBP/AUD', type: 'forex', createdAt: new Date()},
            {id: 14, pair: 'EUR/CHF', type: 'forex', createdAt: new Date()},
            {id: 15, pair: 'GBP/CHF', type: 'forex', createdAt: new Date()},
            {id: 16, pair: 'NZD/JPY', type: 'forex', createdAt: new Date()},
            {id: 17, pair: 'AUD/CAD', type: 'forex', createdAt: new Date()},
            {id: 18, pair: 'EUR/NZD', type: 'forex', createdAt: new Date()},
            {id: 19, pair: 'GBP/NZD', type: 'forex', createdAt: new Date()},

            // Crypto
            {id: 21, pair: 'BTC/USD', type: 'crypto', createdAt: new Date()},
            {id: 22, pair: 'ETH/USD', type: 'crypto', createdAt: new Date()},
            {id: 23, pair: 'BTC/USDT', type: 'crypto', createdAt: new Date()},
            {id: 24, pair: 'ETH/USDT', type: 'crypto', createdAt: new Date()},
            {id: 25, pair: 'BNB/USDT', type: 'crypto', createdAt: new Date()},
            {id: 26, pair: 'XRP/USDT', type: 'crypto', createdAt: new Date()},
            {id: 27, pair: 'ADA/USDT', type: 'crypto', createdAt: new Date()},
            {id: 28, pair: 'SOL/USDT', type: 'crypto', createdAt: new Date()},
            {id: 29, pair: 'DOGE/USDT', type: 'crypto', createdAt: new Date()},
            {id: 30, pair: 'LTC/USDT', type: 'crypto', createdAt: new Date()},
            {id: 31, pair: 'MATIC/USDT', type: 'crypto', createdAt: new Date()},
            {id: 32, pair: 'DOT/USDT', type: 'crypto', createdAt: new Date()},
            {id: 33, pair: 'AVAX/USDT', type: 'crypto', createdAt: new Date()},
            {id: 34, pair: 'SHIB/USDT', type: 'crypto', createdAt: new Date()},
            {id: 35, pair: 'TRX/USDT', type: 'crypto', createdAt: new Date()},
            {id: 36, pair: 'ATOM/USDT', type: 'crypto', createdAt: new Date()},
            {id: 37, pair: 'XMR/USDT', type: 'crypto', createdAt: new Date()},
            {id: 38, pair: 'LINK/USDT', type: 'crypto', createdAt: new Date()},
            {id: 39, pair: 'FTM/USDT', type: 'crypto', createdAt: new Date()},

            // Indices
            {id: 41, pair: 'US30', type: 'index', createdAt: new Date()},
            {id: 42, pair: 'SPX500', type: 'index', createdAt: new Date()},
            {id: 43, pair: 'NAS100', type: 'index', createdAt: new Date()},
            {id: 44, pair: 'DE40', type: 'index', createdAt: new Date()},
            {id: 45, pair: 'UK100', type: 'index', createdAt: new Date()},
            {id: 46, pair: 'FR40', type: 'index', createdAt: new Date()},
            {id: 47, pair: 'EU50', type: 'index', createdAt: new Date()},
            {id: 48, pair: 'JP225', type: 'index', createdAt: new Date()},
            {id: 49, pair: 'HK50', type: 'index', createdAt: new Date()},
            {id: 50, pair: 'CHINA50', type: 'index', createdAt: new Date()},
            {id: 51, pair: 'AUS200', type: 'index', createdAt: new Date()},
            {id: 52, pair: 'IT40', type: 'index', createdAt: new Date()},
            {id: 53, pair: 'ES35', type: 'index', createdAt: new Date()},
            {id: 54, pair: 'RUS50', type: 'index', createdAt: new Date()},
            {id: 55, pair: 'VIX', type: 'index', createdAt: new Date()},
            {id: 56, pair: 'KRX100', type: 'index', createdAt: new Date()},
            {id: 57, pair: 'SENSEX', type: 'index', createdAt: new Date()},
            {id: 58, pair: 'NIFTY50', type: 'index', createdAt: new Date()},
            {id: 59, pair: 'SA40', type: 'index', createdAt: new Date()},

            // Commodities
            {id: 60, pair: 'XAU/USD', type: 'commodity', createdAt: new Date()},
            {id: 61, pair: 'XAG/USD', type: 'commodity', createdAt: new Date()},
            {id: 62, pair: 'XPT/USD', type: 'commodity', createdAt: new Date()},
            {id: 63, pair: 'XPD/USD', type: 'commodity', createdAt: new Date()},
            {id: 64, pair: 'WTI/USD', type: 'commodity', createdAt: new Date()},
            {id: 65, pair: 'BRENT/USD', type: 'commodity', createdAt: new Date()},
            {id: 66, pair: 'NATGAS/USD', type: 'commodity', createdAt: new Date()},
            {id: 67, pair: 'COCOA/USD', type: 'commodity', createdAt: new Date()},
            {id: 68, pair: 'COFFEE/USD', type: 'commodity', createdAt: new Date()},
            {id: 69, pair: 'SUGAR/USD', type: 'commodity', createdAt: new Date()},
            {id: 70, pair: 'CORN/USD', type: 'commodity', createdAt: new Date()},
            {id: 71, pair: 'WHEAT/USD', type: 'commodity', createdAt: new Date()},
            {id: 72, pair: 'SOYBEAN/USD', type: 'commodity', createdAt: new Date()},
            {id: 73, pair: 'COTTON/USD', type: 'commodity', createdAt: new Date()},
            {id: 74, pair: 'RICE/USD', type: 'commodity', createdAt: new Date()},
            {id: 75, pair: 'OIL/USD', type: 'commodity', createdAt: new Date()},
            {id: 76, pair: 'GASOIL/USD', type: 'commodity', createdAt: new Date()},
            {id: 77, pair: 'COPPER/USD', type: 'commodity', createdAt: new Date()},
            {id: 78, pair: 'ALUMINIUM/USD', type: 'commodity', createdAt: new Date()},

            // Stocks
            {id: 79, pair: 'AAPL/USD', type: 'stock', createdAt: new Date()},
            {id: 80, pair: 'MSFT/USD', type: 'stock', createdAt: new Date()},
            {id: 81, pair: 'GOOGL/USD', type: 'stock', createdAt: new Date()},
            {id: 82, pair: 'AMZN/USD', type: 'stock', createdAt: new Date()},
            {id: 83, pair: 'TSLA/USD', type: 'stock', createdAt: new Date()},
            {id: 84, pair: 'META/USD', type: 'stock', createdAt: new Date()},
            {id: 85, pair: 'NFLX/USD', type: 'stock', createdAt: new Date()},
            {id: 86, pair: 'NVDA/USD', type: 'stock', createdAt: new Date()},
            {id: 87, pair: 'AMD/USD', type: 'stock', createdAt: new Date()},
            {id: 88, pair: 'INTC/USD', type: 'stock', createdAt: new Date()},
            {id: 89, pair: 'BABA/USD', type: 'stock', createdAt: new Date()},
            {id: 90, pair: 'XOM/USD', type: 'stock', createdAt: new Date()},
            {id: 91, pair: 'V/USD', type: 'stock', createdAt: new Date()},
            {id: 92, pair: 'MA/USD', type: 'stock', createdAt: new Date()},
            {id: 93, pair: 'PYPL/USD', type: 'stock', createdAt: new Date()},
            {id: 94, pair: 'JPM/USD', type: 'stock', createdAt: new Date()},
            {id: 95, pair: 'WMT/USD', type: 'stock', createdAt: new Date()},
            {id: 96, pair: 'DIS/USD', type: 'stock', createdAt: new Date()},
            {id: 97, pair: 'BIDU/USD', type: 'stock', createdAt: new Date()},
            {id: 98, pair: 'PFE/USD', type: 'stock', createdAt: new Date()}
        ];


        const existingAdmin = await queryInterface.rawSelect(
            'Users',
            {
                where: {email: adminData.email}
            },
            ['id']
        );

        if (!existingAdmin) {
            await queryInterface.bulkInsert('Users', [adminData], {returning: true});
            console.log('Admin auth created and Page 1 inserted successfully');
        } else {
            console.log('Admin auth already exists');
        }
        await queryInterface.bulkInsert('Pairs', pairsData, {returning: true});


    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('Users', {email: 'voznikevicho@gmail.com'});
    }
};
