const Command = require("../../main/Command.js"),
	Discord = require("discord.js");

class Configuration extends Command {

	constructor (client) {
		super(client, {
			name: "configuration",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [ "conf", "config" ],
			memberPermissions: [ "MANAGE_GUILD" ],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 3000
		});
	}

	async run (message, args, data) {

		const guildData = data.guild;

		const embed = new Discord.MessageEmbed()
			.setAuthor(message.guild.name, message.guild.iconURL())
			.setColor(this.client.config.embed.color)
			.setFooter(this.client.config.embed.footer);

		
		embed.addField(message.translate("admin/configuration:PREFIX_TITLE"), guildData.prefix);

		
		embed.addField(message.translate("admin/configuration:IGNORED_CHANNELS_TITLE"),
			(guildData.ignoredChannels.length > 0) ?
				guildData.ignoredChannels.map((ch) => `<#${ch}>`).join(", ")
				:   message.translate("admin/configuration:NO_IGNORED_CHANNELS")
		);
    
		
		embed.addField(message.translate("admin/configuration:AUTOROLE_TITLE"), 
			(guildData.plugins.autorole.enabled) ?
				message.translate("admin/configuration:AUTOROLE_CONTENT", {
					roleName: `<@&${guildData.plugins.autorole.role}>`
				})
				:   message.translate("admin/configuration:AUTOROLE_DISABLED")
		);
        
		
		embed.addField(message.translate("admin/configuration:WELCOME_TITLE"),
			(guildData.plugins.welcome.enabled) ?
				message.translate("admin/configuration:WELCOME_CONTENT", {
					channel: `<#${guildData.plugins.welcome.channel}>`,
					withImage: guildData.plugins.welcome.withImage ? message.translate("common:YES") : message.translate("common:NO")
				})
				:   message.translate("admin/configuration:WELCOME_DISABLED")
		);
            
		
		embed.addField(message.translate("admin/configuration:GOODBYE_TITLE"),
			(guildData.plugins.goodbye.enabled) ?
				message.translate("admin/configuration:GOODBYE_CONTENT", {
					channel: `<#${guildData.plugins.goodbye.channelID}>`,
					withImage: guildData.plugins.goodbye.withImage ? message.translate("common:YES") : message.translate("common:NO")
				})
				:   message.translate("admin/configuration:GOODBYE_DISABLED")
		);

		
		embed.addField(message.translate("admin/configuration:SPECIAL_CHANNELS"),
			message.translate("admin/configuration:MODLOGS", {
				channel:    guildData.plugins.modlogs
					? `<#${guildData.plugins.modlogs}>`
					: message.translate("common:NOT_DEFINED")
			}) + "\n" +
			message.translate("admin/configuration:SUGGESTIONS", {
				channel:    guildData.plugins.suggestions
					? `<#${guildData.plugins.suggestions}>`
					: message.translate("common:NOT_DEFINED")
			}) + "\n" +
			message.translate("admin/configuration:REPORTS", {
				channel:    guildData.plugins.reports
					? `<#${guildData.plugins.reports}>`
					: message.translate("common:NOT_DEFINED")
			})
		);
        
		
		embed.addField(message.translate("admin/configuration:AUTO_SANCTIONS"),
			((guildData.plugins.warnsSanctions.kick) ?
				message.translate("admin/configuration:KICK_CONTENT", {
					count: guildData.plugins.warnsSanctions.kick
				})
				:   message.translate("admin/configuration:KICK_NOT_DEFINED")) + "\n" +
			((guildData.plugins.warnsSanctions.ban) ?
				message.translate("admin/configuration:BAN_CONTENT", {
					count: guildData.plugins.warnsSanctions.ban
				})
				:   message.translate("admin/configuration:BAN_NOT_DEFINED"))
		);

		
		embed.addField(message.translate("admin/configuration:AUTOMOD_TITLE"),
			(guildData.plugins.automod.enabled) ?
				message.translate("admin/configuration:AUTOMOD_CONTENT", {
					channels: guildData.plugins.automod.ignored.map((ch) => `<#${ch}>`)
				})
				:   message.translate("admin/configuration:AUTOMOD_DISABLED")
		);

		
		embed.addField(message.translate("admin/configuration:AUTODELETEMOD"),
			(!message.guild.autoDeleteModCommands) ?
				message.translate("admin/configuration:AUTODELETEMOD_ENABLED")
				:   message.translate("admin/configuration:AUTODELETEMOD_DISABLED")
		);

		
		embed.addField(message.translate("admin/configuration:DASHBOARD_TITLE"), `[${message.translate("admin/configuration:DASHBOARD_CONTENT")}](${this.client.config.supportURL})`);

		message.channel.send(embed);
	}

}

module.exports = Configuration;
