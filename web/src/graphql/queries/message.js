const GetConversations = `
  query GetConversations {
    getConversations {
      user {
        id
        name
        picture
      }
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

export { GetConversations };
