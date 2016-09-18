require("../Globals");

/**
 * Command to see the time since the bot was launched
 * @extends {command}
 */
class Uptime extends Command
{
	constructor()
	{
		// Helptext values
		let desc  = `Prints time since the bot was started`;
		let usage = `${settings.prefix}uptime`;
		let help  = ``;

		// Activation command regex
		let command = /^uptime$/;

		/**
		 * Action to take when the command is received
		 * @param  {object} message message object passed by parent caller
		 * @param  {method} resolve resolve method of parent Promise
		 * @param  {method} reject reject method of parent Promise
		 * @returns {null}
		 */
		let action = (message, resolve, reject) =>
		{
			this.bot.Say(message.author.username.cyan + " requested uptime.");

			// Use Time.Difference to convert uptime ms into something useable
			let uptime = Time.Difference(this.bot.uptime * 2, this.bot.uptime);

			// Send uptime to channel
			this.UpdateMessage(message,
				`\`\`\`css\nUptime: ${uptime.toString()}.\n\`\`\``);
		}

		// Pass params to parent constructor
		super(command, action, desc, usage, help);
	}
}

module.exports = Uptime;
