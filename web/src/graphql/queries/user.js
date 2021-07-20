const Me = `
  query Me {
    me {
      id
      email
      name
      picture
    }
  }
`;

const UserRegistered = `
  query UserRegistered($email: String!) {
    userRegistered(email: $email)
  }
`;

export { Me, UserRegistered };
