import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";

const SortBy = () => {
  // const { sortBy, setSortBy } = useContext(UserContext);

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
              // onClick={() => setSortBy("date")}
              // color={(sortBy === "date" && "link") || "text"}
              {...styles.item}
            >
              Most recent
              {/* {sortBy === "name" && <CheckIcon fontSize="0.75em" />} */}
            </MenuItem>
            <MenuItem
              // color={(sortBy === "name" && "link") || "text"}
              // onClick={() => setSortBy("name")}
              {...styles.item}
            >
              Name
              {/* {sortBy === "recent" && <CheckIcon fontSize="0.75em" />} */}
            </MenuItem>
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
  item: {},
};
