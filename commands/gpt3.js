const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'gpt3',
  description: 'Ask a question to the GPT-3.5',
  author: 'Jay Mar',
  role: 1,

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ').trim();
    
    if (!prompt) {
      sendMessage(senderId, { text: '🌟 Hello there! I\'m GPT-3.5 Turbo, how can I assist you today?' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://joshweb.click/new/gpt-3_5-turbo?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      const { result } = response.data;

      if (result) {
        await sendResponseInChunks(senderId, result, pageAccessToken, sendMessage);
      } else {
        sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling GPT-3.5 Turbo API:', error);
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};

async function sendResponseInChunks(senderId, text, pageAccessToken, sendMessage) {
  const maxMessageLength = 2000;

  if (text.length > maxMessageLength) {
    const messages = splitMessageIntoChunks(text, maxMessageLength);
    for (const message of messages) {
      await sendMessage(senderId, { text: message }, pageAccessToken);
    }
  } else {
    await sendMessage(senderId, { text }, pageAccessToken);
  }
}

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  let chunk = '';
  const words = message.split(' ');

  for (const word of words) {
    if ((chunk + word).length > chunkSize) {
      chunks.push(chunk.trim());
      chunk = '';
    }
    chunk += `${word} `;
  }

  if (chunk) {
    chunks.push(chunk.trim());
  }

  return chunks;
  }
  
