require("../Globals");

/**
 * Command to list all tags in the DB
 * @extends {command}
 */
class AllTags extends Command
{
	constructor()
	{
		super();

		// Helptext values
		this.name         = `alltags`;
		this.description  = `Print all available tags to the channel`;
		this.alias        = `tags`;
		this.usage        = `${settings.prefix}alltags`;
		this.help         = ``;
		this.permsissions = [];

		// Activation command regex
		this.command = /^(?:alltags|tags)$/;

		/**
		 * Action to take when the command is received
		 * @param  {object} message message object passed by parent caller
		 * @param  {method} resolve resolve method of parent Promise
		 * @param  {method} reject reject method of parent Promise
		 * @returns {null}
		 */
		this.action = (message, resolve, reject) =>
		{
			try
			{
				var tags = this.bot.db.getData("/tags");
			}
			catch (e)
			{
				this.bot.db.push("/tags", [], true);
				var tags = this.bot.db.getData("/tags");
			}

			// Get all tag keys and sort by key length
			var tagKeys = new Array();
			tags.forEach((value) =>
			{
				tagKeys.push(value[0])
			})
			tagKeys.sort( (a, b) =>
			{
				return a.length - b.length;
			});

			// Find widest tag name for list padding
			let maxWidth = 0;
			tagKeys.forEach( (value) =>
			{
				if (value.length > maxWidth) maxWidth = value.length;
			});

			// Add all tags to the list
			var alltags = "```xl\nAvailable tags:";
			tagKeys.forEach( (value, index) =>
			{
				alltags += index % 3 == 0 ? `\n${Pad(value, maxWidth + 1)}` :
					`${Pad(value, maxWidth + 1)}`;
			});
			alltags += "\n```";

			// Send all tags to the channel, delete after 20 seconds
			message.delete().then(message =>
			{
				message.channel.sendMessage(alltags).then(message =>
				{
					message.delete(20 * 1000);
				});
			});
		}
	}
}

module.exports = AllTags;
