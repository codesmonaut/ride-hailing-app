require(`dotenv`).config();

const express = require(`express`);
const mongoose = require(`mongoose`);
const cookieParser = require(`cookie-parser`);

const authRouter = require(`./routes/auth.routes`);
const driverRouter = require(`./routes/driver.routes`);

// APP CONFIG
const app = express();
const baseUrl = process.env.BASE_URL;
const port = process.env.PORT;
const database = process.env.DATABASE;

// MIDDLEWARES
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// STATIC FILES
app.use(`/uploads`, express.static(`${__dirname}/uploads`));

// DB CONFIG
mongoose.connect(database).then(() => console.log('Connected to database'));

// API ENDPOINTS
app.use(`/api/v1/auth`, authRouter);
app.use(`/api/v1/drivers`, driverRouter);

// LISTENER
app.listen(port, () => {
    console.log(`Server is running: ${baseUrl}${port}/`);
})