

const transactionModel = require('../models/transactionModel');

const getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, country, client } = req.query;

    const query = {};

    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (country) query.country_code = country;
    if (client) query.transactionSourceName = client;

    const data = await transactionModel.find(query).limit(100);
    res.json(data);
  } catch (err) {
    console.error('Error in getTransactions:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getTransactions };
