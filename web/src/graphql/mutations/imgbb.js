const UploadImage = `
  mutation UploadImage($picture: Upload!) {
    updateProfile(picture: $picture) {
      errors {
        field
        message
      }
      picture
    }
  }
`;

export { UploadImage };
