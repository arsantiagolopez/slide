import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import "dotenv-safe/config";
import express from "express";
import session from "express-session";
import { applyMiddleware } from "graphql-middleware";
import { graphqlUploadExpress } from "graphql-upload";
import http from "http";
import Redis from "ioredis";
import path from "path";
import Config from "./config";
import models from "./models";

// Constants
const CLIENT_URL = Config.clientUrl;
const SERVER_URL = Config.serverUrl;
const COOKIE_NAME = Config.cookieName;
const NODE_ENV = Config.nodeEnv;
const SESSION_SECRET = Config.sessionSecret;
const PORT = Config.port;
const REDIS_URL = Config.redisUrl;
const DOMAIN = Config.domain;

// Express server
const app = express();

// "trust proxy" needed to allow cookie forwarding
app.set("trust proxy", 1);

// Enable uploads on the graphQL server
app.use(graphqlUploadExpress());

// Cors configuration
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// Set up Redis Store
const RedisStore = connectRedis(session);
const redisClient = new Redis(REDIS_URL);

// Session configuration
const mySession = session({
  name: COOKIE_NAME,
  secret: SESSION_SECRET,
  resave: false,
  // Only save session key on auth
  saveUninitialized: false,
  store: new RedisStore({ client: redisClient }),
  cookie: {
    // Lasts 1 day
    maxAge: 1000 * 60 * 60 * 24,
    // Set to true if only want to store in HTTPS
    secure: NODE_ENV === "production",
    // Prevents client side JS from reading cookie
    httpOnly: true,
    sameSite: "lax",
    domain: DOMAIN,
  },
});

app.use(mySession);

// Merge schema & create executable schema
const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, "./schema")));
const resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, "./resolvers"))
);
const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Start Apollo server
const apolloServer = new ApolloServer({
  schema: applyMiddleware(executableSchema),
  uploads: false, // Disable older graphql-upload
  // New context with WebSockets
  context: ({ req, res, connection }) => ({
    models,
    req,
    res,
    session: req ? req.session : "",
    url: req ? `${req.protocol}://${req.get("host")}` : "", // Current url of server
    connection,
  }),

  // Lines below find req.session.userId value when req is undefined because of WebSockets
  subscriptions: {
    onConnect: async (_, webSocket) => {
      const wsSession = await new Promise((resolve) => {
        // use same session parser as normal gql queries
        mySession(webSocket.upgradeReq, {}, () => {
          if (webSocket.upgradeReq.session) {
            resolve(webSocket.upgradeReq.session);
          }
          return false;
        });
      });
      // We have a good session. attach to context
      if (wsSession.userId) {
        return { session: wsSession };
      }
      // throwing error rejects the connection
      throw new Error("Missing auth token!");
    },
  },
});

// Apply server middleware
apolloServer.applyMiddleware({
  app,
  // Turn off Apollo Server's cors implementation as
  // custom configuration already set above
  cors: false,
});

// Apply custom middleware
apolloServer.app;

// Subscriptions WebSocket installation
const httpServer = http.createServer(app);
apolloServer.installSubscriptionHandlers(httpServer);

// Initialize the database & Launch the server
models.sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.info(`Server is running at ${SERVER_URL}`);
    });
  })
  .catch((err) => console.error(err.stack));
