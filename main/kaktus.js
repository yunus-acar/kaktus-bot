const { MessageEmbed, Util, Client, Collection, Intents } = require("discord.js");
const { GiveawaysManager } = require("discord-giveaways");



const util = require("util"),
	path = require("path"),
	moment = require("moment");

moment.relativeTimeThreshold("s", 60);
moment.relativeTimeThreshold("ss", 5);
moment.relativeTimeThreshold("m", 60);
moment.relativeTimeThreshold("h", 60);
moment.relativeTimeThreshold("d", 24);
moment.relativeTimeThreshold("M", 12);


class Kaktus extends Client {

	constructor () {
		super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MEMBERS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
				Intents.FLAGS.GUILD_VOICE_STATES,
				Intents.FLAGS.DIRECT_MESSAGES
			],
			allowedMentions: {
				parse: ["users"]
			}
		});
		this.config = require("../config"); 
		this.customEmojis = require("../emojis.json"); 
		this.languages = require("../languages/language-meta.json"); 
		this.commands = new Collection(); 
		this.aliases = new Collection(); 
		this.logger = require("../helper/logger"); 
		this.wait = util.promisify(setTimeout); 
		this.functions = require("../helper/functions"); 
		this.guildsData = require("../main/Guild"); 
		this.usersData = require("../main/User"); 
		this.membersData = require("../main/Member"); 
		this.logs = require("../main/Log"); 
		
		this.queues = new Collection(); 
		this.states = {}; 
		this.knownGuilds = [];

		this.databaseCache = {};
		this.databaseCache.users = new Collection();
		this.databaseCache.guilds = new Collection();
		this.databaseCache.members = new Collection();

		this.databaseCache.usersReminds = new Collection(); 
		this.databaseCache.mutedUsers = new Collection(); 

		
		

	

		this.giveawaysManager = new GiveawaysManager(this, {
			storage: "./giveaways.json",
			updateCountdownEvery: 10000,
			default: {
				botsCanWin: false,
				exemptPermissions: [ "MANAGE_MESSAGES", "ADMINISTRATOR" ],
				embedColor: "#FF0000",
				reaction: "🎉"
			}
		});
	}

	get defaultLanguage(){
		return this.languages.find((language) => language.default).name;
	}

	translate(key, args, locale){
		if(!locale) locale = this.defaultLanguage;
		const language = this.translations.get(locale);
		if (!language) throw "geçersiz dil dosyası.";
		return language(key, args);
	}

	printDate(date, format, locale){
		if(!locale) locale = this.defaultLanguage;
		const languageData = this.languages.find((language) => language.name === locale || language.aliases.includes(locale));
		if(!format) format = languageData.defaultMomentFormat;
		return moment(new Date(date))
			.locale(languageData.moment)
			.format(format);
	}

	convertTime(time, type, noPrefix, locale){
		if(!type) time = "to";
		if(!locale) locale = this.defaultLanguage;
		const languageData = this.languages.find((language) => language.name === locale || language.aliases.includes(locale));
		const m = moment(time)
			.locale(languageData.moment);
		return (type === "to" ? m.toNow(noPrefix) : m.fromNow(noPrefix));
	}

	loadCommand (commandPath, commandName) {
		try {
			const props = new (require(`.${commandPath}${path.sep}${commandName}`))(this);
			this.logger.log(`komut yükleniyor: ${props.help.name}. 🌵`, "log");
			props.conf.location = commandPath;
			if (props.init){
				props.init(this);
			}
			this.commands.set(props.help.name, props);
			props.help.aliases.forEach((alias) => {
				this.aliases.set(alias, props.help.name);
			});
			return false;
		} catch (e) {
			return `${commandName}: ${e} Komut yüklenemiyor`;
		}
	}

	async unloadCommand (commandPath, commandName) {
		let command;
		if(this.commands.has(commandName)) {
			command = this.commands.get(commandName);
		} else if(this.aliases.has(commandName)){
			command = this.commands.get(this.aliases.get(commandName));
		}
		if(!command){
			return `\`${commandName}\` komutu var gibi görünüyor. Tekrar deneyin!`;
		}
		if(command.shutdown){
			await command.shutdown(this);
		}
		delete require.cache[require.resolve(`.${commandPath}${path.sep}${commandName}.js`)];
		return false;
	}

	async findOrCreateUser({ id: userID }, isLean){
		if(this.databaseCache.users.get(userID)){
			return isLean ? this.databaseCache.users.get(userID).toJSON() : this.databaseCache.users.get(userID);
		} else {
			let userData = (isLean ? await this.usersData.findOne({ id: userID }).lean() : await this.usersData.findOne({ id: userID }));
			if(userData){
				if(!isLean) this.databaseCache.users.set(userID, userData);
				return userData;
			} else {
				userData = new this.usersData({ id: userID });
				await userData.save();
				this.databaseCache.users.set(userID, userData);
				return isLean ? userData.toJSON() : userData;
			}
		}
	}

	async findOrCreateMember({ id: memberID, guildID }, isLean){
		if(this.databaseCache.members.get(`${memberID}${guildID}`)){
			return isLean ? this.databaseCache.members.get(`${memberID}${guildID}`).toJSON() : this.databaseCache.members.get(`${memberID}${guildID}`);
		} else {
			let memberData = (isLean ? await this.membersData.findOne({ guildID, id: memberID }).lean() : await this.membersData.findOne({ guildID, id: memberID }));
			if(memberData){
				if(!isLean) this.databaseCache.members.set(`${memberID}${guildID}`, memberData);
				return memberData;
			} else {
				memberData = new this.membersData({ id: memberID, guildID: guildID });
				await memberData.save();
				const guild = await this.findOrCreateGuild({ id: guildID });
				if(guild){
					guild.members.push(memberData._id);
					await guild.save();
				}
				this.databaseCache.members.set(`${memberID}${guildID}`, memberData);
				return isLean ? memberData.toJSON() : memberData;
			}
		}
	}

	async findOrCreateGuild({ id: guildID }, isLean){
		if(this.databaseCache.guilds.get(guildID)){
			return isLean ? this.databaseCache.guilds.get(guildID).toJSON() : this.databaseCache.guilds.get(guildID);
		} else {
			let guildData = (isLean ? await this.guildsData.findOne({ id: guildID }).populate("members").lean() : await this.guildsData.findOne({ id: guildID }).populate("members"));
			if(guildData){
				if(!isLean) this.databaseCache.guilds.set(guildID, guildData);
				return guildData;
			} else {
				guildData = new this.guildsData({ id: guildID });
				await guildData.save();
				this.databaseCache.guilds.set(guildID, guildData);
				return isLean ? guildData.toJSON() : guildData;
			}
		}
	}

    
	async resolveUser(search){
		let user = null;
		if(!search || typeof search !== "string") return;
		
		if(search.match(/^<@!?(\d+)>$/)){
			const id = search.match(/^<@!?(\d+)>$/)[1];
			user = this.users.fetch(id).catch(() => {});
			if(user) return user;
		}
		
		if(search.match(/^!?(\w+)#(\d+)$/)){
			const username = search.match(/^!?(\w+)#(\d+)$/)[0];
			const discriminator = search.match(/^!?(\w+)#(\d+)$/)[1];
			user = this.users.find((u) => u.username === username && u.discriminator === discriminator);
			if(user) return user;
		}
		user = await this.users.fetch(search).catch(() => {});
		return user;
	}

	async resolveMember(search, guild){
		let member = null;
		if(!search || typeof search !== "string") return;
		
		if(search.match(/^<@!?(\d+)>$/)){
			const id = search.match(/^<@!?(\d+)>$/)[1];
			member = await guild.members.fetch(id).catch(() => {});
			if(member) return member;
		}
		
		if(search.match(/^!?(\w+)#(\d+)$/)){
			guild = await guild.fetch();
			member = guild.members.cache.find((m) => m.user.tag === search);
			if(member) return member;
		}
		member = await guild.members.fetch(search).catch(() => {});
		return member;
	}

	async resolveRole(search, guild){
		let role = null;
		if(!search || typeof search !== "string") return;
		
		if(search.match(/^<@&!?(\d+)>$/)){
			const id = search.match(/^<@&!?(\d+)>$/)[1];
			role = guild.roles.cache.get(id);
			if(role) return role;
		}
		
		role = guild.roles.cache.find((r) => search === r.name);
		if(role) return role;
		role = guild.roles.cache.get(search);
		return role;
	}

}

module.exports = Kaktus;
