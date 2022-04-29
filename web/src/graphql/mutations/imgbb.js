const UploadImage = `
  mutation UploadImage($picture: Upload!) {
    uploadImage(picture: $picture) {
      errors {
        field
        message
      }
      picture
    }
  } 
`;

export { UploadImage };
