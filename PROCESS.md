# Process and Architecture

## 🏛 Architecture & Design Decisions

### Frontend

- Built with **React 18** and **Vite** for a fast development experience and modern tooling.
- **Tailwind CSS** for responsive and consistent styling across components.
- **React Router v7** manages navigation between multiple pages (Screen A & B).
- **Charting Libraries:**
  - `recharts` for time-series (line) visualization.
  - `react-chartjs-2` for pie charts representing transactions by country.
- Data fetching via **axios** from the Express backend.

### Backend

- Backend API implemented with **Node.js + Express** serving job indexing transaction logs.
- MongoDB used as the primary database, connected via environment variables.
- Development workflow uses `concurrently` to run both backend and frontend simultaneously.

#### Routing & Controller Separation

To maintain clean code architecture and separation of concerns:

- **Routes** (located in `/routes`) define API endpoints and HTTP methods.
- **Controllers** (in `/controllers`) encapsulate business logic, data queries, and error handling.

This modular design improves code maintainability, facilitates testing, and simplifies future extension.

---

## 🎨 UI Improvements

To enhance user experience and clarity, I made several visual improvements:

- **Header Navigation**
  - Redesigned `Header.jsx` with Tailwind CSS for modern layout and spacing.
  - Added active link highlighting via `NavLink` for better navigation feedback.
  - Ensured responsive design across different screen sizes.

- **Landing Page**
  - Bold typography and contrasting colors to emphasize key actions.
  - Buttons with hover transitions for improved interactivity.

---

## ✅ Current Functionality (Implemented)

- **Dashboard Page (Screen A):**

  - Filter by date, client name, and country.
  - View transactions in a sortable, paginated table.
  - Visualize trends:
    - Line chart of "Jobs Sent to Index" over time.
    - Pie chart showing job share by country.

- **Chat Assistant Backend:**

  - Fully implemented natural language assistant that:
    - Accepts user input via chat.
    - Sends it to the backend for AI-based interpretation.
    - Returns either a database query result + summary, or a clarification request if the question lacks context.


---


## 🧠 AI Tools Used in Development

Although the AI assistant is not fully integrated, I leveraged **ChatGPT** extensively to:

- Debug React components and chart rendering issues.
- Resolve dependency version conflicts.
- Refactor UI layout for better responsiveness.
- Generate component logic and optimize data filtering and sorting.

All AI-assisted code was thoroughly reviewed, tested, and customized to ensure full understanding and quality.


## 🤖 How the Assistant Works (Prompt-Based Logic)

The backend follows a multi-step strategy to handle natural language questions using the OpenAI API.

---

### Simulation Example

```js
/*
 * To see a real example, write 'example123' as the question.
 * This will process a query that retrieves all completed transactions from 'Deal4' in July 2025
 * where the total jobs sent to index are at least 10,000.
 */
```

### 1. **Check Sufficiency of Input**

Prompt sent to determine if the user’s question includes enough information to generate a database query:

```js
buildFirstPrompt(question):
  "You are an AI assistant. The user wants to analyze job indexing logs stored in MongoDB.

  Determine whether the user's question includes ALL required details to write a query.

  Return ONLY 'true' or 'false'.

  User: 'How many jobs were sent by Deal4 in July?'

  Answer: true

  User: 'Jobs by Deal4'

  Answer: false

  Now evaluate: ${question}"



### 2. Ask for More Info (if insufficient)

If the answer to the above is false, we ask the AI to generate a follow-up clarification

buildDialogPrompt(question):
  "You are an AI assistant helping a user query job indexing logs.

  The user asked: '${question}'.

  Ask one clear question to clarify what they're looking for. Be concise.

  For example, if the question is 'Jobs from Deal4', reply:
  'Which time range are you interested in for Deal4?'

  Only return the question text. No explanations."




### 3. Generate MongoDB Query (if sufficient)

If the user's question is complete, we generate a valid MongoDB query filter:

buildQueryPrompt(question):
  "You are an AI assistant converting natural language into MongoDB queries.

  Write ONLY a valid MongoDB query filter object in JSON.

  The user asked: '${question}'

  Return just the filter. Do not include code wrappers or explanations.

  Use ISO date strings where needed."



###  4. Summarize the Results

After querying the database, we summarize the results for the user:

buildAnswerPrompt(question, results):
"You are an AI assistant. Summarize the query result based on the user’s question.

User Question: '${question}'

Sample Data: ${JSON.stringify(results.slice(0, 10))}

Provide a short summary (1-2 sentences). Avoid mentioning databases or queries."

If no results were found:

"You are an AI assistant helping users understand data.

The user asked: '${question}'

The query returned no results.

Reply with a short, helpful message (e.g., 'No results found'). Do not mention databases."
```




## 🛠 Design Principles

Prompt-First Flow: Every decision depends on AI feedback—whether to query or ask for clarification.

Strict JSON Enforcement: Model is instructed to return parseable objects only.

Graceful Degradation: If the user input is vague, the assistant doesn’t fail—it requests clarification.

Post-Processing: Converts date strings to actual JavaScript Date objects before querying MongoDB.

Structured Response: The server always returns a unified JSON shape to simplify frontend handling.


---


## 🔄 Example Flow

User asks: "Show me jobs from Deal4 in July"

Prompt 1 → AI says: "true"

Prompt 2 → MongoDB query is generated and executed.

Prompt 3 → Summary is returned: "Deal4 submitted 85 jobs during July."

If the user had asked: "Jobs Deal4", then:

AI would respond: "false"

Clarification prompt is issued: "Which time range are you interested in for Deal4?"


---


## 🧪 Final Notes

The assistant now handles unclear input, valid queries, and summary generation.

Input is validated on the frontend to prevent blank or overly long questions.

The system supports future model replacements (Anthropic, Azure OpenAI, etc.) due to clear API abstraction.


---