const Discord = require("discord.js");

module.exports = class {

	constructor (client) {
		this.client = client;
	}
    
	async run (guild) {
        
		const text = "Biri beni banladı **"+guild.name+"** ile **"+guild.members.cache.filter((m) => !m.user.bot).size+"** üyeler (ve "+guild.members.cache.filter((m) => m.user.bot).size+" bot)";

		
		const embed = new Discord.MessageEmbed()
			.setAuthor(guild.name, guild.iconURL())
			.setColor("#B22222")
			.setDescription(text);
		this.client.channels.cache.get(this.client.config.support.logs).send(embed);

	}
};  