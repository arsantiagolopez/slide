import { cacheExchange } from "@urql/exchange-graphcache";
import { multipartFetchExchange } from "@urql/exchange-multipart-fetch";
import ws from "isomorphic-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { dedupExchange, subscriptionExchange } from "urql";
import Config from "../config";

const SERVER_URL = Config.serverUrl;

// Replace "https://" with "ws://"
// Subscription client URL must be in the format "ws://{domain}"
const httpToWs = (url) => {
  if (url.includes("https")) {
    return url.replace("https", "wss");
  }
  // If development, "http" instead of "https"
  return url.replace("http", "ws");
};
const socketUrl = `${httpToWs(SERVER_URL)}/graphql`;

const subscriptionClient = new SubscriptionClient(
  socketUrl,
  {
    reconnect: true,
  },
  ws
);

const createUrqlClient = (ssrExchange) => ({
  url: `${SERVER_URL}/graphql`,
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [
    dedupExchange,
    // Normalized caching
    cacheExchange({
      keys: {
        MessageUserProfiles: (data) => data.userId,
        NewestMessage: (data) => data.userId,
        Conversation: (data) => data.userId,
      },
      updates: {
        Mutation: {
          signup: (_, __, cache) => {
            // Log user in on signup
            cache.invalidate("Query", "me");
            cache.invalidate("Query", "getUniqueMessageUserIds");
            cache.invalidate("Query", "getNewestUsers");
          },
          login: (_, __, cache) => {
            // Log user in
            cache.invalidate("Query", "me");
            cache.invalidate("Query", "getUniqueMessageUserIds");
            cache.invalidate("Query", "getNewestUsers");
          },
          logout: (_, __, cache) => {
            // Log user out
            cache.invalidate("Query", "me");
          },
          updateProfile: (_, __, cache) => {
            // Revalidate profile info
            cache.invalidate("Query", "me");
          },
        },
      },
    }),
    ssrExchange,
    multipartFetchExchange,
    subscriptionExchange({
      forwardSubscription(operation) {
        return subscriptionClient.request(operation);
      },
    }),
  ],
});

export { createUrqlClient };
