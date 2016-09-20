require("../Globals");

/**
 * Command to remove the last specified number of own messages
 * https://github.com/YorkAARGH/selfbot/blob/master/cmdhandler.js#L361-L377
 * @extends {command}
 */
class Prune extends Command
{
	constructor()
	{
		super();

		// Helptext values
		this.name         = `prune`;
		this.description  = `Remove the last given quantity of own messages`;
		this.alias        = ``;
		this.usage        = `${settings.prefix}prune <quantity>`;
		this.help         = ``;
		this.permsissions = [];

		// Activation command regex
		this.command = /^prune (\d{1,2})$/;

		/**
		 * Action to take when the command is received
		 * @param  {object} message message object passed by parent caller
		 * @param  {method} resolve resolve method of parent Promise
		 * @param  {method} reject reject method of parent Promise
		 * @returns {null}
		 */
		this.action = (message, resolve, reject) =>
		{
			let quantity = parseInt(message.content.match(this.command)[1]);
			if (!quantity || quantity < 1)
			{
				message.delete().then(message =>
				{
					message.channel.sendCode("css",
						`You must enter a number of messages to prune.`)
							.then(message =>
							{
								message.delete(3 * 1000);
							});
				});
				return;
			}

			message.channel.fetchMessages(
			{
				limit: 100
			}).then(messages =>
			{
				let msgArray = messages.array();
				msgArray = msgArray.filter(m => m.author.id === this.bot.user.id);
				msgArray.length = quantity + 1;
				msgArray.forEach( (m, i) =>
				{
					m.delete().then(() =>
					{
						if (i == msgArray.length - 1)
							message.channel.sendCode("css",
								"Prune operation complete.")
									.then(message =>
										{
											message.delete(3 * 1000);
										});
					}).catch(console.error);

				});
			});
		}
	}
}

module.exports = Prune;
