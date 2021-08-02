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
import { UpdateAvatar } from "../UpdateAvatar";

const Avatar = withUrqlClient(createUrqlClient)(({ user }) => {
  const [avatarSrc, setAvatarSrc] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [, updateProfileMutation] = useMutation(UpdateProfileMutation);

  const isPictureGradient = avatarSrc?.includes("linear-gradient");

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

  // Update user avatar if user
  useEffect(() => setAvatarSrc(user?.me?.picture), [user]);

  const nameEditableProps = { handleUpdate, defaultValue: user?.me?.name };
  const updateAvatarProps = { setAvatarSrc };

  return (
    <>
      <Flex onClick={onOpen} ref={buttonRef}>
        {isPictureGradient ? (
          <Flex background={avatarSrc} {...styles.avatar} />
        ) : (
          <Image src={avatarSrc} {...styles.avatar} />
        )}
      </Flex>

      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={firstField}
        finalFocusRef={buttonRef}
        {...styles.drawer}
      >
        <DrawerContent {...styles.content}>
          <Flex {...styles.body}>
            <Flex {...styles.drawerNav}>
              <Icon
                as={IoArrowBackSharp}
                onClick={onClose}
                {...styles.returnButton}
              />
              Profile
            </Flex>

            <UpdateAvatar {...updateAvatarProps}>
              <>
                {isPictureGradient ? (
                  <Flex background={avatarSrc} {...styles.picture} />
                ) : (
                  <Image src={avatarSrc} {...styles.picture} />
                )}
              </>
            </UpdateAvatar>

            <Flex {...styles.field}>
              <Text {...styles.label}>Your name</Text>
              <Editable {...nameEditableProps} />
            </Flex>

            <Flex {...styles.logout}>
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
    borderRadius: "50%",
    objectFit: "cover",
    boxSize: "2.5em",
  },
  drawer: {
    placement: "left",
  },
  content: {
    maxWidth: { base: "100%", md: "30vw" },
  },
  body: {
    zIndex: 1000,
    background: "white",
    direction: "column",
    justify: "flex-start",
    align: "center",
    height: "100%",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    paddingX: { base: "2em", md: "3em" },
  },
  drawerNav: {
    direction: "row",
    justify: "flex-start",
    align: "center",
    width: "100%",
    fontSize: "2em",
    fontWeight: "bold",
    paddingY: "5vh",
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
    boxSize: { base: "60vw", md: "15vw" },
  },
  field: {
    direction: "column",
    paddingY: "3vh",
    paddingX: "1em",
    width: "100%",
  },
  label: {
    color: "gray",
  },
  logout: {
    position: "absolute",
    bottom: { base: "5em", md: "10vh" },
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
