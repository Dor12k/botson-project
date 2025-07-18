

const express = require('express')
const app = express()

const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const path = require('path')

dotenv.config()

app.use(cors());
app.use(express.json())

if(process.env.NODE_ENV == 'local'){
    app.use(cors({
        origin: 'http://localhost:5173',
        methods: 'GET,POST,PUT,DELETE',
        credentials: true
    }))
    app.get('/', (req, res) => {
        res.send('Backend is running locally!');
    });
}
else{
    app.use(cors({
        credentials: true
    }))
}

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "./frontend/dist")))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "./", "frontend", "dist",
            "index.html"))
    })
}


// Handel transaction request
app.use('/api/transactions', require('./routes/transactionsRoutes'))


// Handel chat request
app.use('/api/chat', require('./routes/chatAssistantRoutes'))






const dbConnect = async () => {

    try{
        if(process.env.NODE_ENV == 'local'){
            await mongoose.connect(process.env.LOCAL_DB_URI)
            console.log('Local Database Is Connected..')
        }
        else{
            await mongoose.connect(process.env.MONGODB_URI)
            console.log('Production Database Is Connected..')
        }
    } catch (error) {
        console.log('Database Connection Failed..')
    }
}
dbConnect()


const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server is running on port ${PORT}..`))

