require("../Globals");

/**
 * Command to send a tag to the channel
 * @extends {command}
 */
class Tag extends Command
{
	constructor()
	{
		// Helptext values
		let desc  = "Send a tag to the channel";
		let usage = `${settings.prefix}tag <tag key>`;
		let help  = `All tags can be listed with ${settings.prefix}alltags`;

		// Activation command regex
		let command = /^tag ([a-zA-Z]+)$/;

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


			// Get tag value by key
			let tag = "";
			let foundTag = false;
			tags.forEach( (value, index) =>
			{
				if (value[0] == tagKey)
				{
					foundTag = true;
					tag = tags[index][1];

					// Send tag to channel
					message.edit(tag);
					return;
				}
			});

			if (!foundTag)
			{
				// Notify user of nonexistant tag
				message.edit(`\`\`\`css\nTag "${tagKey}" does not exist.\n\`\`\``).then(message =>
				{
					setTimeout(() => { message.delete(); }, 3 * 1000);
				});
				return;
			}
		}

		// Pass params to parent constructor
		super(command, action, desc, usage, help);
	}
}

module.exports = Tag;
