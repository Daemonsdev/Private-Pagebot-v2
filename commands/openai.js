const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'openai',
  description: 'Interact with OpenAI Assistant',
  role: 1,
  author: 'Jay Mar',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ').trim();
    if (!prompt) {
      sendMessage(senderId, { text: '🤖 Hey there! I’m OpenAI, how can I assist you today?' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://tools.betabotz.eu.org/tools/openai?q=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      const text = response.data.result || 'No response received from OpenAI. Please try again later.';
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
      console.error('Error calling OpenAI API:', error);
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
