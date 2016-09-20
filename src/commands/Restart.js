require("../Globals");

/**
 * Command to restart the selfbot
 * @extends {command}
 */
class Restart extends Command
{
	constructor()
	{
		super();

		// Helptext values
		this.name         = `restart`;
		this.description  = `Restarts the selfbot`;
		this.alias        = `reboot`;
		this.usage        = `${settings.prefix}restart`;
		this.help         = ``;
		this.permsissions = [];

		// Activation command regex
		this.command = /^(?:restart|reboot)$/;

		/**
		 * Action to take when the command is received
		 * @param  {object} message message object passed by parent caller
		 * @param  {method} resolve resolve method of parent Promise
		 * @param  {method} reject reject method of parent Promise
		 * @returns {null}
		 */
		this.action = (message, resolve, reject) =>
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
	}
}

module.exports = Restart;
