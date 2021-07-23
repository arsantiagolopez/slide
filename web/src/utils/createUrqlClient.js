import { cacheExchange } from "@urql/exchange-graphcache";
import { multipartFetchExchange } from "@urql/exchange-multipart-fetch";
import ws from "isomorphic-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { dedupExchange, subscriptionExchange } from "urql";
import Config from "../config";
import { Me as MeQuery } from "../graphql/queries/user";

const SERVER_URL = Config.serverUrl;

// TODO: before prod: localhost:8000

const subscriptionClient = new SubscriptionClient(
  "ws://localhost:8000/graphql",
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
