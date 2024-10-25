const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'gpt3',
  description: 'Ask a question to the GPT-3.5 Turbo',
  role: 1,
  author: 'Jay Mar',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ').trim();

    if (!prompt) {
      return sendMessage(senderId, {
        text: '🌟 Hello! I\'m GPT-3.5 Turbo. What would you like to ask me today?'
      }, pageAccessToken);
    }

    const apiUrl = `https://openai-rest-api.vercel.app/hercai?ask=${encodeURIComponent(prompt)}&model=turbo`;

    try {
      const response = await axios.get(apiUrl);
      const reply = response.data.reply;

      if (reply) {
        const formattedResponse = `🌟 𝗚𝗣𝗧-𝟯.𝟱 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲:\n\n${reply}`;
        await sendMessage(senderId, { text: formattedResponse }, pageAccessToken);
      } else {
        await sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling GPT-3.5 Turbo API:', error);
      await sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
