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
		super();

		// Helptext values
		this.name         = `eval`;
		this.description  = `Evaluates the given code and prints the result`;
		this.alias        = ``;
		this.usage        = `${settings.prefix}eval <code>`;
		this.help         = `The command does not require any code to be inline with the command itself. eg:

	${settings.prefix}eval
	let x = 5;
	x;

will still output the value of x.`;
		this.permsissions = [];

		// Activation command regex
		this.command = /^eval(?: *\n*((?:.|[\r\n])+))?$/;

		/**
		 * Action to take when the command is received
		 * @param  {object} message message object passed by parent caller
		 * @param  {method} resolve resolve method of parent Promise
		 * @param  {method} reject reject method of parent Promise
		 * @returns {null}
		 */
		this.action = (message, resolve, reject) =>
		{
			let code = message.content.match(this.command)[1];
			if (!code)
			{
				message.edit(
					"**ERROR:** ```xl\nNo code provided to evaluate.\n```");
				return;
			}

			try
			{
				let evaled = eval(code);
				if (typeof evaled !== "string")
					evaled = inspect(evaled, {depth: 0});

				message.edit(
					"**INPUT:**\n```js\n" + code + "\n```\n**OUTPUT:**\n```xl\n" + Clean(evaled) + "\n```");
			}
			catch (error)
			{
				message.edit(
					"**INPUT:**\n```js\n" + code + "\n```\n**ERROR:** ```xl\n" + Clean(error) + "\n```");
			}
		}

		// Clean up text with zero-width-spaces, remove token if it pops up
		let Clean = (text) =>
		{
			if (typeof(text) === "string")
			{
		    	return text
					.replace(/`/g, "`" + String.fromCharCode(8203))
					.replace(/@/g, "@" + String.fromCharCode(8203))
					.replace(/[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g, "[REDACTED]");
			}
		  	else return text;
		}
	}
}

module.exports = Eval;
