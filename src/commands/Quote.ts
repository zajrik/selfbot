'use strict';
import { Bot, Command } from 'yamdbf';
import { User, Message, TextChannel, RichEmbed } from 'discord.js';

export default class Quote extends Command
{
	public constructor(bot: Bot)
	{
		super(bot, {
			name: 'quote',
			aliases: [],
			description: 'quote a message',
			usage: '<prefix>quote <message id>',
			extraHelp: '',
			group: 'base',
			guildOnly: false,
			argOpts: { stringArgs: true, separator: ' ' },
			permissions: [],
			roles: [],
			ownerOnly: false
		});
	}

	public async action(message: Message, args: Array<string | number>, mentions: User[], original: string): Promise<any>
	{
		message.delete();
		const channelRegex: RegExp = /^(?:<#)?(\d+)>?$/;
		const messageId: string = <string> args[0];
		const channelId: string = args[1] && channelRegex.test(<string> args[1])
			? (<string> args[1]).match(channelRegex)[1] : null;
		const quote: Message = (await (<TextChannel> this.bot.channels.get(channelId) || message.channel)
			.fetchMessages({ limit: 1, around: messageId })).first();
		const color: number = quote.member ? quote.member.highestRole.color : 8450847;
		if (!quote) return message.channel.sendMessage(`*Failed to fetch message.*`);
		const embed: RichEmbed = new RichEmbed()
			.setColor(color)
			.setAuthor(`${quote.author.username}#${quote.author.discriminator} | ${
				quote.guild.name} #${(<TextChannel> quote.channel).name}`, quote.author.avatarURL)
			.setDescription(quote.content)
			.setTimestamp(quote.createdAt);

		message.channel.sendEmbed(embed);
	}
}
