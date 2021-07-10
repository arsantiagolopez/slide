const Me = `
  query Me {
    me {
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
