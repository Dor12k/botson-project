

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
cd Botson
```

### 2. Install backend dependencies

npm install

Create a .env file in the backend folder:

PORT=5000
NODE_ENV=local
LOCAL_DB_URI=mongodb://127.0.0.1:27017/botson

npm run dev

### 3. Install frontend dependencies

cd frontend
npm install

App should now be running on http://localhost:5173