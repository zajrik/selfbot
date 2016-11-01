'use strict';
import { Bot, Command } from 'yamdbf';
import { User, Message } from 'discord.js';

export default class CoinFlip extends Command
{
	public constructor(bot: Bot)
	{
		super(bot, {
			name: 'coin',
			aliases: [],
			description: 'Flip some coins!',
			usage: '<prefix>coin [quantity]',
			extraHelp: '',
			group: 'base'
		});
	}

	public action(message: Message, args: Array<string | number>, mentions: User[], original: string): any
	{
		const quantity: number = <number> args[0];
		if (quantity)
		{
			message.edit(`Flipping coins...`);
			let heads: number = 0;
			let tails: number = 0;
			for (let i = 0; i < quantity; i++)
			{
				const result: number = Math.floor(Math.random() * 2);
				if (result === 0) heads++;
				else tails++;
			}
			return message.edit(`Flipped coins: ${heads} heads | ${tails} tails`);
		}
		else
		{
			const result: number = Math.floor(Math.random() * 2);
			return message.edit(`Flipped a coin: ${result === 0 ? 'heads' : 'tails'}`);
		}
	}
};
