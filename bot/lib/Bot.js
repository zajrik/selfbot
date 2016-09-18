require("../Globals");

/**
 * Extend the Discord.js Client class to provide a wrapper for the old
 * personality.js functionality and future extensions
 * @extends {Client}
 */
class Bot extends Client
{
	/**
	 * @param {string} name The name of the bot. Will preface Say method output
	 * @param {string} token The login token for the bot
	 * @returns {null}
	 */
	constructor(name, token)
	{
		super();

		this.name = name;
		this.token = token;

		// Create bot command registry
		this.commands = new CommandRegistry(this);

		// Create an action scheduler for the bot
		this.scheduler = new Scheduler(this);

		// Initialize a database for the bot
		this.db = new JsonDB("data-store", true, true);

		// Register commands
		this.commands.Register(new Command_Help());
		this.commands.Register(new Command_Eval());
		this.commands.Register(new Command_Dice());
		this.commands.Register(new Command_AddTag());
		this.commands.Register(new Command_DelTag());
		this.commands.Register(new Command_ReTag());
		this.commands.Register(new Command_AllTags());
		this.commands.Register(new Command_Tag());
		this.commands.Register(new Command_Ping());
		this.commands.Register(new Command_Uptime());
		this.commands.Register(new Command_Version());
		this.commands.Register(new Command_Restart());

		// Schedule tasks

		// Event handlers //////////////////////////////////////////////////////

		// Ready event
		this.on("ready", () =>
		{
			// Edit last message with restart success if coming online from
			// a restart via restart command
			try
			{
				var doRestart = this.db.getData("/doRestart");
				var restartID = this.db.getData("/restartID");
				var restartTime = this.db.getData("/restartTime");
			}
			catch (e)
			{
				this.db.push("/doRestart", false);
				var doRestart = this.db.getData("/doRestart");
				this.db.push("/restartID", undefined);
				var restartID = this.db.getData("/restartID");
				this.db.push("/restartTime", 1);
				var restartTime = this.db.getData("/restartTime");
			}
			if (doRestart)
			{
				this.Say("Restart completed.");
				this.db.push("/doRestart", false);

				// Send restart complete message to channel
				var channel = this.channels.find("id", restartID);
				channel.sendCode("css", `Selfbot restart completed. (${(Time.now() - restartTime) / 1000} secs)`)
					.then(msg =>
					{
						// Remove the message after 3 seconds
						setTimeout(() =>{
							msg.delete();
						}, 3000);
					});
			}

			this.user.setStatus("online", "with my selfbot")
				.then(user => this.Say(
					`Status set to: ${user.status}, ${user.game.name}`))
				.catch(this.Say);

			this.Say(`Ready to go! ` +
				`Guilds: ${this.guilds.size.toString().cyan} | ` +
				`Channels: ${this.channels.size.toString().cyan} | ` +
				`Users: ${this.users.size.toString().cyan}`);

			// Set bot reconnectionMessageSuppress time 60 seconds behind
			// to ensure the first reconnection message occurs immediately
			this.reconnectionMessageSuppress = Time.now() - 60000;
		});

		// Reconnecting event
		this.on("reconnecting", () =>
		{
			// Send reconnecting message every 10 seconds during reconnection
			// process until bot successfully reconnects
			if (Time.Difference(Time.now(),
				this.reconnectionMessageSuppress).ms >= 10000)
			{
				this.reconnectionMessageSuppress = Time.now();
				this.Say("Reconnecting...".warn);
			}
		});

		// Disconnected event
		this.on("disconnected", (error, code) =>
		{
			this.Say("Disconnected: ".warn + error);
		});

		// Warn event
		this.on("warn", (w) =>
		{
		    this.Say(w.warn)
		});

		// Error event
		this.on("error", (e) =>
		{
		    this.Say(e.error);
		});
	}

	/**
	 * Log the bot into Discord
	 * @returns {null}
	 */
	Login()
	{
		this.login(this.token);
	}

	/**
	 * Write to the console, prefaced by @this.name
	 * @param {string} text The text to write to the console
	 * @returns {null}
	 */
	Say(text)
	{
		if (text)
			console.log(`${"@".say}${this.name.say}: ${text}`);
	}
}

module.exports = Bot;
