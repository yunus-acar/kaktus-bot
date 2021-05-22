const Command = require("../../main/Command.js"),
	Discord = require("discord.js");

class Help extends Command {
	constructor(client) {
		super(client, {
			name: "help",
			dirname: __dirname,
			enabled: true,
			guildOnly: false,
			aliases: ["aide", "h", "commands"],
			memberPermissions: [],
			botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}

	async run(message, args, data) {


		if (args[0]) {

			const isCustom = (message.guild && data.guild.customCommands ? data.guild.customCommands.find((c) => c.name === args[0]) : false);


			const cmd = this.client.commands.get(args[0]) || this.client.commands.get(this.client.aliases.get(args[0]));
			if (!cmd && isCustom) {
				return message.error("genel/help:CUSTOM", {
					cmd: args[0]
				});
			} else if (!cmd) {
				return message.error("genel/help:NOT_FOUND", {
					search: args[0]
				});
			}

			const description = message.translate(`${cmd.help.category.toLowerCase()}/${cmd.help.name}:DESCRIPTION`);
			const usage = message.translate(`${cmd.help.category.toLowerCase()}/${cmd.help.name}:USAGE`, {
				prefix: message.guild
					? data.guild.prefix
					: ""
			}
			);
			const examples = message.translate(`${cmd.help.category.toLowerCase()}/${cmd.help.name}:EXAMPLES`, {
				prefix: message.guild
					? data.guild.prefix
					: ""
			}
			);


			const groupEmbed = new Discord.MessageEmbed()
				.setAuthor(
					message.translate("genel/help:CMD_TITLE", {
						prefix: message.guild
							? data.guild.prefix
							: "",
						cmd: cmd.help.name
					})
				)
				.addField(
					message.translate("genel/help:FIELD_DESCRIPTION"),
					description
				)
				.addField(message.translate("genel/help:FIELD_USAGE"), usage)
				.addField(
					message.translate("genel/help:FIELD_EXAMPLES"),
					examples
				)
				.addField(
					message.translate("genel/help:FIELD_ALIASES"),
					cmd.help.aliases.length > 0
						? cmd.help.aliases.map(a => "`" + a + "`").join("\n")
						: message.translate("genel/help:NO_ALIAS")
				)
				.addField(
					message.translate("genel/help:FIELD_PERMISSIONS"),
					cmd.conf.memberPermissions.length > 0
						? cmd.conf.memberPermissions.map((p) => "`" + p + "`").join("\n")
						: message.translate("genel/help:NO_REQUIRED_PERMISSION")
				)
				.setColor(this.client.config.embed.color)
				.setFooter(this.client.config.embed.footer);


			return message.channel.send(groupEmbed);
		}

		const categories = [];
		const commands = this.client.commands;

		commands.forEach((command) => {
			if (!categories.includes(command.help.category)) {
				if (command.help.category === "Owner" && message.author.id !== this.client.config.owner.id) {
					return;
				}
				categories.push(command.help.category);
			}
		});

		const emojis = this.client.customEmojis;

		const embed = new Discord.MessageEmbed()
			.setDescription(message.translate("genel/help:INFO", {
				prefix: message.guild
					? data.guild.prefix
					: ""
			}))
			.setColor(data.config.embed.color)
			.setFooter(data.config.embed.footer);
		categories.sort().forEach((cat) => {
			const tCommands = commands.filter((cmd) => cmd.help.category === cat);
			embed.addField(emojis.categories[cat.toLowerCase()] + " " + cat + " - (" + tCommands.size + ")", tCommands.map((cmd) => "`" + cmd.help.name + "`").join(", "));
		});
		if (message.guild) {
			if (data.guild.customCommands.length > 0) {
				embed.addField(emojis.categories.custom + " " + message.guild.name + " | " + message.translate("genel/help:CUSTOM_COMMANDS") + " - (" + data.guild.customCommands.length + ")", data.guild.customCommands.map((cmd) => "`" + cmd.name + "`").join(", "));
			}
		}

		embed.addField("\u200B", message.translate("misc:STATS_FOOTER", {
			inviteLink: await this.client.generateInvite({
				permissions: [Discord.Permissions.FLAGS.ADMINISTRATOR]
			}),
			githubLink: "https://github.com/yunus-acar/kaktus-bot"
			
		}));
		embed.setAuthor(message.translate("genel/help:TITLE", {
			name: this.client.user.username
		}), this.client.user.displayAvatarURL({ size: 512, dynamic: true, format: "png" }));
		return message.channel.send(embed);
	}

}

module.exports = Help;
