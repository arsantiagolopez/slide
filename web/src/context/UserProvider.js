import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { createUrqlClient } from "../utils/createUrqlClient";
import { UserContext } from "./UserContext";

const UserProvider = withUrqlClient(createUrqlClient)(({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
});

export { UserProvider };
