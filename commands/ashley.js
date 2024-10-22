const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ashley',
  description: 'Get a response from Ashley API',
  role: 1,
  author: 'churchill',
  async execute(senderId, args, pageAccessToken) {
    const chilli = args.join(' ');

    if (!chilli) {
      return sendMessage(senderId, { text: 'Please provide a prompt, for example: ashley How are you?' }, pageAccessToken);
    }

    const apiUrl = `https://markdevs-last-api-t48o.onrender.com/api/ashley?query=${encodeURIComponent(chilli)}`;

    try {
      const response = await axios.get(apiUrl);
      const ashleyResponse = response.data.result || 'No response from Ashley.';

      const formattedResponse = 
`𝗔𝗦𝗛𝗟𝗘𝗬 𝗔𝗜 🥵\n\n${ashleyResponse}`;

      await sendMessage(senderId, { text: formattedResponse }, pageAccessToken);

    } catch (maasim) {
      console.error('Error:', maasim);

      await sendMessage(senderId, { text: '❌ An error occurred. Please try again later.' }, pageAccessToken);
    }
  }
};
