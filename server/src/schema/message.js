export default `
  type Message {
    id: String!
    senderId: String!
    recipientId: String!
    plateId: String
    body: String!
    seen: Boolean!
    archivedBy: [String]
    createdAt: String!
  }

  type NewestMessage {
    userId: String!
    message: Message!
  }

  type Conversation {
    userId: String!
    messages: [Message]!
  }

  type MessageUserProfiles {
    userId: String!
    fullName: String
    picture: String
  }

  type GenericMutationResponse {
    errors: [Error!]
    success: Boolean
  }

  input MessageInput {
    senderId: String
    recipientId: String!
    plateId: String
    body: String!
  }

  type Subscription {
    newPrivateMessage: Message!
    newPreview: Message!
  }

  type Query {
    getUniqueMessageUserIds: [String]!
    getMessageUserProfiles(userIds: [String]!): [MessageUserProfiles]!
    getNewestMessageByUsers(userIds: [String]!): [NewestMessage]!
    getRecentConversations(last: Int!, userIds: [String]!): [Conversation]!
    getUserConversation(userId: String!): [Message]!
  }

  type Mutation {
    createMessage(input: MessageInput!): GenericMutationResponse!
    archiveConversation(userId: String!): GenericMutationResponse!
    updateSeenStatus(userId: String!): GenericMutationResponse!
  }
`;
