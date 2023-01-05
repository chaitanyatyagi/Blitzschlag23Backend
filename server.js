const dotenv = require("dotenv")
const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const cors = require("cors")
const mongoose = require("mongoose")
const app = express()
const helmet = require("helmet")
const cookieParser = require("cookie-parser")
const PORT = process.env.PORT || 2080
const userRouter = require("./routes/userRoutes")
const pdfRouter = require("./routes/pdfRouter")
const authController = require("./controller/authController")
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config({
    path: "./config.env"
})

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const DB = process.env.DATABASE
mongooseOptions = {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
    keepAliveInitialDelay: 300000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    minPoolSize: 3,
};

mongoose.set('strictQuery', true)

mongoose.connect(DB, mongooseOptions).then(() => {
    console.log("Database Connected !")
})

mongoose.connection.on("error", (error) => {
    console.log(error)
})

app.use('/users', userRouter)
app.use('/rulebook', pdfRouter)

const { initPayment, responsePayment } = require("./paytm/services/index");

app.get("/paywithpaytm", (req, res) => {
    console.log("payment requested");
    initPayment(req.query.amount).then(
        success => {
            console.log(success);
            res.json({
                resultData: success,
                paytmFinalUrl: process.env.PAYTM_FINAL_URL
            });
        },
        error => {
            res.send(error);
        }
    );
});

app.post("/paywithpaytmresponse", (req, res) => {
    responsePayment(req.body).then(
        success => {

            res.json({ resultData: "true", responseData: success });
        },
        error => {
            res.send(error);
        }
    );
});

app.all("*", (req, res) => {
    res.status(404).json({
        message: `Can't find ${req.originalUrl} on this server!`,
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port`)
})