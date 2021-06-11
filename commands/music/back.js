const Command = require("../../main/Command.js"),
	Discord = require("discord.js");

class Back extends Command {

	constructor (client) {
		super(client, {
			name: "back",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [ "previous" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}

	async run (message, args, data) {
        
		const queue = this.client.player.getQueue(message);

		const voice = message.member.voice.channel;
		if (!voice){
			return message.error("music/play:NO_VOICE_CHANNEL");
		}

		if(!queue){
			return message.error("music/play:NOT_PLAYING");
		}

		if(!queue.previousTracks[0]){
			return message.error("music/back:NO_PREV_SONG");
		}

		const members = voice.members.filter((m) => !m.user.bot);

		const embed = new Discord.MessageEmbed()
			.setAuthor(message.translate("music/back:DESCRIPTION"))
			.setThumbnail(queue.tracks[0].thumbnail)
			.setFooter(data.config.embed.footer)
			.setColor(data.config.embed.color);

		const m = await message.channel.send(embed);

		if(members.size > 1){
            
			m.react("👍");

			const mustVote = Math.floor(members.size/2+1);

			embed.setDescription(message.translate("music/back:VOTE_CONTENT", {
				songName: queue.tracks[0].name,
				voteCount: 0,
				requiredCount: mustVote
			}));
			m.edit(embed);
    
			const filter = (reaction, user) => {
				const member = message.guild.members.cache.get(user.id);
				const voiceChannel = member.voice.channel;
				if(voiceChannel){
					return voiceChannel.id === voice.id;
				}
			};

			const collector = await m.createReactionCollector(filter, {
				time: 25000
			});

			collector.on("collect", (reaction) => {
				const haveVoted = reaction.count-1;
				if(haveVoted >= mustVote){
					this.client.player.back(message);
					embed.setDescription(message.translate("music/back:SUCCESS"));
					m.edit(embed);
					collector.stop(true);
				} else {
					embed.setDescription(message.translate("music/back:VOTE_CONTENT", {
						songName: queue.tracks[0].title,
						voteCount: haveVoted,
						requiredCount: mustVote
					}));
					m.edit(embed);
				}
			});

			collector.on("end", (collected, isDone) => {
				if(!isDone){
					return message.error("misc:TIMES_UP");
				}
			});

		} else {
			this.client.player.back(message);
			embed.setDescription(message.translate("music/back:SUCCESS"));
			m.edit(embed);
		}
        
	}

}

module.exports = Back;
