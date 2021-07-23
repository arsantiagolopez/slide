import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useQuery } from "urql";
import { UserContext } from "../context/UserContext";
import { Me as MeQuery } from "../graphql/queries/user";

const useUser = ({ redirectTo = false } = {}) => {
  // Authentication query
  const [{ data }] = useQuery({ query: MeQuery });

  const { setUser } = useContext(UserContext);

  const router = useRouter();

  // Redirect
  useEffect(() => {
    // If no redirectTo set or fetching, just return
    if (!redirectTo || !data) return;

    // If redirectTo is set, redirect if user not found
    if (redirectTo && !data?.me) {
      router.push(redirectTo);
    }
  }, [data, redirectTo]);

  // Update global user
  useEffect(() => setUser(data), [data]);

  return { user: data };
};

export { useUser };
