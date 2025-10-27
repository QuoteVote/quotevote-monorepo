// eslint-disable-next-line import/prefer-default-export
export const MessageInput = `
    input MessageInput {    
        " Message Room ID"
        messageRoomId: String
        " Either user._id or post._id "
        componentId: String
        " Title of the chat message "
        title: String! 
        " Content of the chat message "
        text: String!
        " Type of the message USER or POST "
        type: String
    }
`;
