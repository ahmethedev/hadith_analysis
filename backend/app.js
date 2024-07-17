const express = require('express');
const cors = require('cors');
const { sequelize, Hadith, Ravi } = require('./models'); // Import your Sequelize models with updated table names
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
// Endpoint to fetch all hadiths from 'hadithstest2' table
const { Op } = require('sequelize');

app.get('/hadiths', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    const offset = (page - 1) * perPage;
    const search = req.query.search || '';

    const whereClause = search
      ? {
          [Op.or]: [
            { arabic: { [Op.iLike]: `%${search}%` } },
            { turkish: { [Op.iLike]: `%${search}%` } },
            { musannif: { [Op.iLike]: `%${search}%` } },
            { book: { [Op.iLike]: `%${search}%` } },
            { topic: { [Op.iLike]: `%${search}%` } }
          ]
        }
      : {};

    const { count, rows: ravis } = await Hadith.findAndCountAll({
      where: whereClause,
      limit: perPage,
      offset: offset,
    });

    const totalPages = Math.ceil(count / perPage);

    res.setHeader('X-Total-Pages', totalPages);
    res.json(ravis);
  } catch (error) {
    console.error('Error fetching ravis:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/ravis', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    const offset = (page - 1) * perPage;
    const search = req.query.search || '';

    const whereClause = search
      ? {
          [Op.or]: [
            { narrator_name: { [Op.iLike]: `%${search}%` } },
            { tribe: { [Op.iLike]: `%${search}%` } },
            { nisbesi: { [Op.iLike]: `%${search}%` } },
            { degree: { [Op.iLike]: `%${search}%` } },
            { reliability: { [Op.iLike]: `%${search}%` } }
          ]
        }
      : {};

    const { count, rows: ravis } = await Ravi.findAndCountAll({
      where: whereClause,
      limit: perPage,
      offset: offset,
      order: [['ravi_id', 'ASC']]
    });

    const totalPages = Math.ceil(count / perPage);

    res.setHeader('X-Total-Pages', totalPages);
    res.json(ravis);
  } catch (error) {
    console.error('Error fetching ravis:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/hadith-by-tribe', async (req, res) => {
  try {
    const result = await sequelize.query(`
      WITH first_ravi AS (
        SELECT h.id, (string_to_array(h.chain, ','))[1]::int AS first_ravi_id
        FROM hadithstest2 h
      )
      SELECT r.tribe, COUNT(*) as hadith_count
      FROM first_ravi fr
      JOIN ravis r ON fr.first_ravi_id = r.ravi_id
      GROUP BY r.tribe
      ORDER BY hadith_count DESC
    `, { type: sequelize.QueryTypes.SELECT });

    res.json(result);
  } catch (error) {
    console.error('Error fetching hadith by tribe data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Test connection and start server
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Unable to connect to the database:', err));

//   // Test database connection
// sequelize.authenticate()
//   .then(() => {
//     console.log('Database connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

// // Sync models and start server
// sequelize.sync()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch(err => {
//     console.error('Unable to sync models and start server:', err);
//   });



