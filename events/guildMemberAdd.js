const stringCleaner = require("@sindresorhus/slugify");
const Canvas = require("canvas"),
	Discord = require("discord.js");
const { resolve } = require("path");
// Register assets fonts
Canvas.registerFont(resolve("./assets/fonts/theboldfont.ttf"), { family: "Bold" });
Canvas.registerFont(resolve("./assets/fonts/SketchMatch.ttf"), { family: "SketchMatch" });

const applyText = (canvas, text, defaultFontSize) => {
	const ctx = canvas.getContext("2d");
	do {
		ctx.font = `${defaultFontSize -= 10}px Bold`;
	} while (ctx.measureText(text).width > 600);
	return ctx.font;
};

module.exports = class {

	constructor (client) {
		this.client = client;
	}

	async run (member) {
    
		await member.guild.members.fetch();

		const guildData = await this.client.findOrCreateGuild({ id: member.guild.id });
		member.guild.data = guildData;

		const memberData = await this.client.findOrCreateMember({ id: member.id, guildID: member.guild.id });
		if(memberData.mute.muted && memberData.mute.endDate > Date.now()){
			member.guild.channels.cache.forEach((channel) => {
				channel.updateOverwrite(member.id, {
					SEND_MESSAGES: false,
					ADD_REACTIONS: false,
					CONNECT: false
				}).catch(() => {});
			});
		}

		
		if(guildData.plugins.autorole.enabled){
			member.roles.add(guildData.plugins.autorole.role).catch(() => {});
		}
    
		
		if(guildData.plugins.welcome.enabled){
			const channel = member.guild.channels.cache.get(guildData.plugins.welcome.channel);
			if(channel){
				const message = guildData.plugins.welcome.message
					.replace(/{user}/g, member)
					.replace(/{server}/g, member.guild.name)
					.replace(/{membercount}/g, member.guild.memberCount);
				if(guildData.plugins.welcome.withImage){
					const canvas = Canvas.createCanvas(1024, 450),
						ctx = canvas.getContext("2d");
                    
				
					const background = await Canvas.loadImage("./assets/img/kaktusBg.png");
			
					ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
					
					ctx.fillStyle = "rgb(148,31,158)";
					const username = stringCleaner(member.user.username, {
						separator: " ",
						lowercase: false,
						decamelize: false,
						preserveLeadingUnderscore: true,
					});
					ctx.font = applyText(canvas, username, 48);
					ctx.fillText(username, canvas.width - 660, canvas.height - 248);
					
					ctx.font = applyText(canvas, member.guild.translate("admin/welcome:IMG_WELCOME", {
						server: member.guild.name
					}), 53);
					ctx.fillText(member.guild.translate("admin/welcome:IMG_WELCOME", {
						server: member.guild.name
					}), canvas.width - 690, canvas.height - 65);
					
					ctx.font = "40px Bold";
					ctx.fillText(member.user.discriminator, canvas.width - 623, canvas.height - 178);
					
					ctx.font = "22px Bold";
					ctx.fillText(member.guild.translate("admin/welcome:IMG_NB", {
						memberCount: member.guild.memberCount
					}), 40, canvas.height - 50);
					
					ctx.fillStyle = "#941f9e";
					ctx.font = "75px SketchMatch";
					ctx.fillText("#", canvas.width - 690, canvas.height - 165);
					
					ctx.font = "90px Bold";
					ctx.strokeStyle = "#fff";
					ctx.lineWidth = 5;
					ctx.strokeText(member.guild.translate("admin/welcome:TITLE"), canvas.width - 650, canvas.height - 330);
					var gradient = ctx.createLinearGradient(canvas.width - 780, 0, canvas.width - 30, 0);
					gradient.addColorStop(0, "#941f9e");
					gradient.addColorStop(1, "#03A9F4");
					ctx.fillStyle = gradient;
					ctx.fillText(member.guild.translate("admin/welcome:TITLE"), canvas.width - 650, canvas.height - 330);
					
					
					ctx.beginPath();
					
					ctx.lineWidth = 10;
					
					ctx.strokeStyle = "#941f9e";
					
					ctx.arc(180, 225, 135, 0, Math.PI * 2, true);
					
					ctx.stroke();
					
					ctx.closePath();
					
					ctx.clip();
                    
					const options = { format: "png", size: 512 },
						avatar = await Canvas.loadImage(member.user.displayAvatarURL(options));
						
					ctx.drawImage(avatar, 45, 90, 270, 270);

					const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "welcome-image.png");
					channel.send(message, {
						files: [attachment],
						allowedMentions: {
							parse: ["users", "everyone", "roles"]
						}
					});
				} else {
					channel.send(message, {
						allowedMentions: {
							parse: ["users", "everyone", "roles"]
						}
					});
				}
			}
		}

	}

};