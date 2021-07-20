const GetUniqueMessageUserIds = `
  query GetUniqueMessageUserIds {
    getUniqueMessageUserIds
  }
`;

const GetMessageUserProfiles = `
  query GetMessageUserProfiles($userIds: [String]!) {
    getMessageUserProfiles(userIds: $userIds) {
      userId
      name
      picture
    }
  }
`;

const GetNewestMessageByUsers = `
  query GetNewestMessageByUsers($userIds: [String]!) {
    getNewestMessageByUsers(userIds: $userIds) {
      userId
      message {
        id
        body
        senderId
        recipientId
        seen
        createdAt
      }
    }
  }
`;

const GetRecentConversations = `
  query GetRecentConversations($last: Int!, $userIds: [String]!) {
    getRecentConversations(last: $last, userIds: $userIds) {
      userId
      messages {
        id
        body
        senderId
        recipientId
        seen
        createdAt
      }
    }
  }
`;

const GetUserConversation = `
  query GetUserConversation($userId: String!) {
    getUserConversation(userId: $userId) {
      id
      body
      senderId
      recipientId
      seen
      createdAt
    }
  }
`;

export {
  GetUniqueMessageUserIds,
  GetMessageUserProfiles,
  GetNewestMessageByUsers,
  GetRecentConversations,
  GetUserConversation,
};
