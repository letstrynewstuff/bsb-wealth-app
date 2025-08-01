const redis = require("redis");

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("❌ Redis Client Error:", err));
redisClient.on("connect", () => console.log("✅ Redis connected"));

module.exports = redisClient;
