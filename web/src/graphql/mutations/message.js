const CreateMessage = `
  mutation CreateMessage($input: MessageInput!) {
    createMessage(input: $input) {
      errors {
        field
        message
      }
      success
    }
  }
`;

const ArchiveConversation = `
  mutation ArchiveConversation($userId: String!) {
    archiveConversation(userId: $userId) {
      errors {
        field
        message
      }
      success
    }
  }
`;

const UpdateSeenStatus = `
  mutation UpdateSeenStatus($userId: String!) {
    updateSeenStatus(userId: $userId) {
      errors {
        field
        message
      }
      success
    }
  }
`;

export { CreateMessage, ArchiveConversation, UpdateSeenStatus };
