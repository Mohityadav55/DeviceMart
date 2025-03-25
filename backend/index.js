// const express = require('express')
// const cors = require('cors')
// const cookieParser = require('cookie-parser')
// require('dotenv').config()
// const connectDB = require('./config/db')
// const router = require('./routes')


const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const router = require('./routes');

const app = express();
const allowedOrigins = process.env.FRONTEND_URL;

app.use(cors({
    origin: allowedOrigins,
    credentials: true, 
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));
app.use(cookieParser());
app.use(express.json());
// app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
        console.log("Connected to DB");
        console.log(`Server is running on ${PORT}`);
    });
});