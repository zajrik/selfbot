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
	constructor(command, action, desc, usage, help)
	{
		this.command = command;
		this.action = action;
		this.desc = desc;
		this.usage = usage;
		this.help = help;
	}

	/**
	 * Assign the bot instance to the command
	 * @param {Bot} bot Discord.js client instance
	 * @returns {null}
	 */
	Register(bot)
	{
		this.bot = bot;
	}

	/**
	 * Return a promise with the action to be executed
	 * @param {object} message message object passed by parent caller
	 * @returns {Promise}
	 */
	DoAction(message)
	{
		this.async = new Promise( (resolve, reject) =>
		{
			this.action(message, resolve, reject);
		});

		return this.async;
	}

	// Edit the selfbot users post with the command output
	UpdateMessage(message, output)
	{
		setTimeout(() => { message.edit(output); }, 50);
	}

	// Delete the selfbot users post
	DeleteMessage(message)
	{
		setTimeout(() => { message.delete(); }, 50);
	}
}

 module.exports = Command;
