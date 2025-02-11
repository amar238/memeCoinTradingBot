const Redis = require('ioredis');
const logger = require('./logger');

const redis = new Redis({
    host: process.env.REDIS_HOST
});

redis.on('error', err => logger.error('Redis Error:', err));

module.exports = redis;