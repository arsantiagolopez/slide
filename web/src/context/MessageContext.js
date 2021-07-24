import { createContext } from "react";

const MessageContext = createContext({
  myId: null,
  previews: null,
  previewsCopy: null,
  messageList: null,
  activeMessage: null,
  activeConversation: null,
  recipientId: null,
  loadedConversations: null,
  activeTimestamp: null,
  query: null,
  setQuery: () => {},
  setActiveTimestamp: () => {},
  setLoadedConversations: () => {},
  setRecipientId: () => {},
  setActiveConversation: () => {},
  setActiveMessage: () => {},
  setPreviewsCopy: () => {},
  setPreviews: () => {},
});

export { MessageContext };
