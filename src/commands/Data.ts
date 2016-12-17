'use strict';
import { Bot, Command } from 'yamdbf';
import { User, Message, RichEmbed } from 'discord.js';
import { execSync } from 'child_process';

type int = number;
type float = number;
export default class Data extends Command
{
	public constructor(bot: Bot)
	{
		super(bot, {
			name: 'data',
			aliases: [],
			description: 'Check data received for current uptime',
			usage: '<prefix>data',
			extraHelp: '',
			group: 'base',
			guildOnly: false,
			argOpts: { stringArgs: false, separator: ' ' },
			permissions: [],
			roles: [],
			ownerOnly: false
		});
	}

	public async action(message: Message, args: Array<string | number>, mentions: User[], original: string): Promise<any>
	{
		message.delete();
		const uptime: float = parseFloat(execSync(`awk '{print $1/60/60/24}' /proc/uptime`,
			{ timeout: 10e3 }).toString());
		const dataRegex: RegExp = /RX bytes:(\d+) \((\d+(?:\.\d+ [K|M|G]B))\)/;
		const data: RegExpMatchArray = execSync(`ifconfig | grep '[K|M|G]B'`, { timeout: 10e3 }).toString()
			.match(dataRegex);

		const received: int = parseInt(data[1]);
		const receivedSimple: string = data[2];

		const receivedPerDay: string = ((received / 1000 / 1000 / 1000) / uptime).toFixed(2);
		const embed: RichEmbed = new RichEmbed()
			.setColor(8450847)
			.setDescription('**Received Data Statistics**')
			.addField('Server Uptime', `${uptime.toFixed(2)} days`)
			.addField('Data Received', receivedSimple)
			.addField('Total', `${receivedPerDay} GB/day`);

		message.channel.sendEmbed(embed);
	}
}
