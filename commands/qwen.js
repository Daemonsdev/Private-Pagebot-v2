const axios = require('axios');

module.exports = {
  name: 'qwen',
  description: 'Talk to qwen ai',
  role: 1,
  author: 'Jay Mar',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ').trim();
    if (!prompt) {
      sendMessage(senderId, { text: '🌟 Please provide a question.' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://www.geo-sevent-tooldph.site/api/Qwen1.572BChat?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      const text = response.data.response || 'No response received from Qwen-1.572BChat. Please try again later.';
      const maxMessageLength = 2000;

      if (text.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(text, maxMessageLength);
        for (const message of messages) {
          sendMessage(senderId, { text: message }, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Qwen API:', error);
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
    }
