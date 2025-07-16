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
  - Filters for start/end date, country, and client name.
  - Sortable, paginated transaction table.
  - Line chart showing "Jobs Sent to Index" over time.
  - Pie chart grouping transactions by country.

- **Chat Assistant Backend:**
  - Receives user questions via POST.
  - Currently returns the submitted question text.
  - Calculates and returns average `TOTAL_JOBS_SENT_TO_INDEX` per client for the past month.
  - Prepares foundation for future OpenAI prompt integration.

---

## 🕐 Pending Work / Partial Completion

- **Screen B (AI Chat Assistant UI)** is not yet implemented.
- **OpenAI API integration and prompt design** are planned next steps.

---

## ✏️ Prompt Design (Planned)

The intended AI prompt for the assistant is:

> "You are a helpful assistant that analyzes job indexing logs. Use the provided data to answer user questions. Provide specific numbers and visual insights when possible."

Example user queries include:

- “How many jobs were indexed from the US last month?”
- “Which client submitted the most jobs this week?”
- “What’s the trend in indexing volume over the past 7 days?”

These inputs will be parsed and sent to an LLM (e.g., OpenAI) based on filtered backend data.

---

## 🧠 AI Tools Used in Development

Although the AI assistant is not fully integrated, I leveraged **ChatGPT** extensively to:

- Debug React components and chart rendering issues.
- Resolve dependency version conflicts.
- Refactor UI layout for better responsiveness.
- Generate component logic and optimize data filtering and sorting.

All AI-assisted code was thoroughly reviewed, tested, and customized to ensure full understanding and quality.
