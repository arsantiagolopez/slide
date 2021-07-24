import React, { useEffect, useState } from "react";
import { generateGradientAvatar } from "../utils/generateGradientAvatar";
import { UserContext } from "./UserContext";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);

  // If user hasn't uploaded a picture, create random gradient avatar
  useEffect(() => {
    if (!avatar && !user?.me?.picture) {
      const background = generateGradientAvatar();
      setAvatar(background);
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        avatar,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider };
