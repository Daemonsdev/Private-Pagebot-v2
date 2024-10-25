const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'deepseek',
  description: 'Talk to deepseek ai',
  role: 1,
  author: 'Jay Mar',
  
  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ').trim();

    if (!prompt) {
      return sendMessage(senderId, { text: '🌟 Please provide a prompt for DeepSeek.' }, pageAccessToken);
    }

    const apiUrl = `https://www.geo-sevent-tooldph.site/api/deepseek?prompt=${encodeURIComponent(prompt)}`;

    try {
      const response = await axios.get(apiUrl);
      const text = response.data.response || 'No response received from DeepSeek. Please try again later.';

      const formattedResponse = 
`🤖 𝗗𝗘𝗘𝗣𝗦𝗘𝗘𝗞 𝗔𝗜\n\n${text}`;

      await sendMessage(senderId, { text: formattedResponse }, pageAccessToken);

    } catch (error) {
      console.error('Error calling DeepSeek API:', error);

      await sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
      
