require(Globals);

/**
 * Command to see the time since the bot was launched
 * @extends {command}
 */
class Uptime extends Command
{
	constructor()
	{
		super();

		// Helptext values
		this.name         = `uptime`;
		this.description  = `Prints time since the bot was started`;
		this.alias        = ``;
		this.usage        = `${settings.prefix}uptime`;
		this.help         = ``;
		this.permsissions = [];

		// Activation command regex
		this.command = /^uptime$/;

		/**
		 * Action to take when the command is received
		 * @param  {object} message message object passed by parent caller
		 * @param  {method} resolve resolve method of parent Promise
		 * @param  {method} reject reject method of parent Promise
		 * @returns {null}
		 */
		this.action = (message, resolve, reject) =>
		{
			// Use Time.Difference to convert uptime ms into something useable
			let uptime = Time.Difference(this.bot.uptime * 2, this.bot.uptime);

			// Send uptime to channel, renove after 3 secs
			message.edit(`\`\`\`css\nUptime: ${uptime.toString()}.\n\`\`\``).then(message =>
			{
				message.delete(3 * 1000);
			})
		}
	}
}

module.exports = Uptime;