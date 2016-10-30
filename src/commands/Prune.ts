'use strict';
import { Command } from 'yamdbf';
import { User, Message, Collection } from 'discord.js';

export default class Prune extends Command
{
	public constructor(bot)
	{
		super(bot, {
			name: 'prune',
			aliases: [],
			description: 'Remove the last given quantity of own messages',
			usage: '<prefix>prune',
			extraHelp: '',
			group: 'base'
		});
	}

	public async action(message: Message, args: Array<string | number>, mentions: User[], original: string): Promise<any>
	{
		message.delete();
		const quantity: number = <number> args[0];
		if (!quantity || quantity < 1)
			return message.channel.sendMessage('You must enter a number of messages to prune')
				.then(res => (<Message> res).delete(5000));
		let messages: Collection<string, Message>;
		messages = (await message.channel.fetchMessages({ limit: 100 }))
			.filter((a: Message) => a.author.id === this.bot.user.id);
		const toDelete: string[] = messages.keyArray().slice(0, quantity);
		for (let key of toDelete) { await messages.get(key).delete(); }
		return message.channel.sendMessage('Prune operation completed.')
				.then(res => (<Message> res).delete(5000));
	}
};
