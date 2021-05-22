const Command = require("../../main/Command.js"),
	figlet = require("figlet"),
	util = require("util"),
	figletAsync = util.promisify(figlet);

class Ascii extends Command {

	constructor (client) {
		super(client, {
			name: "ascii",
			dirname: __dirname,
			enabled: true,
			guildOnly: false,
			aliases: [],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}

	async run (message, args) {
		const text = args.join(" ");
		if (!text || text.length > 20) {
			return message.error("eglence/ascii:TEXT_MISSING");
		}

		const rendered = await figletAsync(text, {
			font: 'Dancing Font',
			horizontalLayout: 'default',
			verticalLayout: 'default',
			width: 100,
			whitespaceBreak: true
		});
		message.channel.send("```" + rendered + "```");

	}

}

module.exports = Ascii;