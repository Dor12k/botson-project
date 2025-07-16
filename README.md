

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

### 5. Project Structure

See `project-structure.txt` for a detailed overview of the folder and file hierarchy.


|-- frontend
|   |-- public/
|   |-- src/
|   |   |-- assets/
|   |   |-- components/Index/
|   |   |-- pages/ChatAssistant/
|   |   |-- pages/Dashboard/
|   |   |-- pages/Index/
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |-- ...
|
|-- models/
|-- routes/
|-- server.js
|-- .env
|-- PROCESS.md
|-- README.md



---

## 🚧 Project Status

This is an MVP (Minimum Viable Product) version.

✅ Screen A (Dashboard) is fully implemented.  
❌ Screen B (AI assistant) and OpenAI integration are planned but not yet completed.
