require("../Globals");

/**
 * Command to evaluate code and post the results
 * Adapted from Evie's selfbot eval command:
 * https://github.com/eslachance/djs-selfbot-v9/blob/master/self.js#L201
 * @extends {command}
 */
class Eval extends Command
{
	constructor()
	{
		// Helptext values
		let desc  = "Evaluates the given code and prints the result";
		let usage = `${settings.prefix}eval <code>`;
		let help  = `The command does not require any code to be inline with the command itself. eg:

	${settings.prefix}eval
	let x = 5;
	x;

will still output the value of x.`;

		// Activation command regex
		let command = /^eval(?: *\n*((?:.|[\r\n])+))?$/;

		/**
		 * Action to take when the command is received
		 * @param  {object} message message object passed by parent caller
		 * @param  {method} resolve resolve method of parent Promise
		 * @param  {method} reject reject method of parent Promise
		 * @returns {null}
		 */
		let action = (message, resolve, reject) =>
		{
			let code = message.content.match(this.command)[1];
			if (!code)
			{
				this.UpdateMessage(message,
					"**ERROR:** ```xl\nNo code provided to evaluate.\n```");
				return;
			}

			try
			{
				let evaled = eval(code);
				if (typeof evaled !== "string")
					evaled = inspect(evaled, {depth: 0});

				this.UpdateMessage(message,
					"**INPUT:**\n```js\n" + code + "\n```\n**OUTPUT:**\n```xl\n" + Clean(evaled) + "\n```");
			}
			catch (error)
			{
				this.UpdateMessage(message, "**ERROR:** ```xl\n" + Clean(error) + "\n```");
			}
		}

		// Clean up text with zero-width-spaces
		let Clean = (text) =>
		{
			if (typeof(text) === "string")
			{
		    	return text
					.replace(/`/g, "`" + String.fromCharCode(8203))
					.replace(/@/g, "@" + String.fromCharCode(8203));
			}
		  	else return text;
		}

		// Pass params to parent constructor
		super(command, action, desc, usage, help);
	}
}

module.exports = Eval;
