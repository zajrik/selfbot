// Pollute the global scope with modules and fields that can be
// used by whatever file loads this file. It's handy, I swear.

// Import all classes //////////////////////////////////////////////////////////

	// load settings.json, package.json
	settings = require("../settings.json");
	pkg      = require("../package.json");

	// Discord Client and bot wrapper
	Client = require("../node_modules/discord.js").Client;
	Bot    = require("./lib/Bot");

	// My lib classes
	ScheduledTask         = require("./lib/ScheduledTask");
	Scheduler             = require("./lib/Scheduler");
	Command               = require("./lib/Command");
	CommandRegistry       = require("./lib/CommandRegistry");

	// Commands
	Command_Help    = require("./commands/Help");
	Command_Eval    = require("./commands/Eval");
	Command_Dice    = require("./commands/Dice");
	Command_Emotes  = require("./commands/Emotes");
	Command_Uptime  = require("./commands/Uptime");
	Command_Version = require("./commands/Version");

	// Tasks

	// Static classes
	Time        = require("./lib/Time");

	// Node Modules
	colors    = require("../node_modules/colors");
	inspect   = require("../node_modules/util").inspect;


// End class imports ///////////////////////////////////////////////////////////

// Set up color options for console text coloring
colors.setTheme(
{
	say: 'magenta',
	warn: 'yellow',
	error: 'red'
});

// Add method to capitalize every word in a string to String prototype
String.prototype.toTitleCase = function()
{
	return this.replace(/([^\W_]+[^\s-]*) */g, (text) =>
	{
		return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
	});
}
