require("../Globals");

/**
 * Command to restart the selfbot
 * @extends {command}
 */
class Restart extends Command
{
	constructor()
	{
		// Helptext values
		let desc  = "Restarts the selfbot";
		let usage = `${settings.prefix}restart`;
		let help  = ``;

		// Activation command regex
		let command = /^restart$/;

		/**
		 * Action to take when the command is received
		 * @param  {object} message message object passed by parent caller
		 * @param  {method} resolve resolve method of parent Promise
		 * @param  {method} reject reject method of parent Promise
		 * @returns {null}
		 */
		let action = (message, resolve, reject) =>
		{
			this.bot.Say("Restarting...".yellow);

			// Delete command message and exit
			message.delete().then(message =>
			{
				this.bot.db.push("/doRestart", true);
				this.bot.db.push("/restartID", message.channel.id);
				this.bot.db.push("/restartTime", Time.now());

				process.exit();
			});
		}

		// Pass params to parent constructor
		super(command, action, desc, usage, help);
	}
}

module.exports = Restart;
