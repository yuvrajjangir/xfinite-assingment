const Redis = require('ioredis');
require('dotenv').config();

const redisClient = new Redis({
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = redisClient;
