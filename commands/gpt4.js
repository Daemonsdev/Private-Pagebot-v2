const axios = require('axios');

module.exports = {
  name: 'gpt4',
  description: 'Ask a question to GPT-4 Model',
  role: 1,
  author: 'Jay Mar',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ').trim();
    if (!prompt) {
      sendMessage(senderId, { text: '🌟 Please provide a prompt.' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://joshweb.click/gpt4?prompt=${encodeURIComponent(prompt)}&uid=${senderId}`;
      const response = await axios.get(apiUrl);
      const text = response.data.gpt4 || 'No response received from GPT-4. Please try again later.';

      // Send the response, split into chunks if necessary
      await sendResponseInChunks(senderId, text, pageAccessToken, sendMessage);
    } catch (error) {
      console.error('Error calling GPT-4 API:', error);
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
