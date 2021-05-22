const Command = require("../../main/Command.js");

class Unban extends Command {

	constructor (client) {
		super(client, {
			name: "unban",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [ "deban", "déban" ],
			memberPermissions: [ "BAN_MEMBERS" ],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS", "BAN_MEMBERS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 3000
		});
	}

	async run (message, args) {

		let user = null;

		if(!args[0]){
			return message.error("mod/unban:MISSING_ID");
		}

		
		const isId = !isNaN(args[0]);

		if(isId){
			
			await this.client.users.fetch(args[0]).then((u) => {
			
				user = u;
			}).catch(() => {});
		} else if(!isId) {
			const arr = args[0].split("#");
			if(arr.length < 2){
				return message.error("misc:NO_USER_FOUND_ID", {
					id: args[0]
				});
			}
			user = this.client.users.filter((u) => u.username === arr[0]).find((u) => u.discriminator === arr[1]);
		}

		if(!user){
			return message.error("misc:NO_USER_FOUND_ID", {
				id: args[0]
			});
		}

	
		const banned = await message.guild.fetchBans();
		if(!banned.some((e) => e.user.id === user.id)){
			return message.success("mod/unban:NOT_BANNED", {
				username: user.tag
			});
		}

		
		message.guild.members.unban(user).catch(() => {});

		
		message.success("mod/unban:UNBANNED", {
			username: user.tag,
			server: message.guild.name
		});

	}

}

module.exports = Unban;