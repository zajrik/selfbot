require("../Globals");

/**
 * Command to add a todo message to the todo channel on my dev server
 * @extends {command}
 */
class Todo extends Command
{
	constructor()
	{
		// Helptext values
		let desc  = `Add a TODO`;
		let usage = `${settings.prefix}todo <text>`;
		let help  = `Adds a TODO message to the TODO channel on my dev server`;

		// Activation command regex
		let command = /^todo(?: *\n*((?:.|[\r\n])+))?$/;

		/**
		 * Action to take when the command is received
		 * @param  {object} message message object passed by parent caller
		 * @param  {method} resolve resolve method of parent Promise
		 * @param  {method} reject reject method of parent Promise
		 * @returns {null}
		 */
		let action = (message, resolve, reject) =>
		{
			let text = message.content.match(this.command)[1];

			message.delete().then(_ =>
			{
				// Add todo to todos channel on dev server
				this.bot.channels.get(settings.todochannel).sendCode("css",
				`TODO: ${text}`);
			});
		}

		// Pass params to parent constructor
		super(command, action, desc, usage, help);
	}
}

module.exports = Todo;
