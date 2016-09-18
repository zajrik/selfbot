require("../Globals");

/**
 * Command to remove a tag from the tag DB entry
 * @extends {command}
 */
class DelTag extends Command
{
	constructor()
	{
		// Helptext values
		let desc  = `Remove a tag from the tags database`;
		let usage = `${settings.prefix}deltag <tag key>`;
		let help  = ``;

		// Activation command regex
		let command = /^deltag ([a-zA-Z]+)$/;

		/**
		 * Action to take when the command is received
		 * @param  {object} message message object passed by parent caller
		 * @param  {method} resolve resolve method of parent Promise
		 * @param  {method} reject reject method of parent Promise
		 * @returns {null}
		 */
		let action = (message, resolve, reject) =>
		{
			let tagKey = message.content.match(this.command)[1] || undefined;

			// Break on invalid args
			if (!tagKey) return;

			try
			{
				var tags = this.bot.db.getData("/tags");
			}
			catch (e)
			{
				this.bot.db.push("/tags", [], true);
				var tags = this.bot.db.getData("/tags");
			}

			// remove the tag from the db the tag to the db, notify user and delete the message
			message.delete().then(message =>
			{
				// Find the tag and remove it
				var foundTag = false;
				tags.forEach( (value, index) =>
				{
					if (value[0] == tagKey)
					{
						foundTag = true;
						tags.splice(index, 1);

						this.bot.db.delete("/tags");
						this.bot.db.push("/tags", tags);

						// Notify user of removed tag
						message.channel.sendCode("css", `Tag "${tagKey}" removed.`).then(message =>
						{
							setTimeout(() => { message.delete(); }, 3 * 1000);
						});
						return;
					}
				});

				if (!foundTag)
				{
					// Notify user of nonexistant tag
					message.channel.sendCode("css", `Tag "${tagKey}" does not exist.`).then(message =>
					{
						setTimeout(() => { message.delete(); }, 3 * 1000);
					});
				}

			});
		}

		// Pass params to parent constructor
		super(command, action, desc, usage, help);
	}
}

module.exports = DelTag;
