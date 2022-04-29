import { createContext } from "react";

const UserContext = createContext({
  sortFriendsBy: null,
  sortConversationsBy: null,
  user: null,
  setUser: () => {},
  setSortConversationsBy: () => {},
  setSortFriendsBy: () => {},
});

export { UserContext };
