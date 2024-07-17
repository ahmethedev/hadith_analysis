const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://myuser:admin123@localhost:5432/web_scraper');

const Hadith = sequelize.define('hadithstest2', {
    id: { type: DataTypes.UUID, primaryKey: true },
    arabic: DataTypes.TEXT,
    turkish: DataTypes.TEXT,
    musannif: DataTypes.STRING,
    book: DataTypes.STRING,
    topic: DataTypes.STRING,
    chain: DataTypes.STRING,
    page_index: DataTypes.STRING
  }, {
    timestamps: false,
    tableName: 'hadithstest2' // Specify the table name explicitly
  });

const Ravi = sequelize.define('ravis', {
  ravi_id: { type: DataTypes.INTEGER, primaryKey: true },
  narrator_name: DataTypes.STRING,
  tribe: DataTypes.STRING,
  nisbesi: DataTypes.STRING,
  degree: DataTypes.STRING,
  reliability: DataTypes.STRING
},{
    timestamps: false,
    tableName: 'ravis' // Specify the table name explicitly
  });

module.exports = { sequelize, Hadith, Ravi };