const NewPrivateMessage = `
  subscription {
    newPrivateMessage {
      id
      senderId
      recipientId
      body
      seen
      createdAt
    }
  }
`;

export { NewPrivateMessage };
