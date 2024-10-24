const fs = require('fs');
const path = require('path');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'help',
  description: 'Show available commands',
  role: 1,
  author: 'heru',
  execute(senderId, args, pageAccessToken) {
    const commandsDir = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

    const commands = commandFiles.map((file, index) => {
      const command = require(path.join(commandsDir, file));
      return {
        title: command.name,
        description: command.description,
        payload: `${command.name.toUpperCase()}_PAYLOAD`
      };
    });

    const totalCommands = commandFiles.length;
    const commandsPerPage = 5;
    const totalPages = Math.ceil(totalCommands / commandsPerPage);
    let page = parseInt(args[0], 10);

    if (isNaN(page) || page < 1) {
      page = 1;
    }

    if (args[0] && args[0].toLowerCase() === 'all') {
      const helpTextMessage = `🌟 Command List:\n📕 All Commands: ${totalCommands}\n\n${commands.map((cmd, index) => `${index + 1}. ${cmd.title} - ${cmd.description}`).join('\n')}`;

      return sendMessage(senderId, {
        text: helpTextMessage
      }, pageAccessToken);
    }

    const startIndex = (page - 1) * commandsPerPage;
    const endIndex = startIndex + commandsPerPage;
    const commandsForPage = commands.slice(startIndex, endIndex);

    if (commandsForPage.length === 0) {
      return sendMessage(senderId, { text: `Invalid page number. There are only ${totalPages} pages.` }, pageAccessToken);
    }

    const helpTextMessage = `🌟 Command List (Page ${page} of ${totalPages}):\n📕 All Commands: ${totalCommands}\n\n${commandsForPage.map((cmd, index) => `${startIndex + index + 1}. ${cmd.title} - ${cmd.description}`).join('\n\n')}\n\nType "help [page]" to see another page, or "help all" to show all commands.`;

    const quickRepliesPage = commandsForPage.map((cmd) => ({
      content_type: "text",
      title: cmd.title,
      payload: cmd.payload
    }));

    sendMessage(senderId, {
      text: helpTextMessage,
      quick_replies: quickRepliesPage
    }, pageAccessToken);
  }
};
