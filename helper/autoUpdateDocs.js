module.exports = {
    
	
	update(client){
		const table = require("markdown-table");
		const commands = client.commands;
		const categories = [];
		commands.forEach((cmd) => {
			if(!categories.includes(cmd.help.category)){
				categories.push(cmd.help.category);
			}
		});
		let text = `# Komutlar  \nBot komutları  burada. Bu, şundan fazlasını içeriyor: **${Math.floor(commands.size/10)}0 komutlar** in **${categories.length} kategoriler**!  \n\n#### Tablonun içeriği  \n**Name**: Komutun adı  \n**Description**: Komut hakkında kısa açıklama  \n**Usage**: Komutun parametrelerde aldığı argümanlar / seçenekler komutun parametreleri alması  \n**Cooldown**: Kullanıcı tarafından tekrar çalıştırılabilmesi için her komut arasında geçmesi gereken süre\n\n`;

		categories.sort(function(a, b){
			const aCmdsLength = commands.filter((cmd) => cmd.help.category === a).array().length;
			const bCmdsLength = commands.filter((cmd) => cmd.help.category === b).array().length;
			if(aCmdsLength > bCmdsLength){
				return -1;
			} else {
				return 1;
			}
		}).forEach((cat) => {
			const arrCat = [
				[ "Name", "Description", "Usage", "Cooldown" ]
			];
			const cmds = commands.filter((cmd) => cmd.help.category === cat).array();
			text += `### ${cat} (${cmds.length} commands)\n\n`;
			cmds.sort(function(a, b){
				if(a.help.name < b.help.name) {
					return -1;
				} else {
					return 1;
				}
			}).forEach((cmd) => {
				arrCat.push([
					`**${cmd.help.name}**`,
					client.translate(`${cmd.help.category.toLowerCase()}/${cmd.help.name}:DESCRIPTION`),
					client.translate(`${cmd.help.category.toLowerCase()}/${cmd.help.name}:USAGE`),
					Math.ceil(cmd.conf.cooldown/1000)+" seconds"
				]);
			});
			text += `${table(arrCat)}\n\n`;
		});
		const fs = require("fs");
		if(fs.existsSync("./docs")){
			fs.writeFileSync("./docs/commands.md", text);
			client.logger.log("Docs updated!");
		}
	}

};