/**
 * Class containing regex for detecting a chat command and
 * an action that will be executed the the chat command is
 * called. Commands are to be registered using a Bot's
 * CommandRegistry
 */
class Command
{
	/**
	 * @param {regex} command activation chat command regex to match
	 *                        Capture groups can be used in the command for
	 *                        parsing the command message
	 * @param {method} action action that will be executed
	 *                        Action must receive the message object as well as
	 *                        the Promise resolve and reject methods when created
	 */
	constructor(command, action)
	{
		this.command = command;
		this.action = action;
	}

	/**
	 * Assign the bot instance to the command and hook the onMessage event
	 * to create a Promise when a message containing a command is received
	 * @param {Bot} bot Discord.js client instance
	 * @returns {null}
	 */
	Register(bot)
	{
		this.bot = bot;
		this.bot.on("message", (message) =>
		{
			if (message.content.match(this.command))
			{
				// Don't execute command if not selfbot user
				if (message.author !== this.bot.user) return;
				this.async = new Promise( (resolve, reject) =>
				{
					this.action(message, resolve, reject);
				});

				this.async.then( (result) =>
				{
					this.bot.Say(result);
				}, (err) =>
				{
					this.bot.Say(err.stack ? err.stack.red : err.red);
				});
			}
		});
	}

	// Edit the selfbot users post with the command output
	UpdateMessage(message, output)
	{
		setTimeout(() => { message.edit(output); }, 50);
	}
}

 module.exports = Command;
