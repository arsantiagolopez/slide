import {
  Button,
  Drawer,
  DrawerContent,
  Flex,
  Icon,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { useMutation } from "urql";
import { Editable } from "../../components/Editable";
import {
  Logout as LogoutMutation,
  UpdateProfile as UpdateProfileMutation,
} from "../../graphql/mutations/user";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { showToast } from "../../utils/showToast";
import { useUser } from "../../utils/useUser";
import { UpdateAvatar } from "../UpdateAvatar";

const Avatar = withUrqlClient(createUrqlClient)(({ isDesktop }) => {
  const [avatarSrc, setAvatarSrc] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user } = useUser({ redirectTo: "/login" });

  const [, updateProfileMutation] = useMutation(UpdateProfileMutation);

  const buttonRef = useRef(null);
  const firstField = useRef(null);

  const router = useRouter();

  // Logout mutation
  const [{ fetching: logoutLoading }, logoutMutation] =
    useMutation(LogoutMutation);

  // Get user's first name
  const getFirstName = (name) => name.split(" ")[0];

  // Update profile name
  const handleUpdate = async (name) => {
    const { data } = await updateProfileMutation({ input: { name } });

    if (data?.updateProfile.errors) {
      // Show error toast
      showToast({
        status: "error",
        title: "Something went wrong. Please try again later.",
      });
    } else if (data?.updateProfile.user) {
      // Successfully updated name
      showToast({
        status: "success",
        title: `Thanks ${getFirstName(name)}! Your info was updated.`,
      });
    }
  };

  // Logout then redirect
  const handleLogout = async () => {
    await logoutMutation();
    router.push("/login");
  };

  const nameEditableProps = { handleUpdate, defaultValue: user?.me?.name };

  const updateAvatarProps = { setAvatarSrc };

  // Update user avatar if user
  useEffect(() => {
    if (user) {
      setAvatarSrc(user?.me?.picture);
    }
  }, [user]);

  return (
    <>
      <Image
        onClick={onOpen}
        ref={buttonRef}
        src={avatarSrc}
        display={!isOpen ? "block" : "none"}
        {...styles.avatar}
      />

      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={firstField}
        finalFocusRef={buttonRef}
        {...styles.drawer}
      >
        <DrawerContent maxWidth={isDesktop ? "30vw" : "100%"}>
          <Flex paddingX={isDesktop ? "3em" : "2em"} {...styles.body}>
            <Flex {...styles.drawerNav}>
              <Icon
                as={IoArrowBackSharp}
                onClick={onClose}
                {...styles.returnButton}
              />
              Profile
            </Flex>

            <UpdateAvatar {...updateAvatarProps}>
              <Image
                src={avatarSrc}
                style={styles.picture}
                boxSize={isDesktop ? "15vw" : "50vw"}
              />
            </UpdateAvatar>

            <Flex {...styles.field}>
              <Text {...styles.label}>Your name</Text>
              <Editable {...nameEditableProps} />
            </Flex>

            <Flex {...styles.field} {...styles.logout}>
              <Button
                onClick={handleLogout}
                isLoading={logoutLoading}
                {...styles.logoutButton}
              >
                Log out
              </Button>
            </Flex>
          </Flex>
        </DrawerContent>
      </Drawer>
    </>
  );
});

export { Avatar };

// Styles

const styles = {
  avatar: {
    cursor: "pointer",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    width: "100%",
    borderRadius: "50%",
    objectFit: "cover",
  },
  drawer: {
    placement: "left",
  },
  body: {
    background: "white",
    direction: "column",
    justify: "flex-start",
    align: "center",
    height: "100%",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  drawerNav: {
    direction: "row",
    justify: "flex-start",
    align: "center",
    width: "100%",
    fontSize: "2em",
    fontWeight: "bold",
    paddingY: "2em",
  },
  returnButton: {
    marginRight: "1rem",
    cursor: "pointer",
  },
  picture: {
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    borderRadius: "50%",
    objectFit: "cover",
  },
  field: {
    direction: "column",
    paddingY: "3em",
    paddingX: "1em",
    width: "100%",
  },
  label: {
    color: "gray",
  },
  logout: {
    position: "absolute",
    bottom: "3em",
  },
  logoutButton: {
    alignSelf: "center",
    paddingY: "1em",
    paddingX: "3vh",
    borderRadius: "5em",
    minWidth: "12em",
    color: "white",
    fontSize: "1em",
    fontWeight: "bold",
    background: "rgba(246, 71, 71, 1)",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
};
