const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'openai',
  description: 'Interact with OpenAI Assistant',
  role: 1,
  author: 'Jay Mar',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ').trim();
    
    if (!prompt) {
      return sendMessage(senderId, { text: '🤖 Hey there! I’m OpenAI, how can I assist you today?' }, pageAccessToken);
    }

    const apiUrl = `https://tools.betabotz.eu.org/tools/openai?q=${encodeURIComponent(prompt)}`;

    try {
      const response = await axios.get(apiUrl);
      const text = response.data.result || 'No response received from OpenAI. Please try again later.';
      const maxMessageLength = 2000;

      const formattedResponse = `🤖 𝗢𝗽𝗲𝗻𝗔𝗜 𝗔𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝘁\n\n${text}`;

      if (formattedResponse.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(formattedResponse, maxMessageLength);
        for (const message of messages) {
          await sendMessage(senderId, { text: message }, pageAccessToken);
        }
      } else {
        await sendMessage(senderId, { text: formattedResponse }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      await sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
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
