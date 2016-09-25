require(Globals);

/**
 * Has server warframe bot execute a command and posts its
 * output to the channel. Lets me get warframe bot output anywhere
 * @extends {command}
 */
class BotCmd extends Command
{
	constructor()
	{
		super();

		// Helptext values
		this.name         = `botcmd`;
		this.description  = `Execute a serverbot command`;
		this.alias        = `bot`;
		this.usage        = `${settings.prefix}botcmd <command> [...args]`;
		this.help         = `Will send a command to my serverbot and post the output to the channel the ${settings.prefix}bot command is called from.`;
		this.permsissions = [];

		// Activation command regex
		this.command = /^(?:botcmd|bot)(?: (\d{1,2}) )?(?: ?([a-z0-9]+))?(?: (.+))?$/;

		/**
		 * Action to take when the command is received
		 * @param  {object} message message object passed by parent caller
		 * @param  {method} resolve resolve method of parent Promise
		 * @param  {method} reject reject method of parent Promise
		 * @returns {null}
		 */
		this.action = (message, resolve, reject) =>
		{
			let pruneTimer = message.content.match(this.command)[1] || 10;
			let botCmd = message.content.match(this.command)[2];
			let botCmdArgs = message.content.match(this.command)[3];

			if (!botCmd)
			{
				message.delete().then(message =>
				{
					message.channel.sendCode("css", `Invalid bot command.`).then(message =>
					{
						message.delete(3 * 1000);
					});
				});
				return;
			}

			// Send command to zajrikbot
			var botUser = this.bot.fetchUser("219977426036457483");
			botUser.then(user =>
			{
				message.edit("_Waiting on bot response..._");
				user.sendMessage(`/${botCmd}${botCmdArgs ? " " + botCmdArgs : ""}`).then(msg =>
				{

					// Register collector to get bot response message, 10 second timeout
					let collector = msg.channel.createCollector(m => m.author.id == user.id,
					{
            			time: 10000
        			});

					collector.on("message", (msg) =>
					{
						collector.stop("success");
						message.delete();
						message.channel.sendMessage(msg.content).then(m =>
						{
							if (pruneTimer != 0)
								m.delete(pruneTimer * 1000);
						});
					});

					collector.on("end", (collection, reason) =>
					{
						if (reason == "time")
						{
							message.channel.sendCode("css", "Bot command timed out.").then(msg =>
							{
								msg.delete(3 * 1000);
							});
						}
						message.delete();
					})
					msg.delete();
				})
			})
		}
	}
}

module.exports = BotCmd;
