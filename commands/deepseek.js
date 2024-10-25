const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'deepseek',
  description: 'Talk to deepseek ai',
  author: 'Jay Mar',
  role: 1,

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ').trim();
    
    if (!prompt) {
      sendMessage(senderId, { text: '🌟 Please provide a prompt for DeepSeek.' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://www.geo-sevent-tooldph.site/api/deepseek?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      const text = response.data.response || 'No response received from DeepSeek. Please try again later.';

      sendMessage(senderId, { text }, pageAccessToken);

    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
