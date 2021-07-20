import { Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { MessageContext } from "../../context/MessageContext";

const Search = ({ searchValue, setSearchValue }) => {
  const [isSearchFocused, setSearchFocused] = useState(false);

  const { previewsCopy, setPreviews } = useContext(MessageContext);

  const handleChange = (event) => setSearchValue(event.target.value);

  // Filter previews based on name
  useEffect(() => {
    if (previewsCopy) {
      const previews = previewsCopy.filter(({ recipientInfo }) => {
        // Turn to lowercase to compare
        const name = recipientInfo.name.toLowerCase();
        const search = searchValue?.toLowerCase();

        const isMatch = name.includes(search);

        if (isMatch) return true;
      });

      // Set previews on search value change
      setPreviews(previews);
    }
  }, [searchValue]);

  return (
    <Flex {...styles.wrapper}>
      <InputGroup {...styles.searchBar}>
        {!isSearchFocused && (
          <InputLeftElement
            children={<IoSearchSharp color="gray.300" />}
            {...styles.icon}
          />
        )}
        <Input
          {...styles.input}
          paddingLeft={isSearchFocused ? "1" : "2.5rem"}
          placeholder="Search..."
          onChange={handleChange}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          paddingLeft={isSearchFocused && "3"}
        />
      </InputGroup>
    </Flex>
  );
};

export { Search };

// Styles
const styles = {
  wrapper: {
    justify: { base: "center", md: "flex-start" },
    align: "center",
    width: "100%",
    height: "50px",
    paddingY: "2em",
  },
  searchBar: {
    display: "flex",
    justifyContent: "flex-start",
    width: "100%",
    focusBorderColor: "gray.700",
  },
  icon: {
    pointerEvents: "none",
    zIndex: 0,
  },
  input: {
    focusBorderColor: "gray.800",
  },
};
