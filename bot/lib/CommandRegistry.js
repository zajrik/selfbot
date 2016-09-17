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
		this.info = {};
		this.bot = bot;

		this.bot.on("message", (message) =>
		{
			// Not a command, break
			if (message.content[0] != settings.prefix) return;

			// Ensure only selfbot user can trigger commands
			if (message.author !== this.bot.user) return;

			// Get everything after prefex from command
			let command = message.content.slice(settings.prefix.length);
			message.content = command;

			// Check for command matches and execute the
			// appropriate command action
			this.forEach( (item) =>
			{
				if (item instanceof Command)
				{
					if (command.match(item.command))
					{
						item.DoAction(message).then( (result) =>
						{
							this.bot.Say(result);
						}, (err) =>
						{
							this.bot.Say(err.stack ? err.stack.red : err.red);
						});
					}
				}
			});
		})
	}

	/**
	 * Pass the Bot instance to the given command, add
	 * command to parent Array, and push command helptext
	 * fields to the info array for helpdocs
	 * @param {Command} command Command to be registered
	 * @returns {null}
	 */
	Register(command)
	{
		command.Register(this.bot);
		this.push(command);
		this.info[command.constructor.name] =
		{
			desc: command.desc,
			usage: command.usage,
			help: command.help
		}
	}
}

module.exports = CommandRegistry;
