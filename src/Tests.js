export const deserializeGroupChannel = (sb, groupChannel) => {
  /**
   * Serialization test
   */
  const x = groupChannel.serialize();
  console.log('Serialized:'); console.log(x);
  groupChannel = sb.GroupChannel.buildFromSerializedData(x);
}

export const listMessages = (sb, groupChannel) => {
  /**
   * List messages
   */
  const prevMessageListQuery = groupChannel.createPreviousMessageListQuery();
  prevMessageListQuery.limit = 100;
  prevMessageListQuery.reverse = false;
  prevMessageListQuery.includeMetaArray = true;


  /**
   * Include threading and reply
   */
  prevMessageListQuery.includeReplies = true;
  prevMessageListQuery.includeThreadInfo = true;
  prevMessageListQuery.includeParentMessageText = true;
  /**
   * Get
   */
  prevMessageListQuery.load((messages, error) => {
    if (error) {
      console.log('Error listing messages for group channel:');
      console.dir(error);
      return;
    }
    console.log('Messages:');
    for (const msg of messages) {
      if (msg.messageType == 'file') {
        console.log(msg.url);
      }
    }
  });
}

export const listChannels = (sb) => {
  const channelListQuery = sb.GroupChannel.createMyGroupChannelListQuery();
  channelListQuery.limit = 20;
  channelListQuery.order = 'chronological';
  channelListQuery.includeEmpty = false;

  channelListQuery.next((list, err) => {
    if (err) throw err;
    console.log('## list:', list.length);

    list.forEach(channel => {
      console.log('## channel: ', channel.url);
      console.log('## time: ', channel.createdAt / 1000);
    });
  });
}

export const getMessageById = (sb, groupChannel) => {
  const messageListParams = new sb.MessageListParams();
  messageListParams.prevResultSize = 10;
  messageListParams.nextResultSize = 0;
  messageListParams.isInclusive = false;

  const messageText = 'hello world!';
  groupChannel.sendUserMessage(messageText, (message, err) => {
    console.log('## err1: ', err);
    console.log('## message: ', message);

    if (err) throw err;
    groupChannel.getMessagesByMessageId(message.messageId, messageListParams,(messages, err) => {
      console.log('## err2: ', err);
      if (err) throw err;
      console.log('## messages: ', messages[0].messageId);
    });
  });
}