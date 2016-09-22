require(Globals);

/**
 * Command to have the bot print its current version to the chat
 * @extends {command}
 */
class Version extends Command
{
	constructor()
	{
		super();

		// Helptext values
		this.name         = `version`;
		this.description  = `Prints the bot version`;
		this.alias        = ``;
		this.usage        = `${settings.prefix}version`;
		this.help         = ``;
		this.permsissions = [];

		// Activation command regex
		this.command = /^version$/;

		/**
		 * Action to take when the command is received
		 * @param  {object} message message object passed by parent caller
		 * @param  {method} resolve resolve method of parent Promise
		 * @param  {method} reject reject method of parent Promise
		 * @returns {null}
		 */
		this.action = (message, resolve, reject) =>
		{
			// Send version to channel and remove after 3 seconds
			message.edit(`\`\`\`css\nCurrent version is: ${pkg.version}\n\`\`\``).then(message =>
			{
				message.delete(3 * 1000);
			})
		}
	}
}

module.exports = Version;
