import { createContext } from "react";

const MessageContext = createContext({
  myId: null,
  previews: null,
  previewsCopy: null,
  messageList: null,
  activeMessage: null,
  recipientId: null,
  activeTimestamp: null,
  query: null,
  liveMessage: null,
  refetchConversations: () => {},
  setQuery: () => {},
  setActiveTimestamp: () => {},
  setRecipientId: () => {},
  setActiveMessage: () => {},
  setPreviewsCopy: () => {},
  setPreviews: () => {},
});

export { MessageContext };
