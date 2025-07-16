

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

### 2. Install server dependencies (root folder)

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

The frontend will be running on [http://localhost:5173](http://localhost:5173)  
and the backend (Express server) on [http://localhost:5000](http://localhost:5000)


### 4. Navigate to root project folder 

```bash
cd ..
npm run dev
```

### 5. Project Structure

See `project-structure.txt` for a detailed overview of the folder and file hierarchy.

---


## 🚧 Project Status

- ✅ **Screen A (Dashboard)** is fully implemented.

- 🟡 **Screen B (AI Assistant)** is partially implemented:
  - The chat interface works and sends user input to the backend.
  - The server responds with a dynamic aggregation (average jobs sent per client in the last month), as a placeholder for AI analysis.
  - Prompt design and OpenAI API integration are outlined in `PROCESS.md` and planned for next steps.


