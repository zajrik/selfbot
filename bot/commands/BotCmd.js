require("../Globals");

/**
 * Has server warframe bot execute a command and posts its
 * output to the channel. Lets me get warframe bot output anywhere
 * @extends {command}
 */
class BotCmd extends Command
{
	constructor()
	{
		// Helptext values
		let desc  = `Execute a serverbot command`;
		let alias = `bot`;
		let usage = `${settings.prefix}botcmd <command> [...args]`;
		let help  = `Will send a command to my serverbot and post the output to the channel the ${settings.prefix}bot command is called from.`;

		// Activation command regex
		let command = /^(?:bot|botcmd)(?: ([a-z0-9]+))?(?: (.+))?$/;

		/**
		 * Action to take when the command is received
		 * @param  {object} message message object passed by parent caller
		 * @param  {method} resolve resolve method of parent Promise
		 * @param  {method} reject reject method of parent Promise
		 * @returns {null}
		 */
		let action = (message, resolve, reject) =>
		{
			let botCmd = message.content.match(this.command)[1];
			let botCmdArgs = message.content.match(this.command)[2];

			if (!botCmd)
			{
				message.delete().then(message =>
				{
					message.channel.sendCode("css", `Invalid bot command.`).then(message =>
					{
						setTimeout(() => { message.delete(); }, 3 * 1000);
					});
				});
				return;
			}

			// Send command to zajrikbot
			var botUser = this.bot.fetchUser("219977426036457483");
			botUser.then(user =>
			{
				user.sendMessage(`/${botCmd}${botCmdArgs ? " " + botCmdArgs : ""}`).then(msg =>
				{
					// Register collector to get bot response message, 10 second timeout
					let collector = msg.channel.createCollector(m => m.author.id == user.id,
					{
            			time: 10000
        			});

					collector.on("message", (msg) =>
					{
						message.channel.sendMessage(msg.content).then(() =>
						{
							collector.stop("success");
						});
						message.delete();
					});

					collector.on("end", (collection, reason) =>
					{
						if (reason == "time")
						{
							message.channel.sendCode("css", "Bot command timed out.").then(msg =>
							{
								setTimeout(() => { msg.delete() }, 3 * 1000);
							});
						}
						message.delete();
					})
					msg.delete();
				})
			})
		}

		// Pass params to parent constructor
		super(command, action, desc, usage, help, alias);
	}
}

module.exports = BotCmd;
