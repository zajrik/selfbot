require("../Globals");

/**
 * Command to have the bot print its current version to the chat
 * Call with /version
 * @extends {command}
 */
class Version extends Command
{
	constructor()
	{
		// Activation command regex
		let command = /^\!version$/;

		/**
		 * Action to take when the command is received
		 * @param  {object} message message object passed by parent caller
		 * @param  {method} resolve resolve method of parent Promise
		 * @param  {method} reject reject method of parent Promise
		 * @returns {null}
		 */
		let action = (message, resolve, reject) =>
		{
			this.bot.Say(message.author.username.cyan + " requested version.");

			// Send version to channel
			this.UpdateMessage(message,
				`\`\`\`css\nCurrent version is: ${pkg.version}\n\`\`\``);
		}

		// Pass params to parent constructor
		super(command, action);
	}
}

module.exports = Version;
