require(Globals);

/**
 * Command to add a tag to the tag DB entry
 * @extends {command}
 */
class AddTag extends Command
{
	constructor()
	{
		super();

		// Helptext values
		this.name         = `addtag`;
		this.description  = `Add a tag to the tags database`;
		this.alias        = ``;
		this.usage        = `${settings.prefix}addtag <tag key> <tag value>`;
		this.help         = `A tag can then be recalled via ${settings.prefix}tag <tag key>\nAll tags can be listed with ${settings.prefix}alltags`;
		this.permsissions = [];

		// Activation command regex
		this.command = /^addtag ([a-zA-Z]+)(?: *\n*((?:.|[\r\n])+))$/;

		/**
		 * Action to take when the command is received
		 * @param  {object} message message object passed by parent caller
		 * @param  {method} resolve resolve method of parent Promise
		 * @param  {method} reject reject method of parent Promise
		 * @returns {null}
		 */
		this.action = (message, resolve, reject) =>
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

			// Add the tag to the db, notify user and delete the message
			message.delete().then(message =>
			{
				// Check if tag already exists
				var foundTag = false;
				tags.forEach(value =>
				{
					if (value[0] == tagKey)
					{
						// Notify user that tag exists already
						foundTag = true;
						message.channel.sendCode("css", `Tag "${tagKey}" already exists.`).then(message =>
						{
							message.delete(3 * 1000);
						});
						return;
					}
				})

				if (!foundTag)
				{
					// Notify user of added tag
					this.bot.db.push("/tags[]", [tagKey, tagVal], true);
					message.channel.sendCode("css", `Tag "${tagKey}" added.`).then(message =>
					{
						message.delete(3 * 1000);
					});
				}
			});
		}
	}
}

module.exports = AddTag;
