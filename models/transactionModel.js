


const {model, Schema} = require('mongoose')

const progressSchema = new Schema({
  SWITCH_INDEX: Boolean,
  TOTAL_RECORDS_IN_FEED: Number,
  TOTAL_JOBS_FAIL_INDEXED: Number,
  TOTAL_JOBS_IN_FEED: Number,
  TOTAL_JOBS_SENT_TO_ENRICH: Number,
  TOTAL_JOBS_DONT_HAVE_METADATA: Number,
  TOTAL_JOBS_SENT_TO_INDEX: Number,
}, { _id: false }) 

const transactionSchema = new Schema({
  country_code: String,
  currency_code: String,
  transactionSourceName: String,
  status: String,
  timestamp: Date,
  progress: progressSchema
}, { collection: 'transactions' })

module.exports = model('Transaction', transactionSchema)
