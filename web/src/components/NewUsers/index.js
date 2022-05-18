import React from "react";
import { DesktopUsers } from "./DesktopUsers";
import { MobileUsers } from "./MobileUsers";

const NewUsers = ({
  users,
  height,
  active,
  setActive,
  friends,
  setFriends,
}) => {
  const sectionProps = {
    users,
    height,
    active,
    setActive,
    friends,
    setFriends,
  };

  return (
    <>
      <DesktopUsers {...sectionProps} />
      <MobileUsers {...sectionProps} />
    </>
  );
};

export { NewUsers };
