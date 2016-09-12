require("../Globals");

/**
 * A command to roll a variable sided die a variable number of times
 * @extends {Command}
 */
class Dice extends Command
{
	constructor()
	{
		// Activation command regex
		let command = /^\!(\d{1,3})?d(4|6|8|10|12|20|100)(?: (\d{1,2}))?$/;

		/**
		 * Action to take when the command is received
		 * @param  {object} message message object passed by parent caller
		 * @param  {method} resolve resolve method of parent Promise
		 * @param  {method} reject reject method of parent Promise
		 * @returns {null}
		 */
		let action = (message, resolve, reject) =>
		{
			let sides = message.content.match(this.command)[2];
			let dice = message.content.match(this.command)[1] ||
			 	message.content.match(this.command)[3] || 1;

			// Cap number of dice to roll at 100
			if (dice > 100) dice = 100;

			/**
			 * Roll the given number of sided dice and send the results
			 * to the channel the command was called from
			 * @param  {int} sides number of sides on the die
			 * @param  {int} dice number of dice to roll
			 * @return {null}
			 */
			let roll = (sides, dice) =>
			{
				let output = "```xl\n" + `Rolling ${dice} d${sides}:\n`;

				for (let i = 1; i <= dice; i++)
				{
					let thisRoll = Math.floor(Math.random() * sides) + 1;

					// Set spacer
					let spacer = "";
					if (sides == 100 && thisRoll < 100) spacer = " ";
					if (sides == 100 && thisRoll < 10) spacer = "  ";
					if ((sides == 20 || sides == 12 || sides == 10) &&
						thisRoll < 10) spacer = " ";

					// Add die roll to the output and right-align with spacer
					output += `[${spacer}${thisRoll}] `;

					// Add a line break every 5 die rolls
					if (i % 5 == 0) output += "\n";
				}

				output += "\n```";

				this.UpdateMessage(message, output);
			}

			roll(sides, dice);
		}
		// Pass params to parent constructor
		super(command, action);
	}
}
module.exports = Dice;
