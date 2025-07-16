

# AI Job Skill Analyzer

This is a full-stack project for Botson.ai's take-home assignment. It includes:
- A dashboard to visualize job indexing logs
- An AI assistant to answer natural language questions about the data

## 🧰 Technologies Used

- React 18 (Vite)
- Tailwind CSS
- React Router
- Node.js + Express
- MongoDB
- Axios
- OpenAI API (or other LLMs)

---

## ⚙️ Local Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Dor12k/botson-project.git
cd botson-project
```

### 2. Install backend dependencies

```bash
npm install
```

Create a .env file in the backend folder:

```bash
PORT=5000
NODE_ENV=local
LOCAL_DB_URI=mongodb://127.0.0.1:27017/botson
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

App should now be running on http://localhost:5173

### 4. Navigate to root project folder 

```bash
cd ..
npm run dev
```

### 5. Project structure


|-- frontend
|   |-- public
|   |   +-- vite.svg
|   |-- src
|   |   |-- assets
|   |   |   +-- react.svg
|   |   |-- components
|   |   |   +-- Index
|   |   |       |-- Header.jsx
|   |   |       +-- MainLayout.jsx
|   |   |-- pages
|   |   |   |-- ChatAssistant
|   |   |   |   +-- ChatAssistant.jsx
|   |   |   |-- Dashboard
|   |   |   |   +-- Dashboard.jsx
|   |   |   +-- Index
|   |   |       +-- Index.jsx
|   |   |-- App.css
|   |   |-- App.jsx
|   |   |-- index.css
|   |   +-- main.jsx
|   |-- .gitignore
|   |-- eslint.config.js
|   |-- index.html
|   |-- package-lock.json
|   |-- package.json
|   |-- postcss.config.cjs
|   |-- README.md
|   |-- tailwind.config.cjs
|   +-- vite.config.js
|-- models
|   +-- transactionModel.js
|-- routes
|   +-- transactionsRoutes.js
|-- .env
|-- .gitignore
|-- generate-structure.ps1
|-- package-lock.json
|-- package.json
|-- PROCESS.md
|-- project-structure.txt
|-- README.md
|-- server.js
+-- transformedFeeds.json


