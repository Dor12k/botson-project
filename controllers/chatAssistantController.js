

const transactionModel = require('../models/transactionModel');



// Handle chat question
/**
 * Handler for chat assistant POST requests.
 * 
 * CURRENT VERSION:
 * - Echoes back the received question from the client.
 * - Performs aggregation to calculate the average TOTAL_JOBS_SENT_TO_INDEX per client for the last month.
 * - Returns the average results as JSON.
 * 
 * NEXT STEPS:
 * - Implement prompt construction for the AI model (e.g., ChatGPT).
 * - Send the constructed prompt to the AI API and return its response.
 * - Handle ambiguous or unclear questions gracefully.
 */
const handleChatQuestion = async (req, res) => {
  const { question } = req.body;

  // Always echo the question back for confirmation
  const echo = question;

  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const result = await transactionModel.aggregate([
      {
        $match: {
          $expr: { $gte: [{ $toDate: "$timestamp" }, oneMonthAgo] },
          "progress.TOTAL_JOBS_SENT_TO_INDEX": { $exists: true }
        }
      },
      {
        $project: {
          transactionSourceName: 1,
          totalJobsSent: "$progress.TOTAL_JOBS_SENT_TO_INDEX"
        }
      },
      {
        $group: {
          _id: "$transactionSourceName",
          avgJobsSent: { $avg: "$totalJobsSent" }
        }
      },
      { $sort: { avgJobsSent: -1 } }
    ]);

    const formatted = result.map(item => ({
      client: item._id,
      average: item.avgJobsSent
    }));

    return res.json({
      echo,
      answer: `Average TOTAL_JOBS_SENT_TO_INDEX per client in the last month:`,
      data: formatted
    });

  } catch (err) {

    console.error('Aggregation error:', err);

    return res.status(500).json({
      echo,
      answer: 'An error occurred while querying the database.'
    });
  }
};

module.exports = { handleChatQuestion };


