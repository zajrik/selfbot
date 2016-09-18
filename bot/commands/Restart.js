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
		let desc  = `Restarts the selfbot`;
		let alias = `Reboot`;
		let usage = `${settings.prefix}restart`;
		let help  = ``;

		// Activation command regex
		let command = /^(?:restart|reboot)$/;

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

				// Give message.delete() a bit of time to actually
				// execute before exiting. Tired of leftover commands
				setTimeout(() => { process.exit() }, 100);
			});
		}

		// Pass params to parent constructor
		super(command, action, desc, usage, help, alias);
	}
}

module.exports = Restart;
