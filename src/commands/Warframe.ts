'use strict';
import { Bot, Command } from 'yamdbf';
import { User, Message, Collection } from 'discord.js';

export default class Warframe extends Command
{
	public constructor(bot: Bot)
	{
		super(bot, {
			name: 'wf',
			aliases: [],
			description: 'Fetch output from WarframeBot',
			usage: '<prefix>wf [prune timer] <command> [...args]',
			extraHelp: '',
			group: 'base'
		});
	}

	public async action(message: Message, args: Array<string | number>, mentions: User[], original: string): Promise<any>
	{
		message.edit(`_Waiting for Warframe bot response..._`);
		const wfBot: User = this.bot.users.get('219977426036457483');
		const prune: number = <number> (!isNaN(<number> args[0]) ? args[0] : null);
		const command: string = <string> (prune ? args[1] : args[0]);
		const cmdArgs: string = <string> (prune ? args.slice(2) : args.slice(1)).join(' ') || null;
		const cmdMsg: Message = <Message> await wfBot.sendMessage(`${command} ${cmdArgs ? cmdArgs : ''}`);
		const response: Collection<string, Message> = await cmdMsg.channel
			.awaitMessages(a => a.author.id === wfBot.id, { max: 1, time: 10000 });
		if (!response.first()) return message.edit('Warframe bot response timed out.')
			.then((res: Message) => res.delete(5000));
		return message.edit(response.first().content).then(res =>
			prune ? (<Message> res).delete(prune * 1000) : null);
	}
};
