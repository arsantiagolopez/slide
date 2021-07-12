export default `
  scalar Upload

  type Error {
    field: String
    message: String
  }

  type UploadImageResponse {
    errors: [Error!]
    picture: String
  }

  type Mutation {
    uploadImage(picture: Upload!): UploadImageResponse!
  }
`;
