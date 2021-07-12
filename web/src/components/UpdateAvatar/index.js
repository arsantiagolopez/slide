import { Flex } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "urql";
import { UploadImage as UploadImageMutation } from "../../graphql/mutations/imgbb";
import { UpdateProfile as UpdateProfileMutation } from "../../graphql/mutations/user";

const UpdateAvatar = ({ children }) => {
  const [file, setFile] = useState();
  const [, updateProfileMutation] = useMutation(UpdateProfileMutation);
  const [, uploadImageMutation] = useMutation(UploadImageMutation);

  const onDrop = useCallback(
    async ([file]) => {
      // Upload file to server
      if (file) {
        file["url"] = URL.createObjectURL(file);

        // Upload image to ImgBB
        const {
          data: { uploadImage },
        } = await uploadImageMutation({ picture: file });

        const picture = uploadImage?.picture;

        // TODO: Show error toast
        if (!picture) {
          return console.log(
            "Something went wrong trying to upload your picture. Try again later"
          );
        }

        // Update profile with image
        const {
          data: { updateProfile },
        } = await updateProfileMutation({ input: { picture } });

        console.log(updateProfile);
      }
    },
    [updateProfileMutation]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple: false,
    onDrop,
  });

  useEffect(() => {
    return () => {
      if (file) {
        // Revoke the data uris to avoid memory leaks
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  return (
    <Flex {...styles.wrapper} {...getRootProps()}>
      {children}
      <input {...getInputProps()} />
    </Flex>
  );
};

export { UpdateAvatar };

// Styles

const styles = {
  wrapper: {
    justify: "center",
    width: "100%",
    cursor: "pointer",
  },
};
