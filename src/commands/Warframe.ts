'use strict';
import { Bot, Command } from 'yamdbf';
import { User, Message, Collection, MessageCollector } from 'discord.js';

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
		message = await message.edit(`_Waiting for Warframe bot response..._`);

		const prune: number = <number> (!isNaN(<number> args[0]) ? args[0] : null);
		const command: string = <string> (prune ? args[1] : args[0]);
		const cmdArgs: string = <string> (prune ? args.slice(2) : args.slice(1)).join(' ') || null;

		const wfBot: User = this.bot.users.get('219977426036457483');
		const cmdMsg: Message = <Message> await wfBot.sendMessage(`${command} ${cmdArgs ? cmdArgs : ''}`);

		const collector: MessageCollector = cmdMsg.channel.createCollector(
			a => a.author.id === wfBot.id, { max: 1, time: 10000 });

		let output: Message;
		let pruneTimer: NodeJS.Timer;

		collector.on('message', async (msg: Message) =>
		{
			output = <Message> await message.edit(msg.content);
			pruneTimer = this.bot.setTimeout(() => { if (prune) output.delete(); }, prune * 1000);
			const update: Function = (old: Message, changed: Message) =>
			{
				if (changed.author.id !== wfBot.id
					&& changed.channel.id !== cmdMsg.channel.id) return;
				this.bot.removeListener('messageUpdate', update);
				this.bot.clearTimeout(pruneTimer);
				output.edit(changed.content)
					.then((res: Message) => prune ? res.delete(prune * 1000) : null);
			};
			this.bot.on('messageUpdate', update);
			this.bot.setTimeout(() => this.bot.removeListener('messageUpdate', update), 10000);
		})
		.on('end', (collected: Collection<string, Message>, reason: string) =>
		{
			if (reason !== 'time') return;
			this.bot.clearTimeout(pruneTimer);
			output.edit('WarframeBot response timed out.')
				.then((res: Message) => res.delete(5000));
		});
	}
}
