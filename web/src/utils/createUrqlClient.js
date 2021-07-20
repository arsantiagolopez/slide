import { cacheExchange } from "@urql/exchange-graphcache";
import { multipartFetchExchange } from "@urql/exchange-multipart-fetch";
import ws from "isomorphic-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { dedupExchange, subscriptionExchange } from "urql";
import Config from "../config";
import { Me as MeQuery } from "../graphql/queries/user";

const SERVER_URL = Config.serverUrl;

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
          register: (result, _, cache) => {
            const { register } = result;

            // Log user in on register
            cache.updateQuery({ query: MeQuery }, (data) => {
              if (register.errors) {
                return data;
              }
              return {
                me: register.profile,
              };
            });

            // Update profile picture query
            cache.invalidate("Query", "myProfilePicture");

            // Update my own profile information
            cache.invalidate("Query", "myProfile");

            // // Manually update query, inefficient to invalidate all users
            // cache.updateQuery({ query: AllUserProfilesQuery }, (data) => {
            //   if (register.errors) {
            //     return data;
            //   }

            //   // Add new user to cache
            //   return {
            //     allUserProfiles: [...data.allUserProfiles, register.profile],
            //   };
            // });
          },
          login: (result, _, cache) => {
            const { login } = result;

            // Log user in
            cache.updateQuery({ query: MeQuery }, (data) => {
              if (login.errors) {
                return data;
              }
              return {
                me: login.user,
              };
            });

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
