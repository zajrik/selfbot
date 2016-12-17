'use strict';
import { Bot, Command } from 'yamdbf';
import { User, Message, Collection, RichEmbed } from 'discord.js';

type int = number;

export default class Help extends Command
{
	public constructor(bot: Bot)
	{
		super(bot, {
			name: 'help',
			description: 'Provides information on bot commands',
			aliases: [],
			usage: `<prefix>help [command]`,
			extraHelp: 'Will DM bot command help information to the user to keep clutter down in guild channels. If you use the help command from within a DM you will only receive information for the commands you can use within the DM. If you want help with commands usable in a guild, call the help command in a guild channel. You will receive a list of the commands that you have permissions/roles for in that channel.',
			group: 'base',
			overloads: 'help'
		});
	}

	public async action(message: Message, args: Array<string | number>, mentions: User[], original: string): Promise<any>
	{
		if (this.bot.selfbot) message.delete();
		const dm: boolean = message.channel.type === 'dm' || message.channel.type === 'group';
		const mentionName: string = `@${this.bot.user.username}#${this.bot.user.discriminator}`;

		let usableCommands: Collection<string, Command>;
		let command: Command;
		let output: string = '';
		let embed: RichEmbed = new RichEmbed();

		if (!args[0])
		{
			if (!dm)
			{
				output += `Available commands in ${message.channel}\n\`\`\`ldif\n`;
				usableCommands = this.bot.commands.filterGuildUsable(this.bot, message);
			}
			else
			{
				output += `Available commands in this DM:\n\`\`\`ldif\n`;
				usableCommands = this.bot.commands.filterDMUsable(this.bot, message);
			}

			const widest: int = usableCommands.map(c => c.name.length).reduce((a, b) => Math.max(a, b));
			output += usableCommands.map(c =>
				`${this._padRight(c.name, widest + 1)}: ${c.description}`).sort().join('\n');

			output += `\`\`\`Use \`<prefix>help <command>\` ${this.bot.selfbot ? '' : `or \`${
				mentionName} help <command>\` `}for more information.\n\n`;
		}
		else
		{
			const filter: Function = c => c.name === args[0] || c.aliases.includes(<string> args[0]);
			if (!dm) command = this.bot.commands
				.filterGuildUsable(this.bot, message).filter(filter).first();
			else command = this.bot.commands
				.filterDMHelp(this.bot, message).filter(filter).first();

			if (!command) output = `A command by that name could not be found or you do\n`
				+ `not have permissions to view it in this guild or channel`;
			else output = '```ldif\n'
				+ `Command: ${command.name}\n`
				+ `Description: ${command.description}\n`
				+ (command.aliases.length > 0 ? `Aliases: ${command.aliases.join(', ')}\n` : '')
				+ `Usage: ${command.usage}\n`
				+ (command.extraHelp ? `\n${command.extraHelp}` : '')
				+ '\n```';
		}

		output = dm ? output.replace(/<prefix>/g, '')
			: output.replace(/<prefix>/g, this.bot.getPrefix(message.guild) || '');

		embed.setColor(11854048).setDescription(output);

		let outMessage: Message;
		if (!dm && !this.bot.selfbot && command) message.reply(`Sent you a DM with help information.`);
		if (!dm && !this.bot.selfbot && !command) message.reply(`Sent you a DM with information.`);
		if (this.bot.selfbot) outMessage = <Message> await message.channel.sendEmbed(embed);
		else message.author.sendEmbed(embed);

		if (this.bot.selfbot) outMessage.delete(30e3);
	}

	private _padRight(text: string, width: int): string
	{
		let pad: int = Math.max(0, Math.min(width, width - text.length));
		return `${text}${' '.repeat(pad)}`;
	}
}
