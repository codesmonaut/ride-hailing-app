require(`dotenv`).config();

const express = require(`express`);
const mongoose = require(`mongoose`);

// APP CONFIG
const app = express();
const baseUrl = process.env.BASE_URL;
const port = process.env.PORT;
const database = process.env.DATABASE;

// MIDDLEWARES
app.use(express.json({ limit: '10kb' }));

// DB CONFIG
mongoose.connect(database)
.then(() => {
    console.log('Connected to database');
})

// API ENDPOINTS
app.get(`/`, (req, res) => {
    res.status(200).json({
        status: 200,
        msg: 'Welcome to Your Express.js App'
    })
})

// LISTENER
app.listen(port, () => {
    console.log(`Server is running: ${baseUrl}${port}/`);
})