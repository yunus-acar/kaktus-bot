const Discord = require("discord.js");

module.exports = class {

	constructor (client) {
		this.client = client;
	}
    
	async run (guild) {
        
		await guild.members.fetch();

		const guildOwner = await this.client.users.fetch(guild.ownerID).catch(() => {});

		const messageOptions = {};

		const userData = await this.client.findOrCreateUser({ id: guild.ownerID });
		if(!userData.achievements.invite.achieved){
			userData.achievements.invite.progress.now += 1;
			userData.achievements.invite.achieved = true;
			messageOptions.files = [
				{
					name: "unlocked.png",
					attachment: "./assets/img/achievements/achievement_unlocked7.png"
				}
			];
			userData.markModified("achievements.invite");
			await userData.save();
		}

		const thanksEmbed = new Discord.MessageEmbed()
			.setAuthor("guilde eklediğin için teşekkürler !")
			.setDescription("yapılandırmak için yazın `"+this.client.config.prefix+"help` ve yönetim komutlarına bakın!\nDili değiştirmek için yazın`"+this.client.config.prefix+"setlang [language]`.")
			.setColor(this.client.config.embed.color)
			.setFooter(this.client.config.embed.footer)
			.setTimestamp();
		messageOptions.embed = thanksEmbed;

		guildOwner?.send(messageOptions).catch(() => {});

		const text = "Katıldı **"+guild.name+"**, ile **"+guild.members.cache.filter((m) => !m.user.bot).size+"** kullanıcılar  (ve "+guild.members.cache.filter((m) => m.user.bot).size+" bot)";


		const logsEmbed = new Discord.MessageEmbed()
			.setAuthor(guild.name, guild.iconURL())
			.setColor("#32CD32")
			.setDescription(text);
		this.client.channels.cache.get(this.client.config.support.logs).send(logsEmbed);
        
	}
};  