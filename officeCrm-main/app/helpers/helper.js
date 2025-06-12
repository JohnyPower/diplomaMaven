module.exports = {
  doom: require('./doom.helper'),
  general: require('./general.helper'),
  header: require('./header.helper'),
  token: require('./token.helper'),
  validator: require('./validator.helper'),
  controller: require('./controller.helper'),
  math: require('./math.helper'),
  country: require('./countries'),
  language: require('./languages'),
  forex: require('./getForexPrice.helper'),
  binance: require('./getBinancePrice.helper'),
  stock: require('./getStockPrice.helper'),

  middlewares: {
    auth: require('../middlewares/auth.handler'),
    cors: require('../middlewares/cors.handler'),
    error: require('../middlewares/error.handler'),
    notFound: require('../middlewares/not-found.handler')
  }
};
