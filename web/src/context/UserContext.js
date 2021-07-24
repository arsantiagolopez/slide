import { createContext } from "react";

const UserContext = createContext({
  user: null,
  avatar: null,
  setUser: () => {},
});

export { UserContext };
