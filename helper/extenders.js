const { Guild, Message, MessageEmbed } = require("discord.js");
const config = require("../config");

Guild.prototype.translate = function(key, args) {
	const language = this.client.translations.get(this.data.language);
	if (!language) throw "Mesaj: Verilerde geçersiz dil ayarı.";
	return language(key, args);
};

Message.prototype.translate = function(key, args) {
	const language = this.client.translations.get(
		this.guild ? this.guild.data.language : "tr-TR"
	);
	if (!language) throw "Mesaj: Verilerde geçersiz dil ayarı.";
	return language(key, args);
};


Message.prototype.error = function(key, args, options = {}) {
	options.prefixEmoji = "hata";
	return this.sendT(key, args, options);
};


Message.prototype.success = function(key, args, options = {}) {
	options.prefixEmoji = "basarili";
	return this.sendT(key, args, options);
};


Message.prototype.sendT = function(key, args, options = {}) {
	let string = this.translate(key, args);
	if (options.prefixEmoji) {
		string = `${this.client.customEmojis[options.prefixEmoji]} | ${string}`;
	}
	if (options.edit) {
		return this.edit(string);
	} else {
		return this.channel.send(string);
	}
};


Message.prototype.printDate = function(date, format) {
	return this.client.printDate(date, format, this.guild.data.language);
};


Message.prototype.convertTime = function(time, type, noPrefix) {
	return this.client.convertTime(time, type, noPrefix, (this.guild && this.guild.data) ? this.guild.data.language : null);
};

MessageEmbed.prototype.errorColor = function() {
	this.setColor("#FF0000");
	return this;
};

MessageEmbed.prototype.successColor = function() {
	this.setColor("#32CD32");
	return this;
};

MessageEmbed.prototype.defaultColor = function() {
	this.setColor(config.color);
	return this;
};
