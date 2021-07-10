export default `
  type User {
    id: String!
    email: String!
    name: String!
    picture: String
  }

  type Error {
    field: String
    message: String
  }

  type AuthResponse {
    errors: [Error!]
    user: User
  }

  type GeneralBooleanResponse {
    errors: [Error!]
    success: Boolean 
  }

  input SignupInput {
    email: String!
    password: String!
    name: String!
    picture: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    email: String
    name: String
    picture: String
  }

  type Query {
    me: User
    userRegistered(email: String!): Boolean!
  }

  type Mutation {
    signup(input: SignupInput!): AuthResponse!
    login(input: LoginInput!): AuthResponse!
    logout: Boolean!
    updateProfile(input: UpdateProfileInput!): AuthResponse!
  }
`;
