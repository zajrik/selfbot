require("../Globals");

/**
 * Command to post custom emotes
 * Call with /version
 * @extends {command}
 */
class Emotes extends Command
{
	constructor()
	{
		// Activation command regex
		let command = /^(lenny|shrug|denko|lod|doubleflip|bear)$/;

		/**
		 * Action to take when the command is received
		 * @param  {object} message message object passed by parent caller
		 * @param  {method} resolve resolve method of parent Promise
		 * @param  {method} reject reject method of parent Promise
		 * @returns {null}
		 */
		let action = (message, resolve, reject) =>
		{
			let match = message.content.match(this.command)[1];
			let emotes = new Map([
				["lenny", "( ͡° ͜ʖ ͡°)"],
				["shrug", "¯\\_(ツ)_/¯"],
				["denko", "(´・ω・`)"],
				["lod", "ಠ_ಠ"],
				["doubleflip", "┻━┻ ︵ヽ(`Д´)ﾉ︵﻿ ┻━┻"],
				["bear", "ʕ•͡ᴥ•ʔ"]
			]);

			// Replace command message with emote
			this.UpdateMessage(message, emotes.get(match));
		}

		// Pass params to parent constructor
		super(command, action);
	}
}

module.exports = Emotes;
