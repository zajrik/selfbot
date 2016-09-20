require("../Globals");

/**
 * Command to add a todo message to the todo channel on my dev server
 * @extends {command}
 */
class Todo extends Command
{
	constructor()
	{
		super();

		// Helptext values
		this.name         = `todo`;
		this.description  = `Add a TODO`;
		this.alias        = ``;
		this.usage        = `${settings.prefix}todo <text>`;
		this.help         = `Adds a TODO message to the TODO channel on my dev server`;
		this.permsissions = [];

		// Activation command regex
		this.command = /^todo(?: *\n*((?:.|[\r\n])+))?$/;

		/**
		 * Action to take when the command is received
		 * @param  {object} message message object passed by parent caller
		 * @param  {method} resolve resolve method of parent Promise
		 * @param  {method} reject reject method of parent Promise
		 * @returns {null}
		 */
		this.action = (message, resolve, reject) =>
		{
			let text = message.content.match(this.command)[1];

			message.delete().then(_ =>
			{
				// Add todo to todos channel on dev server
				this.bot.channels.get(settings.todochannel).sendCode("css",
				`TODO: ${text}`);
			});
		}
	}
}

module.exports = Todo;
