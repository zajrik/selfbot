'use strict';
import { Bot, Command } from 'yamdbf';
import { User, Message } from 'discord.js';

export default class Dice extends Command
{
	public constructor(bot: Bot)
	{
		super(bot, {
			name: 'dice',
			aliases: ['d'],
			description: 'Roll a sided die a number of times',
			usage: '<prefix>dice <sides> [number]',
			extraHelp: 'Valid dice: d4, d6, d8, d10, d12, d20, d100',
			group: 'base'
		});
	}

	public action(message: Message, args: Array<string | number>, mentions: User[], original: string): any
	{
		message.delete();
		const dice: number[] = [4, 6, 8, 10, 12, 20, 100];
		const sides: number = <number> args[0];
		let quantity: number = Math.min(<number> args[1] || 1, 100);
		if (!dice.includes(sides)) return false;
		if (quantity > 100) quantity = 100;
		let output: string = '```xl\n' + `Rolling ${quantity} d${sides}:\n`;
		for (let i: number = 1; i <= quantity; i++)
		{
			const thisRoll: number = Math.floor(Math.random() * sides) + 1;
			let spacer: string;
			if (sides === 100 && thisRoll < 100) spacer = ' ';
			if (sides === 100 && thisRoll < 10) spacer = '  ';
			if ((sides === 20 || sides === 12 || sides === 10) &&
				thisRoll < 10) spacer = ' ';
			output += `[${spacer || ''}${thisRoll}] `;
			if (i % 5 === 0) output += '\n';
		}
		output += '\n```';
		message.channel.sendMessage(output);
	}
};
