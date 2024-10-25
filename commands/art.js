const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'art',
  description: 'Generate an image based on a prompt using the JoshWeb API.',
  role: 1,
  author: 'Jay Mar',
  
  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, {
        text: 'Please provide a prompt.\n\nUsage:\nExample: art cat fyling'
      }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');
    const apiUrl = `https://joshweb.click/api/art?prompt=${encodeURIComponent(prompt)}`;

    try {
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: apiUrl
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error('Error generating image:', error);
      await sendMessage(senderId, {
        text: 'An error occurred while generating the image. Please try again later.'
      }, pageAccessToken);
    }
  }
};
    
