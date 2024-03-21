const express = require('express');
const redisClient = require('./config/redisConfig');
const cors = require('cors');
const bodyParser = require('body-parser');
const bookRoutes = require("./routes/bookRoutes");
const {connection} = require("./config/db");
require("dotenv").config();


const app = express();


app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/', bookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
  console.log(`Listening on port ${PORT}`);
});