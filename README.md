


⚠️ **Important Notice:**

After switching to this branch, please run:

    npm install

to ensure all dependencies (including `openai`) are installed.

Also, make sure to update your `.env` file with the OpenAI API key:

    OPENAI_API_KEY="<your_openai_api_key_here>"

See the installation instructions below for more details.




# AI Job Skill Analyzer

This is a full-stack project for Botson.ai's take-home assignment. It includes:
- A dashboard to visualize job indexing logs
- An AI assistant to answer natural language questions about the data

## Screenshots

### Dashboard
![Dashboard Screenshot](https://github.com/user-attachments/assets/22a0ae18-722f-4b75-974d-6391d52acd27)

### Chat Assistant
![Chat Assistant Screenshot](https://github.com/user-attachments/assets/f2d5f12b-abd5-4217-bdd9-315d17931c60)


## 🧰 Technologies Used

- React 18 (Vite)
- Tailwind CSS
- React Router
- Node.js + Express
- MongoDB
- Axios
- OpenAI API 

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
OPENAI_API_KEY="<ENTER YOUR OPENAI API KEY HERE>"
```

🧠 Note: An OpenAI API key is required to enable the AI assistant functionality.
You can get one at: https://platform.openai.com/account/api-keys

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

- ✅ **Screen A (Dashboard)** is fully implemented and functional:

  - Fetches and displays job indexing logs from MongoDB.
  - Includes interactive filters, pagination, and client-level insights.

- ✅ **Screen B (AI Assistant)** is fully implemented:

  - The chat interface sends user input to the backend and receives a summarized analysis.
  - The backend uses OpenAI to generate responses (via `OPENAI_API_KEY` from the `.env` file).
  - Users must provide their own API key to enable the AI assistant (see `PROCESS.md` for setup instructions).
  - Prompt design and OpenAI API integration are already implemented and documented in `PROCESS.md`.

