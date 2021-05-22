const Command = require("../../main/Command.js");

class Deletemod extends Command {

	constructor (client) {
		super(client, {
			name: "deletemod",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [ "autodeletemodcommands" ],
			memberPermissions: [ "MANAGE_MESSAGES" ],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 3000
		});
	}

	async run (message, args, data) {
		const status = args[0];
		if(!status || status !== "on" && status !== "off"){
			return message.error("admin/deletemod:MISSING_STATUS");
		}
		if(status === "on"){
			data.guild.autoDeleteModCommands = true;
			data.guild.save();
			message.success("admin/deletemod:ENABLED");
		} else {
			data.guild.autoDeleteModCommands = false;
			data.guild.save();
			message.success("admin/deletemod:DISABLED");
		}
	}

}

module.exports = Deletemod;