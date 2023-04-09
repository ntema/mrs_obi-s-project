const redis = require('redis');
const consolelog = require('../utils/consolelog');
const { REDIS_PORT, REDIS_HOST_URI, REDIS_PASSWORD } = require('./constants');
const redisClient = redis.createClient({
    socket: {
        host: REDIS_HOST_URI,
        port: parseInt(REDIS_PORT)
    },
    password: REDIS_PASSWORD
});
redisClient.on('error', err => {
    consolelog('Error ' + err);
});
module.exports =redisClient;

const redisInfo= await redisClient.get(`activation-link/${_id}`)
redisClient.del(`activation-link/${_id}`)
redisClient.set(`activation-link/${user._id}`,
      JSON.stringify({
        token, refreshToken
      })
    )
