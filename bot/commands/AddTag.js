require("../Globals");

/**
 * Command to add a tag to the tag DB entry
 * @extends {command}
 */
class AddTag extends Command
{
	constructor()
	{
		// Helptext values
		let desc  = "Add a tag to the tags database";
		let usage = `${settings.prefix}addtag <tag key> <tag value>`;
		let help  = `Tags can then be recalled via ${settings.prefix}tag <tag key>\nAll tags can be listed with ${settings.prefix}alltags`;

		// Activation command regex
		let command = /^addtag ([a-zA-Z]+) (.+)$/;

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

			// Check if tag already exists
			tags.forEach(value =>
			{
				if (value[0] == tagKey)
				{
					// Notify of duplicate tag and break
					message.delete().then(message =>
					{
						message.channel.sendCode("css", `Tag "${tagKey}" already exists.`).then(message =>
						{
							setTimeout(() => { message.delete(); }, 3 * 1000);
						});
					});
					return;
				}
			})

			// Add the tag to the db, notify user and delete the message
			message.delete().then(message =>
			{
				this.bot.db.push("/tags[]", [tagKey, tagVal], true);
				message.channel.sendCode("css", `Tag "${tagKey}" added.`).then(message =>
				{
					setTimeout(() => { message.delete(); }, 3 * 1000);
				});
			});
		}

		// Pass params to parent constructor
		super(command, action, desc, usage, help);
	}
}

module.exports = AddTag;
