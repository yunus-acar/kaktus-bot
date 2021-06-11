const Command = require("../../main/Command.js");

class Addcommand extends Command {

	constructor (client) {
		super(client, {
			name: "addcommand",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [ "custom-command" ],
			memberPermissions: [ "MANAGE_GUILD" ],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 3000
		});
	}

	async run (message, args, data) {
        
		if (!args[0]){
			return message.error("admin/addcommand:MISSING_NAME");
		}

		const name = args[0].split("\n")[0];

		if (
			this.client.commands.get(name) ||
            this.client.aliases.get(name) ||
            data.guild.customCommands.find((c) => c.name === name)
		) {
			return message.error(
				"admin/addcommand:COMMAND_ALREADY_EXISTS"
			);
		}

		const answer = (args[0].split("\n")[1] || "") + args.slice(1).join(" ");
		if (!answer) {
			return message.error("admin/addcommand:MISSING_ANSWER");
		}

		data.guild.customCommands.push({
			name: name.toLowerCase(),
			answer: answer
		});
		data.guild.save();

		message.success("admin/addcommand:SUCCESS", {
			commandName: name,
			prefix: data.guild.prefix
		});
	}
    
}

module.exports = Addcommand;
