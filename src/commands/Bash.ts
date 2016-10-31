'use strict';
import { Command } from 'yamdbf';
import { User, Message } from 'discord.js';
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
			argOpts: { stringArgs: true },
			ownerOnly: true
		});
	}

	public async action(message: Message, args: Array<string | number>, mentions: User[], original: string): Promise<any>
	{
		message.delete();
		if (!args[0])
			return message.channel.sendMessage('You must provide a command to execute.')
				.then(res => (<Message> res).delete(5000));
		if (args.includes('rm') || args.includes('sudo') || args.includes('su'))
			return message.channel.sendMessage('Forbidden.')
				.then(res => (<Message> res).delete(5000));
		const execution: Message = <Message> await message.channel.sendMessage('_Executing..._');
		let result: string;
		try
		{
			result = execSync(args.join(' '), { cwd: '../', timeout: 5000 }).toString();
		}
		catch (err)
		{
			result = err;
		}
		const output: string = `**INPUT:**\n\`\`\`bash\n$ ${args.join(' ')}\n\`\`\`\n`
			+ `**OUTPUT:**\n\`\`\`ts\n${result}\n\`\`\``;
		return execution.delete().then(() => message.channel.sendMessage(output, { split: true }));
	}
};
