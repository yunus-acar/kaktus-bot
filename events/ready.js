const chalk = require("chalk");

module.exports = class {

	constructor (client) {
		this.client = client;
	}

	async run () {

		const client = this.client;

		client.logger.log(`${client.commands.size} Toplam komut yükleniyor`, "log");
		client.logger.log(`${client.user.tag}, servise hazır ${client.users.cache.size} , ${client.guilds.cache.size} server.`, "ready");

		

		
		const checkUnmutes = require("../helper/checkUnmutes.js");
		checkUnmutes.init(client);

		const checkReminds = require("../helper/checkReminds.js");
		checkReminds.init(client);


		
		

		const status = require("../config.js").status,
			version = require("../package.json").version;
		let i = 0;
		setInterval(function(){
			const toDisplay = status[parseInt(i, 10)].name.replace("{serversCount}", client.guilds.cache.size)+" | v"+version;
			client.user.setActivity(toDisplay, {
				type: status[parseInt(i, 10)].type
			});
			if(status[parseInt(i+1, 10)]) i++;
			else i = 0;
		}, 20000); 

		setTimeout(() => {
			console.log(chalk.magenta("\n\nDonatello is here!!!"), " 🐢💜🌵   https://github.com/yunus-acar/");
		}, 400);

	}
};  