require("../Globals");

/**
 * Ping command, responds with "pong" and execution time
 * @extends {command}
 */
class Ping extends Command
{
	constructor()
	{
		super();

		// Helptext values
		this.name         = `ping`;
		this.description  = `Ping!`;
		this.alias        = ``;
		this.usage        = `${settings.prefix}ping`;
		this.help         = `Bot will respond with "pong" and command execution time.`;
		this.permsissions = [];

		// Activation command regex
		this.command = /^[pP]ing$/;

		/**
		 * Action to take when the command is received
		 * @param  {object} message message object passed by parent caller
		 * @param  {method} resolve resolve method of parent Promise
		 * @param  {method} reject reject method of parent Promise
		 * @returns {null}
		 */
		this.action = (message, resolve, reject) =>
		{
			// Add pong
			message.edit("`Pong!`").then(message =>
			{
				// Add time it took to get that pong out
				message.edit(`\`Pong! (${(Time.now() - this.bot.pinged)}ms)\``)
					.then(message =>
					{
						message.delete(2 * 1000);
					});
			});
		}
	}
}

module.exports = Ping;
