'use strict';
import { Bot, Command } from 'yamdbf';
import { User, Message, TextChannel } from 'discord.js';

export default class Todo extends Command
{
	public constructor(bot: Bot)
	{
		super(bot, {
			name: 'todo',
			aliases: [],
			description: 'Save a todo message to the TODO channel',
			usage: '<prefix>todo <message>',
			extraHelp: 'Requires use of the storage item `todochannel` which can be set via `<prefix>storage set todochannel <id>`',
			group: 'tag'
		});
	}

	public action(message: Message, args: Array<string | number>, mentions: User[], original: string): any
	{
		message.delete();
		if (!this.bot.storage.exists('todochannel'))
			return message.channel.sendMessage(`You have not set a channel to save todos. `
				+ `Run \`${this.bot.getPrefix(message.guild)}storage set todochannel <id>\` to set one.`)
				.then((res: Message) => res.delete(10000));
		return (<TextChannel> this.bot.channels.get(this.bot.storage.getItem('todochannel')))
			.sendCode('css', `TODO: ${args.join(' ')}`);
	}
}
