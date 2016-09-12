/**
 * An array wrapper for initializing commands without having to create
 * individual variables for each command. This provides a clearer syntax
 * for what is being done when initializing commands.
 * @extends {Array}
 */
class CommandRegistry extends Array
{
	/**
	 * @param {Bot} bot Discord.js client instance
	 */
	constructor(bot)
	{
		super();
		this.bot = bot;
	}

	/**
	 * Pass the Bot instance to the command for the command to hook events
	 * @param {Command} command Command to be registered
	 * @returns {null}
	 */
	Register(command)
	{
		command.Register(this.bot);
		this.push(command);
	}
}

module.exports = CommandRegistry;
