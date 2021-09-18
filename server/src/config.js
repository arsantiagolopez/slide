// Server config file

require("dotenv").config();

export default {
  // Development
  nodeEnv: process.env.NODE_ENV || "production",
  port: process.env.PORT || 8000,
  cookieName: process.env.COOKIE_NAME || "cid",
  sessionSecret: process.env.SESSION_SECRET || "Auth Secret Key",
  databaseUrl: process.env.DATABASE_URL,
  serverUrl: process.env.SERVER_URL || "http://localhost:8000",
  clientUrl: process.env.CLIENT_URL || "http://localhost:7000",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  domain: process.env.DOMAIN,

  // ImgBB
  imgbb: {
    apiUrl: process.env.IMGBB_API_URL || "https://api.imgbb.com/1/upload",
    apiKey: process.env.IMGBB_API_KEY,
  },
};
