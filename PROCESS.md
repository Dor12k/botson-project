

# Process and Architecture


# PROCESS.md

## 🏛 Architecture & Design Decisions

### Frontend

- Built with **React 18** and **Vite** for a fast development experience and modern tooling.
- **Tailwind CSS** was used for responsive and consistent styling across components.
- Used **React Router v7** to manage navigation between multiple pages (A & B).
- **Charting Libraries:**
  - `recharts` for time-series (line) visualization.
  - `react-chartjs-2` for the pie chart representing transactions by country.
- Data fetched using **axios** from the Express backend.

### Backend

- A simple **Node.js + Express** API serves job indexing transaction logs.
- MongoDB used as a local data source via connection string in `.env`.
- Used `concurrently` to run both server and frontend in development.

---

## ✅ Current Functionality (Implemented)

- **Dashboard Page (Screen A):**
  - Filter by start/end date, country, and client name.
  - Sortable, paginated table of job transactions.
  - Line chart of "Jobs Sent to Index" over time.
  - Pie chart of transactions grouped by country.

---

## 🕐 Pending Work / Partial Completion

- **Screen B (Chat with AI assistant)** is not yet implemented.
- **Prompt design and OpenAI API integration** are still in planning.

---

## ✏️ Prompt Design (Planned)

Although not implemented, this is the prompt I intended to use for the AI assistant:

> "You are a helpful assistant that analyzes job indexing logs. Use the provided data to answer user questions. Provide specific numbers and visual insights when possible."

Examples of expected user inputs:

- “How many jobs were indexed from the US last month?”
- “Which client submitted the most jobs this week?”
- “What’s the trend in indexing volume over the past 7 days?”

These would be parsed and processed using the OpenAI API (or similar LLM), based on filtered backend data.

---

## 🧠 AI Tools Used in Development

While I did not integrate an AI assistant in the app yet, I used **ChatGPT** extensively to:

- Debug React and chart rendering issues.
- Understand dependency version mismatches.
- Refactor UI layout and improve responsiveness.
- Generate helpful component logic and improve sorting/filtering behavior.

All AI-assisted code was carefully reviewed, tested, and adjusted to ensure I fully understood its behavior and structure.

