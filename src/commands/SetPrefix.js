require(Globals);

/**
 * Command to set the prefix for the bot
 * @extends {command}
 */
class SetPrefix extends Command
{
	constructor()
	{
		super();

		// Helptext values
		this.name         = `setprefix`;
		this.description  = `Set command prefix`;
		this.alias        = `prefix`;
		this.usage        = `${settings.prefix}setprefix <char>`;
		this.help         = `After setting the command prefix, commands will automatically be reloaded.`;
		this.permsissions = [];

		// Activation command regex
		this.command = /^(?:setprefix|prefix)(?: (.{1}))?$/;

		/**
		 * Action to take when the command is received
		 * @param  {object} message message object passed by parent caller
		 * @param  {method} resolve resolve method of parent Promise
		 * @param  {method} reject reject method of parent Promise
		 * @returns {null}
		 */
		this.action = (message, resolve, reject) =>
		{
			let char = message.content.match(this.command)[1];

			message.delete().then(_ =>
			{
				// Break if no prefix is provided
				if (!char)
				{
					message.channel.sendCode("css", `You must provide a prefix to set.`)
						.then(message =>
						{
							message.delete(3 * 1000);
						});
					return;
				}

				// Set prefix for current session, reload commands
				// to reflect the changes
				settings.prefix = char;

				this.bot.Say("Set new prefix, reloading commands.".yellow);
				this.bot.LoadCommands();

				// Write updated settings to file
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
	}
}

module.exports = SetPrefix;