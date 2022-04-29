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
  query GetNewestUsers {
    getNewestUsers {
      id
      email
      name
      picture
    }
  }
`;

const GetAllFollowersById = `
  query GetAllFollowersById($id: String!) {
    getAllFollowersById(id: $id) {
      id
      email
      name
      picture
    }
  }
`;

const GetAllFollowingById = `
  query GetAllFollowingById($id: String!) {
    getAllFollowingById(id: $id) {
      id
      email
      name
      picture
    }
  }
`;

const GetUserProfileById = `
  query GetUserProfileById($id: String!) {
    getUserProfileById(id: $id) {
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
  GetUserProfileById,
};
