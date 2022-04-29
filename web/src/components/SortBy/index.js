import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const SortBy = ({ type }) => {
  const {
    sortConversationsBy,
    setSortConversationsBy,
    sortFriendsBy,
    setSortFriendsBy,
  } = useContext(UserContext);

  const handleClick = (choice) => {
    if (type === "CONVERSATIONS") return setSortConversationsBy(choice);
    if (type === "FRIENDS") return setSortFriendsBy(choice);
  };

  const isActive = (choice) => {
    if (type === "CONVERSATIONS" && sortConversationsBy === choice) return true;
    if (type === "FRIENDS" && sortFriendsBy === choice) return true;
    return false;
  };

  return (
    <Menu {...styles.wrapper}>
      {({ isOpen }) => (
        <>
          <MenuButton
            as={Button}
            rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            {...styles.button}
          >
            Sort by
          </MenuButton>

          <MenuList {...styles.list}>
            <MenuItem
              onClick={() => handleClick("DATE")}
              fontWeight={isActive("DATE") && "600"}
            >
              Most recent
              {isActive("DATE") && <CheckIcon {...styles.icon} />}
            </MenuItem>
            <MenuItem
              onClick={() => handleClick("NAME")}
              fontWeight={isActive("NAME") && "600"}
            >
              Name
              {isActive("NAME") && <CheckIcon {...styles.icon} />}
            </MenuItem>

            {type === "CONVERSATIONS" && (
              <MenuItem
                onClick={() => handleClick("UNREAD")}
                fontWeight={isActive("UNREAD") && "600"}
              >
                Unread
                {isActive("UNREAD") && <CheckIcon {...styles.icon} />}
              </MenuItem>
            )}
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export { SortBy };

// Styles

const styles = {
  wrapper: {
    zIndex: "100",
    placement: "bottom-end",
    boxShadow: "none",
  },
  button: {
    variant: "link",
    letterSpacing: "tighter",
    color: "gray.800",
    fontSize: { base: "1.25em", md: "1.5em" },
  },
  list: {},
  icon: {
    marginLeft: "auto",
    fontSize: "0.75em",
  },
};
