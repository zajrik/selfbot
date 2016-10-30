'use strict';
import { Command } from 'yamdbf';
import { User, Message, TextChannel } from 'discord.js';
import { execSync } from 'child_process';

export default class Bash extends Command
{
	public constructor(bot)
	{
		super(bot, {
			name: '$',
			aliases: [],
			description: 'Execute a bash command and print output',
			usage: '<prefix>$ <command> [...args]',
			extraHelp: '',
			group: 'system',
			stringArgs: true,
			ownerOnly: true
		});
	}

	public async action(message: Message, args: Array<string | number>, mentions: User[], original: string): Promise<any>
	{
		message.delete();
		if (!args[0])
			return message.channel.sendMessage(`You must provide a command to execute.`)
				.then(res => (<Message> res).delete(5000));
		if (args.includes('rm') || args.includes('sudo') || args.includes('su'))
			return message.channel.sendMessage(`Forbidden.`)
				.then(res => (<Message> res).delete(5000));
		let execution: Message = await message.channel.sendMessage(`_Executing..._`)
		return execution.editCode('', execSync(args.join(' '), { cwd: '../', timeout: 5000 }).toString());
	}
};
