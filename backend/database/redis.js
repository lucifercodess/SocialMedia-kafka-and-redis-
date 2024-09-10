import Redis from "ioredis";


const redis = new Redis({
  host: '127.0.0.1', 
  port: 6379         
});

export const connectRedis = async (req, res) => {
  try {
    console.log('Redis connected!');
    return redis;
  } catch (error) {
    console.error('Redis connection error:', error);
  }
};
