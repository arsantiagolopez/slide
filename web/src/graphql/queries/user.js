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

const GetNewestUsers = `
  query getNewestUsers {
    getNewestUsers {
      id
      email
      name
      picture
    }
  }
`;

const GetAllFollowersById = `
  query getAllFollowersById($id: String!) {
    getAllFollowersById(id: $id) {
      id
      email
      name
      picture
    }
  }
`;

const GetAllFollowingById = `
  query getAllFollowingById($id: String!) {
    getAllFollowingById(id: $id) {
      id
      email
      name
      picture
    }
  }
`;

export {
  Me,
  UserRegistered,
  GetNewestUsers,
  GetAllFollowersById,
  GetAllFollowingById,
};
