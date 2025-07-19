
// File name: chatAssistant.Controller.js

const transactionModel = require('../models/transactionModel');
const { askChatGPT } = require('../services/openaiService');

/**
 * Builds the initial prompt for the language model to decide
 * whether it has enough information to generate a MongoDB query.
 *
 * The prompt includes:
 * - A description of the schema and a sample document
 * - A clear task instruction for the model to return either "true" or "false"
 *   depending on whether the user's question is sufficient
 *
 * @param {string} userQuestion - The user's natural language input
 * @returns {string} - A formatted prompt to be sent to the language model
 */
const buildFirstPrompt = (userQuestion) => {
  return `
    You are a helpful assistant that helps generate MongoDB queries based on natural language questions.

    You have access to a MongoDB collection with the following structure:
    Each document represents a job indexing log.

    Schema:
    - _id: ObjectId
    - country_code: string (e.g., "US")
    - currency_code: string (e.g., "USD")
    - transactionSourceName: string (e.g., "Deal1", "Deal2", etc.)
    - status: string ("completed")
    - timestamp: ISO date string
    - recordCount: number
    - uniqueRefNumberCount: number
    - noCoordinatesCount: number
    - progress: object {
        SWITCH_INDEX: boolean,
        TOTAL_RECORDS_IN_FEED: number,
        TOTAL_JOBS_IN_FEED: number,
        TOTAL_JOBS_FAIL_INDEXED: number,
        TOTAL_JOBS_SENT_TO_ENRICH: number,
        TOTAL_JOBS_DONT_HAVE_METADATA: number,
        TOTAL_JOBS_DONT_HAVE_METADATA_V2: number,
        TOTAL_JOBS_SENT_TO_INDEX: number
    }

    Sample document:
    {
    "_id": "68709db2402cf56cd3813d9e",
    "country_code": "US",
    "currency_code": "USD",
    "progress": {
        "SWITCH_INDEX": true,
        "TOTAL_RECORDS_IN_FEED": 16493,
        "TOTAL_JOBS_FAIL_INDEXED": 1521,
        "TOTAL_JOBS_IN_FEED": 13705,
        "TOTAL_JOBS_SENT_TO_ENRICH": 20,
        "TOTAL_JOBS_DONT_HAVE_METADATA": 2540,
        "TOTAL_JOBS_DONT_HAVE_METADATA_V2": 2568,
        "TOTAL_JOBS_SENT_TO_INDEX": 13686
    },
    "status": "completed",
    "timestamp": "2025-07-11T05:16:20.626Z",
    "transactionSourceName": "Deal4",
    "noCoordinatesCount": 160,
    "recordCount": 11118,
    "uniqueRefNumberCount": 9253
    }

    ---

    Now, analyze the following user question and decide:
    1. Do you have enough information to generate a MongoDB query?
    2. If yes:
        - respond only with: true
    3. If not:
        - respond only with: false

    Be clear and concise.

    User question: "${userQuestion}"
    `;
};

/**
 * Builds a prompt instructing the AI to generate a follow-up question.
 * This is used when the user's original question lacks enough information
 * to generate a proper MongoDB query.
 * 
 * The returned prompt asks the AI to request more details from the user,
 * and provides an example format to make the follow-up clearer and more helpful.
 *
 * @param {string} userQuestion - The original question from the user.
 * @returns {string} A prompt for the AI to generate a natural-language follow-up question.
 */
const buildDialogPrompt = (userQuestion) => {
  return `
    The user's previous question was: '${userQuestion}'.

    It did not include enough information to generate a MongoDB query.

    Please write a short, natural-language follow-up question to the user, asking for the missing details. Include an example in your message to guide the user.

    Example format:
    "Could you please specify the time range you are interested in? For example: 'From July 1st to July 31st, 2025'."

    Only return the follow-up message, no explanations.
  `
}

/**
 * Builds a prompt instructing the AI to generate a MongoDB query object.
 * This is used when the user's question was determined to be clear and specific enough.
 *
 * The prompt describes the expected fields in the data model and how to
 * properly query the 'timestamp' field (as a string, using $expr and $toDate).
 *
 * The AI is instructed to return only a valid JSON object — no explanation, no formatting, no JS.
 *
 * @param {string} userQuestion - The original user question that was deemed valid.
 * @returns {string} A prompt for the AI to generate a MongoDB query object in pure JSON format.
 */
const buildQueryPrompt = (userQuestion) => {
  return `
You answered true, which means that the question: '${userQuestion}' is clear and you understand the user's request and can generate the proper MongoDB query object.

You are a helpful assistant that converts plain English questions into MongoDB query objects.

Your task is to return only a valid JSON object that can be parsed by JSON.parse().

Assume the data model includes the following fields (use exactly these field names and types):

- transactionSourceName (string)
- status (string)
- timestamp (string in ISO 8601 format)
- progress.TOTAL_JOBS_SENT_TO_INDEX (number)
- amount (number)
- description (string)

Important instructions:
- The 'timestamp' field is stored as a string. To filter by date, always use the MongoDB operators "$expr" and "$toDate" to convert the string to a date for comparison.
- To compare numeric fields (e.g. progress.TOTAL_JOBS_SENT_TO_INDEX), use operators like "$gte", "$gt", "$lte", "$lt" with numeric values.
- Do NOT use JavaScript code such as "new Date()".
- Do NOT refer to variables or fields not listed above.
- Return ONLY a valid JSON object with the filter criteria, no explanations or code snippets.
- Use the exact field names, including nested fields like "progress.TOTAL_JOBS_SENT_TO_INDEX" when appropriate.

---

Example:

Question:
"Show me all completed transactions from Deal4 in July 2025 where total jobs sent to index are greater than or equal to 10,000"

Answer:
{
  "transactionSourceName": "Deal4",
  "status": "completed",
  "progress.TOTAL_JOBS_SENT_TO_INDEX": { "$gte": 10000 },
  "$expr": {
    "$and": [
      { "$gte": [{ "$toDate": "$timestamp" }, "2025-07-01T00:00:00Z"] },
      { "$lte": [{ "$toDate": "$timestamp" }, "2025-07-31T23:59:59Z"] }
    ]
  }
}
`;
};

/**
 * Builds a prompt instructing the AI to analyze MongoDB query results
 * and generate a short, natural language answer to the user's question.
 *
 * @param {string} userQuestion - The original question from the user.
 * @param {object[]} queryResults - The result of the MongoDB query (array of documents).
 * @returns {string} A prompt for the AI to summarize the data in natural language.
 */
const buildAnswerPrompt = (userQuestion, queryResults) => {
  if (!queryResults || queryResults.length === 0) {
    return `
      You are an AI assistant helping users understand data.

      The user asked:
      "${userQuestion}"

      However, the query returned no results.

      Respond with a short, natural sentence like "No results found" or a similar message.
      Do not mention databases, queries, or technical terms.
    `;
  }

  // Sample up to 10 records for clarity
  const sample = queryResults.slice(0, 10);
  const sampleData = JSON.stringify(sample, null, 2);

  return `
    You are an AI assistant helping users understand data.

    The user asked the following question:
    "${userQuestion}"

    You received the following results from a MongoDB database query (as an array of JSON documents):

    \`\`\`json
    ${sampleData}
    \`\`\`

    Your task is to generate a concise, human-readable answer that addresses the user's question,
    based **only** on the data provided.

    Guidelines:
    - Be concise: one or two clear sentences.
    - Focus on helpful insights, such as totals, averages, counts, trends, or anomalies.
    - Do **not** list every value; summarize patterns.
    - Do **not** mention MongoDB, JSON, or technical terms.
    - If possible, phrase the response as a direct answer to the user's question.
    `;
};

/**
 * Safely parses a JSON string into an object.
 * @param {string} queryString - The JSON string representing a MongoDB query.
 * @returns {Object} - The parsed query object.
 * @throws {Error} - If the string is not valid JSON.
 */
function parseQueryString(queryString) {
    try {
        return JSON.parse(queryString);
    } catch (error) {
        throw new Error("Invalid JSON string");
    }
}

/**
 * Transforms string date values in $expr.$and conditions into JavaScript Date objects.
 * This is necessary because MongoDB expects actual Date objects when querying by date.
 * @param {Object} queryObj - The parsed MongoDB query object.
 * @returns {Object} - The query object with transformed date strings.
 */
function transformExprDates(queryObj) {
    if (
        queryObj.$expr &&
        queryObj.$expr.$and &&
        Array.isArray(queryObj.$expr.$and)
    ) {
        queryObj.$expr.$and = queryObj.$expr.$and.map(condition => {
            const operator = Object.keys(condition)[0];
            const operands = condition[operator];

            // Check if condition uses a binary operator with a string date
            if (
                Array.isArray(operands) &&
                operands.length === 2 &&
                typeof operands[1] === "string"
            ) {
                return {
                    [operator]: [
                        operands[0],
                        new Date(operands[1]) // Convert string to Date object
                    ]
                };
            }

            return condition; // Leave unchanged if not a date string
        });
    }
    return queryObj;
}

/**
 * Executes a MongoDB query given as a string, after parsing and transforming it.
 * @param {string} queryString - The query string from the model or user input.
 * @returns {Promise<Array>} - A promise that resolves to the query results.
 */
async function executeQueryPrompt(queryString) {
    try {
        const parsedQuery = parseQueryString(queryString); // Step 1: Parse
        const transformedQuery = transformExprDates(parsedQuery); // Step 2: Transform
        const results = await transactionModel.find(transformedQuery).exec(); // Step 3: Query DB
        console.log("results", results);
        return results;
    } catch (error) {
        console.error("Failed to parse or execute query:", error);
        throw error;
    }
}

/**
 * Sends the user question (prompt) to ChatGPT and returns the response text.
 *
 * @param {string} userQuestion - The prompt to send to ChatGPT
 * @returns {Promise<string>} - The raw text response from ChatGPT
 */
const sendPromptToChat = async (userQuestion) => {

    try {
        const answer = await askChatGPT(userQuestion);
        return answer;
    } catch (err) {
            console.error('ChatGPT error:', err);
            throw new Error('Failed to get response from ChatGPT.');
    }
  
//   return "true"
};



/**
 * Handles a special example query when the user inputs the code 'example123'.
 * This function uses a predefined, guaranteed-to-work MongoDB query example,
 * executes it, generates a natural language summary via the AI model,
 * and returns the results and summary.
 * 
 * @param {string} question - The user question/input string.
 * @param {Function} executeQueryPrompt - Async function to execute the MongoDB query.
 * @param {Function} buildAnswerPrompt - Function to build prompt for summarizing results.
 * @param {Function} sendPromptToChat - Async function to send prompt to AI model and get response.
 * @param {Object} res - Express response object to send the JSON result.
 * 
 * @returns {Promise} - Returns the Express response with echo, summary, and results.
 */
async function handleExampleQuery(question, res) {
  if (question !== 'example123') {
    return null; // Not the example query, skip handling here
  }

  // Predefined MongoDB query object as a JSON string guaranteed to work
  const exampleQuery = `{
    "transactionSourceName": "Deal4",
    "status": "completed",
    "progress.TOTAL_JOBS_SENT_TO_INDEX": { "$gte": 10000 },
    "$expr": {
      "$and": [
        { "$gte": [{ "$toDate": "$timestamp" }, "2025-07-01T00:00:00Z"] },
        { "$lte": [{ "$toDate": "$timestamp" }, "2025-07-31T23:59:59Z"] }
      ]
    }
  }`;

  try {
    // Step 1: Execute the MongoDB query using the predefined example query
    const results = await executeQueryPrompt(exampleQuery);

    // Step 2: Build a prompt to ask the AI model to summarize the query results naturally
    const prompt = buildAnswerPrompt(question, results);

    // Step 3: Send the prompt to the AI model and receive a concise summary
    const summary = await sendPromptToChat(prompt);

    // const summary = `
    // During July 2025, multiple 'Deal4' sources submitted completed jobs, each indexing over 21,000 job entries.
    // Many submissions included thousands of jobs with missing metadata, and some also sent jobs for enrichment.
    // The number of indexing failures varied widely, ranging from dozens to over 3,000.
    // Overall, the data reflects high-volume activity with fluctuating data quality and varying processing success rates.
    // `;      

    // Step 4: Return the original question, summary, and raw results to the client
    return res.json({ echo: question, summary, results });

  } catch (error) {
    console.error('Error handling example query:', error);
    return res.status(500).json({ error: 'Failed to handle example query.' });
  }
}



/**
 * Express handler that processes a user's chat question,
 * interacts with a language model to generate a MongoDB query,
 * executes the query, and returns the results.
 *
 * Steps:
 * 1. Validate that a question was provided in the request body.
 * 2. Use `buildFirstPrompt` to check if the question has enough info to build a query.
 * 3. If not enough info, send a follow-up question to the user.
 * 4. If enough info, generate the MongoDB query JSON string with `buildQueryPrompt`.
 * 5. Execute the MongoDB query against the database.
 * 6. Return the query results or handle errors accordingly.
 *
 * Note:
 * - Currently, the example query is hardcoded to simulate a response from the AI model.
 * - In production, you would use the actual `queryString` from the model.
 *
 * @param {Object} req - Express request object, expects `question` in `req.body`
 * @param {Object} res - Express response object
 */
const handleChatQuestion = async (req, res) => {

    const { question } = req.body;

    if (!question) 
        return res.status(400).json({ error: 'Question is required' });

    try {
        // Example: simulate model's query response as a JSON string
        if (question == 'example123'){
            // Step 7: Return the original user question, the AI-generated summary, and the raw query results to the client
            return handleExampleQuery(question, res);
        }
        else{
            // Step 1: Check if there's enough information to generate a query
            let prompt = buildFirstPrompt(question);
            let response = await sendPromptToChat(prompt); // expects 'true' or 'false'

            if (response === 'false') {
                // Step 2: Ask user for more details with a follow-up question
                prompt = buildDialogPrompt(question);
                response = await sendPromptToChat(prompt);
                return res.json({ echo: question, summary: null, results: null, answer: response });
            }

            if (response === 'true') {

                // Step 3: Build the MongoDB query prompt in JSON format
                prompt = buildQueryPrompt(question);

                const queryString = await sendPromptToChat(prompt);

                try {
                    // Step 4: Execute the MongoDB query using the constructed example query and retrieve the results
                    const results = await executeQueryPrompt(queryString);

                    // Step 5: Build a prompt that instructs the AI model to generate a natural language summary of the query results
                    prompt = buildAnswerPrompt(question, results);

                    // Step 6: Send the prompt to the AI model and get a concise summary of the query results
                    const summary = await sendPromptToChat(prompt);

                    // Step 7: Return the original user question, the AI-generated summary, and the raw query results to the client
                    return res.json({ echo: question, summary, results, answer: null });

                } catch (e) {
                    // Failed to parse or execute the query from AI
                    return res.status(500).json({ error: 'Failed to parse query from AI' });
                }
            }
            // Fallback if response is unexpected
            return res.json({ echo: question, answer: 'Could not process the question' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};





module.exports = { handleChatQuestion };






