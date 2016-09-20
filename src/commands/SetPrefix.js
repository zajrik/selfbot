require("../Globals");

/**
 * Command to set the prefix for the bot
 * @extends {command}
 */
class SetPrefix extends Command
{
	constructor()
	{
		// Helptext values
		let desc  = `Set command prefix`;
		let alias = `prefix`
		let usage = `${settings.prefix}setprefix <char>`;
		let help  = `It's recommended to reload the bot after changing the command prefix to update helptext with the new prefix.`;

		// Activation command regex
		let command = /^(?:setprefix|prefix)(?: (.{1}))?$/;

		/**
		 * Action to take when the command is received
		 * @param  {object} message message object passed by parent caller
		 * @param  {method} resolve resolve method of parent Promise
		 * @param  {method} reject reject method of parent Promise
		 * @returns {null}
		 */
		let action = (message, resolve, reject) =>
		{
			let char = message.content.match(this.command)[1];

			message.delete().then(_ =>
			{
				// Set prefix for current session and write
				// updated settings to file
				settings.prefix = char;
				var fs = require('fs');
				fs.writeFile("./settings.json", JSON.stringify(settings, null, "\t"), (err) =>
				{
					if (err) console.log(err);
				});

				// Notify user of changed prefix
				message.channel.sendCode("css", `Command prefix set to "${char}"`).then(msg =>
				{
					msg.delete(3 * 1000);
				})
			});

		}

		// Pass params to parent constructor
		super(command, action, desc, usage, help, alias);
	}
}

module.exports = SetPrefix;
