export default `
  type Message {
    id: String!
    senderId: String!
    recipientId: String!
    body: String!
    seen: Boolean!
    archivedBy: [String]
    createdAt: String!
  }

  type User {
    id: String!
    name: String!
    picture: String
  }

  type Conversation {
    user: User!
    messages: [Message]!
  }

  type GenericMutationResponse {
    errors: [Error!]
    success: Boolean
  }

  input MessageInput {
    senderId: String
    recipientId: String!
    body: String!
  }

  type Subscription {
    newPrivateMessage: Message!
    newPreview: Message!
  }

  type Query {
    getConversations: [Conversation]!
  }

  type Mutation {
    createMessage(input: MessageInput!): GenericMutationResponse!
    archiveConversation(userId: String!): GenericMutationResponse!
    updateSeenStatus(userId: String!): GenericMutationResponse!
  }
`;
