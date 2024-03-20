const express = require('express');
const redis = require('redis');
const cors = require('cors');
const bodyParser = require('body-parser');
const bookRoutes = require("./routes/bookRoutes");
const {connection} = require("./config/db");
require("dotenv").config();


const app = express();


// Redis client
const redisClient = redis.createClient();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/', bookRoutes);

const PORT = process.env.PORT;
app.listen(PORT, async (req, res) => {
    try {
        await connection
        console.log("connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
    console.log(`Listening on ${PORT}`);
})