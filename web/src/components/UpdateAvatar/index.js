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

  const fileToDataUri = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.readAsDataURL(file);
    });

  const onDrop = useCallback(
    async ([file]) => {
      // Upload file to server
      if (file) {
        let test;

        console.log(file);

        fileToDataUri(file).then((dataUri) => {
          test = dataUri;
        });

        console.log(test);

        // TODO: CONTINUNE HERE

        return;

        console.log(file);
        // Upload image to ImgBB
        const {
          data: { uploadImage },
        } = await uploadImageMutation({ picture: file });

        console.log("UPLOADIMAGE", uploadImage);
        return;

        const picture = uploadImage;

        // Update profile with image
        const {
          data: { updateProfile },
        } = await updateProfileMutation({ picture });
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
