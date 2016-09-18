require("../Globals");

/**
 * Command to replace a tag in the DB with a new value
 * @extends {command}
 */
class ReTag extends Command
{
	constructor()
	{
		// Helptext values
		let desc  = `Replace a tag value in the database`;
		let usage = `${settings.prefix}retag <tag key> <tag value>`;
		let help  = `A tag can then be recalled via ${settings.prefix}tag <tag key>\nAll tags can be listed with ${settings.prefix}alltags`;

		// Activation command regex
		let command = /^retag ([a-zA-Z]+) (.+)$/;

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
			let tagVal = message.content.match(this.command)[2] || undefined;

			// Break on invalid args
			if (!tagKey || !tagVal) return;

			try
			{
				var tags = this.bot.db.getData("/tags");
			}
			catch (e)
			{
				this.bot.db.push("/tags", [], true);
				var tags = this.bot.db.getData("/tags");
			}

			message.delete().then(message =>
			{
				// Find tag in DB
				let foundTag = false;
				tags.forEach( (value, index) =>
				{
					if (value[0] == tagKey)
					{
						foundTag = true;
						tags.splice(index, 1);

						// Re-add tag with new value
						tags.push([tagKey, tagVal]);

						this.bot.db.delete("/tags");
						this.bot.db.push("/tags", tags);

						// Notify user of tag update
						message.channel.sendCode("css", `Tag "${tagKey}" has been updated.`).then(message =>
						{
							message.delete(3 * 1000);
						});
						return;
					}
				})

				if (!foundTag)
				{
					// Notify user of nonexistant tag
					message.channel.sendCode("css", `Tag "${tagKey}" does not exist.`).then(message =>
					{
						message.delete(3 * 1000);
					});
				}
			});
		}

		// Pass params to parent constructor
		super(command, action, desc, usage, help);
	}
}

module.exports = ReTag;
