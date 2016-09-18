require("../Globals");

/**
 * Ping command, responds with "pong" and execution time
 * @extends {command}
 */
class Ping extends Command
{
	constructor()
	{
		// Helptext values
		let desc  = `Ping!`;
		let usage = `${settings.prefix}ping`;
		let help  = `Bot will respond with "pong" and command execution time.`;

		// Activation command regex
		let command = /^[pP]ing$/;

		/**
		 * Action to take when the command is received
		 * @param  {object} message message object passed by parent caller
		 * @param  {method} resolve resolve method of parent Promise
		 * @param  {method} reject reject method of parent Promise
		 * @returns {null}
		 */
		let action = (message, resolve, reject) =>
		{
			// Add pong
			message.edit("`Pong!`").then(message =>
			{
				// Add time it took to get that pong out
				message.edit(`\`Pong! (${(Time.now() - this.bot.pinged)}ms)\``)
					.then(message =>
					{
						setTimeout(() => { message.delete() }, 2 * 1000);
					});
			});
		}

		// Pass params to parent constructor
		super(command, action, desc, usage, help);
	}
}

module.exports = Ping;
