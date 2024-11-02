const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'jasmine',
  description: 'Talk to Jasmine AI',
  role: 1,
  author: 'Jay Mar',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ').trim();
    
    if (!prompt) {
      return sendMessage(senderId, { text: '🌸 Please provide a question for Jasmine AI.' }, pageAccessToken);
    }

    const apiUrl = `https://heru-apiv2.onrender.com/api/jasminev2?prompt=${encodeURIComponent(prompt)}`;

    try {
      const response = await axios.get(apiUrl);
      const text = response.data.response || 'No response received from Jasmine AI. Please try again later.';
      const maxMessageLength = 2000;

      const formattedResponse = `🌺 𝗝𝗔𝗦𝗠𝗜𝗡𝗘 𝗔𝗜\n\n${text}`;

      if (formattedResponse.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(formattedResponse, maxMessageLength);
        for (const message of messages) {
          await sendMessage(senderId, { text: message }, pageAccessToken);
        }
      } else {
        await sendMessage(senderId, { text: formattedResponse }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Jasmine API:', error);
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
