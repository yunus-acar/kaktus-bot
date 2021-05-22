const Command = require("../../main/Command.js"),
	ms = require("ms");

class Giveaway extends Command {

	constructor (client) {
		super(client, {
			name: "giveaway",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [ "gway" ],
			memberPermissions: [ "MENTION_EVERYONE" ],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}

	async run (message, args, data) {
        
		const status = args[0];
		if(!status){
			return message.error("mod/giveaway:MISSING_STATUS");
		}

		if(status === "create"){
			const currentGiveaways = this.client.giveawaysManager.giveaways.filter((g) => g.guildID === message.guild.id && !g.ended).length;
			if(currentGiveaways > 3){
				return message.error("mod/giveaway:MAX_COUNT");
			}
			const time = args[1];
			if(!time){
				return message.error("mod/giveaway:INVALID_CREATE", {
					prefix: data.guild.prefix
				});
			}
			if(isNaN(ms(time))){
				return message.error("misc:INVALID_TIME");
			}
			if(ms(time) > ms("15d")){
				return message.error("mod/giveaway:MAX_DURATION");
			}
			const winnersCount = args[2];
			if(!winnersCount){
				return message.error("mod/giveaway:INVALID_CREATE", {
					prefix: data.guild.prefix
				});
			}
			if(isNaN(winnersCount) || winnersCount > 10 || winnersCount < 1){
				return message.error("misc:INVALID_NUMBER_RANGE", {
					min: 1,
					max: 10
				});
			}
			const prize = args.slice(3).join(" ");
			if(!prize){
				return message.error("mod/giveaway:INVALID_CREATE", {
					prefix: data.guild.prefix
				});
			}
			this.client.giveawaysManager.start(message.channel, {
				time: ms(time),
				prize: prize,
				winnerCount: parseInt(winnersCount, 10),
				messages: {
					giveaway: message.translate("mod/giveaway:TITLE"),
					giveawayEnded: message.translate("mod/giveaway:ENDED"),
					timeRemaining: message.translate("mod/giveaway:TIME_REMAINING"),
					inviteToParticipate: message.translate("mod/giveaway:INVITE_PARTICIPATE"),
					winMessage: message.translate("mod/giveaway:WIN_MESSAGE"),
					embedFooter: message.translate("mod/giveaway:FOOTER"),
					noWinner: message.translate("mod/giveaway:NO_WINNER"),
					winners: message.translate("mod/giveaway:WINNERS"),
					endedAt: message.translate("mod/giveaway:END_AT"),
					units: {
						seconds: message.translate("time:SECONDS", { amount: "" }).trim(),
						minutes: message.translate("time:MINUTES", { amount: "" }).trim(),
						hours: message.translate("time:HOURS", { amount: "" }).trim(),
						days: message.translate("time:DAYS", { amount: "" }).trim()
					}	
				}
			}).then(() => {
				message.success("mod/giveaway:GIVEAWAY_CREATED");
			});
		} else if(status === "reroll"){
			const messageID = args[1];
			if(!messageID){
				return message.error("mod/giveaway:MISSING_ID");
			}
			this.client.giveawaysManager.reroll(messageID, {
				congrat: message.translate("mod/giveaway:REROLL_CONGRAT"),
				error: message.translate("mod/giveaway:REROLL_ERROR")
			}).then(() => {
				return message.success("mod/giveaway:GIVEAWAY_REROLLED");
			}).catch(() => {
				return message.error("mod/giveaway:NOT_FOUND_ENDED", {
					messageID
				});
			});
		} else if(status === "delete"){
			const messageID = args[1];
			if(!messageID){
				return message.error("mod/giveaway:MISSING_ID");
			}
			this.client.giveawaysManager.delete(messageID).then(() => {
				return message.success("mod/giveaway:GIVEAWAY_DELETED");
			}).catch(() => {
				return message.error("mod/giveaway:NOT_FOUND", {
					messageID
				});
			});
		} else if(status === "end"){
			const messageID = args[1];
			if(!messageID){
				return message.error("mod/giveaway:MISSING_ID");
			}
			try {
				this.client.giveawaysManager.edit(messageID, {
					setEndTimestamp: Date.now()
				});
				return message.success("mod/giveaway:GIVEAWAY_ENDED");
			} catch(e){
				return message.error("mod/giveaway:NOT_FOUND", {
					messageID
				});
			}
		} else {
			return message.error("mod/giveaway:MISSING_STATUS");
		}

	}

}

module.exports = Giveaway;