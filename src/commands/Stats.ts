'use strict';
import { Bot, Command, version } from 'yamdbf';
import * as Discord from 'discord.js';
import { User, Message, RichEmbed } from 'discord.js';
import Time from '../lib/Time';

export default class Stats extends Command
{
	public constructor(bot: Bot)
	{
		super(bot, {
			name: 'stats',
			aliases: [],
			description: 'Bot statistics',
			usage: '<prefix>stats',
			extraHelp: '',
			group: 'base'
		});
	}

	public action(message: Message, args: Array<string | number>, mentions: User[], original: string): any
	{
		message.delete();
		const embed: RichEmbed = new RichEmbed()
			.setAuthor('Selfbot Statistics', this.bot.user.avatarURL)
			.setColor(8450847)
			.addField('Mem Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
			.addField('Uptime', Time.difference(this.bot.uptime * 2, this.bot.uptime).toString(), true)
			.addField('\u200b', '\u200b', true)
			.addField('Servers', this.bot.guilds.size.toString(), true)
			.addField('Channels', this.bot.channels.size.toString(), true)
			.addField('Users', this.bot.guilds.map(g => g.memberCount).reduce((a, b) => a + b), true)
			.addField('YAMDBF', `v${version}`, true)
			.addField('Discord.js', `v${Discord.version}`, true)
			.addField('\u200b', '\u200b', true)
			.addField('Selfbot Source', '[Available on GitHub](https://github.com/zajrik/selfbot)', true)
			.addField('YAMDBF Info', 'https://yamdbf.js.org', true)
			.setFooter('YAMDBF', this.bot.user.avatarURL)
			.addField('\u200b', '\u200b', true)
			.setTimestamp();

		message.channel.sendEmbed(embed);
	}
}
