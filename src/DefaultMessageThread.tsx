import { ChatMessage, FluentThemeProvider, MessageStatus, MessageThread } from '@azure/communication-react';
import { useState } from 'react';

const database = CreateDatabase(); // Represents message stored in database.
var messageCursor = database.length - 1; // Cursor of the next message to retrieve.

// Function to initialize the "database" variable.
function CreateDatabase(): ChatMessage[] {
  var dt = new Date("2019-01-01T00:00:00.000+08:10");
  const dbMessages: ChatMessage[] = [];

  for (var i = 0; i < 200; i++) {
    dbMessages.push({
      messageType: "chat",
      senderId: "1",
      senderDisplayName: "Gilles TOURREAU",
      messageId: Math.random().toString(),
      content: "My custom message" + i,
      createdOn: new Date(dt.getTime() + 1000 * 60 * 60 * 24 * i),
      mine: true,
      attached: false,
      status: "seen" as MessageStatus,
      contentType: "html",
    });
  }

  return dbMessages;
}

export const DefaultMessageThreadExample: () => JSX.Element = () => {
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  function loadCustomMessages(
    numberOfMessagesToLoad: number
  ): Promise<boolean> {
    if (messageCursor <= 0) {
      console.log("no more messages to retrieve, stop it!");
      return Promise.resolve(true);
    }
    setMessages((prev) => {
      let newMessages: ChatMessage[] = [];
      for (var i = numberOfMessagesToLoad; i > 0; i--, messageCursor--) {
        newMessages.push(database[database.length - prev.length - i]);
      }
      return [...newMessages, ...prev];
    });

    console.log("more message to retrieve...");
    return Promise.resolve(false);
  }

  return (
    <FluentThemeProvider>
        <MessageThread
          userId={'1'}
          messages={messages}
          onLoadPreviousChatMessages={loadCustomMessages}
        />
    </FluentThemeProvider>
  );
};