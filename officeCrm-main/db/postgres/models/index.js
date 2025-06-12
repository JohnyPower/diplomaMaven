const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

const dbPostgres = require('../../../app/config/db-postgre.config.js');

const sequelize = new Sequelize(dbPostgres);

const dirname = path.join(__dirname); // використовуємо __dirname для отримання абсолютного шляху до поточної директорії

const files = fs
  .readdirSync(dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 && file !== path.basename(__filename) && file.slice(-3) === '.js'
  );

const initModel = () => {
  const models = {};

  for (const file of files) {
    const model = require(path.join(dirname, file));
    models[model.name] = model.init(sequelize, Sequelize);
  }

  return models;
};

const models = initModel();

Object.values(models)
  .filter((model) => typeof model.associate === 'function')
  .forEach((model) => model.associate(models));

module.exports = {
  ...models,
  sequelize,
  Sequelize
};
