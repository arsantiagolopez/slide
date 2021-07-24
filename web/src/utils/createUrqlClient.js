import { cacheExchange } from "@urql/exchange-graphcache";
import { multipartFetchExchange } from "@urql/exchange-multipart-fetch";
import ws from "isomorphic-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { dedupExchange, subscriptionExchange } from "urql";
import Config from "../config";
import { Me as MeQuery } from "../graphql/queries/user";

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
      updates: {
        Mutation: {
          signup: (result, _, cache) => {
            const { signup } = result;

            // Log user in on signup
            cache.invalidate("Query", "me");
          },
          login: (result, _, cache) => {
            const { login } = result;

            // Log user in
            cache.invalidate("Query", "me");

            // Update profile picture query
            cache.invalidate("Query", "myProfilePicture");

            // Update my own profile information
            cache.invalidate("Query", "myProfile");
          },
          logout: (_, __, cache) => {
            // Log user out
            cache.updateQuery({ query: MeQuery }, () => ({ me: null }));

            // Update profile picture query
            cache.invalidate("Query", "myProfilePicture");

            // Update my own profile information
            cache.invalidate("Query", "myProfile");
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
