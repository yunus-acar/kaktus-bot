const Command = require("../../main/Command.js");

class Choice extends Command {

	constructor (client) {
		super(client, {
			name: "choice",
			dirname: __dirname,
			enabled: true,
			guildOnly: false,
			aliases: [ "random" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}

	async run (message, args) {

		
		const answers = args.join(" ").split("/");
		if (answers.length < 2) return message.error("eglence/choice:MISSING");
		if (answers.some(answer => !answer))
			return message.error("eglence/choice:EMPTY");

		const m = await message.sendT(
			"eglence/choice:PROGRESS",
			null,
			false,
			false,
			"loading"
		);

		setTimeout(() => {
			m.success("eglence/choice:DONE", null, {
				edit: true
			});
			const result =
                answers[parseInt(Math.floor(Math.random() * answers.length))];
			message.channel.send("```" + result + "```");
		}, 1500);
        
	}

}

module.exports = Choice;