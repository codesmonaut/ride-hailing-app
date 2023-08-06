require(`dotenv`).config();

const express = require(`express`);
const mongoose = require(`mongoose`);
const cookieParser = require(`cookie-parser`);
const helmet = require(`helmet`);
const hpp = require(`hpp`);
const cors = require(`cors`);
const rateLimit = require(`express-rate-limit`);
const mongoSanitize = require(`express-mongo-sanitize`);

const authRouter = require(`./routes/auth.routes`);
const driverRouter = require(`./routes/driver.routes`);
const userRouter = require(`./routes/user.routes`);
const riderRouter = require(`./routes/rider.routes`);
const serverLimit = require(`./config/serverLimit`);
const ErrorResponse = require(`./util/ErrorResponse`);
const handleError = require(`./util/handleError`);

// APP CONFIG
const app = express();
const baseUrl = process.env.BASE_URL;
const port = process.env.PORT;
const database = process.env.DATABASE;

// MIDDLEWARES
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(helmet());
app.use(hpp());
app.use(cors());
app.use(rateLimit(serverLimit));
app.use(mongoSanitize());

// STATIC FILES
app.use(`/uploads`, express.static(`${__dirname}/uploads`));

// DB CONFIG
mongoose.connect(database).then(() => console.log('Connected to database'));

// API ENDPOINTS
app.use(`/api/v1/auth`, authRouter);
app.use(`/api/v1/drivers`, driverRouter);
app.use(`/api/v1/users`, userRouter);
app.use(`/api/v1/riders`, riderRouter);

app.all(`*`, (req, res) => {
    handleError(res, new ErrorResponse(404, `Page ${req.originalUrl} that you are looking for was not found.`));
})

// LISTENER
app.listen(port, () => {
    console.log(`Server is running: ${baseUrl}${port}/`);
})