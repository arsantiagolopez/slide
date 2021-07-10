const Signup = `
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      errors {
        field
        message
      }
      user {
        email
        name
        picture
      }
    }
  }
`;

const Login = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      errors {
        field
        message
      }
      user {
        email
        name
        picture
      } 
    }
  }
`;

const Logout = `
  mutation Logout {
    logout
  }
`;

const UpdateProfile = `
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      errors {
        field
        message
      }
      user {
        email
        name
        picture
      }
    }
  }
 `;

export { Signup, Login, Logout, UpdateProfile };
