import React, { useState } from "react";
import { UserContext } from "./UserContext";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sortConversationsBy, setSortConversationsBy] = useState("DATE");
  const [sortFriendsBy, setSortFriendsBy] = useState("DATE");

  return (
    <UserContext.Provider
      value={{
        sortFriendsBy,
        sortConversationsBy,
        user,
        setUser,
        setSortConversationsBy,
        setSortFriendsBy,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider };
