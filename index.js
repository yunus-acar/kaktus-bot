require("./helper/extenders");


const util = require("util")
const fs = require("fs")
const readdir = util.promisify(fs.readdir)
const mongoose = require("mongoose")



const kaktus = require("./main/kaktus"),
	client = new kaktus();

const init = async () => {

	
	const directories = await readdir("./commands/");
	client.logger.log(`${directories.length} komut yükleniyor .`, "log");
	directories.forEach(async (dir) => {
		const commands = await readdir("./commands/" + dir + "/");
		commands.filter((cmd) => cmd.split(".").pop() === "js").forEach((cmd) => {
			const response = client.loadCommand("./commands/" + dir, cmd);
			if (response) {
				client.logger.log(response, "error");
			}
		});
	});


	const evtFiles = await readdir("./events/");
	client.logger.log(`Toplam  ${evtFiles.length} eventlar yükleniyor`, "log");
	evtFiles.forEach((file) => {
		const eventName = file.split(".")[0];
		client.logger.log(`event Yükleniyor ${eventName}`);
		const event = new (require(`./events/${file}`))(client);
		client.on(eventName, (...args) => event.run(...args));
		delete require.cache[require.resolve(`./events/${file}`)];
	});

	client.login(client.config.token);


	mongoose.connect(client.config.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
		client.logger.log("veritabanına bağlandı.", "log");
	}).catch((err) => {
		client.logger.log("veritabanına bağlanılamıyor. Hatas:" + err, "error");
	});

	const languages = require("./helper/languages");
	client.translations = await languages();

	const autoUpdateDocs = require("./helper/autoUpdateDocs.js");
	autoUpdateDocs.update(client);

};

init();


client.on("disconnect", () => client.logger.log("Bot bağlantısı kesiliyor...", "error"))
	.on("reconnecting", () => client.logger.log("Bot  yeniden bağlanıyor ...", "log"))
	.on("error", (e) => client.logger.log(e, "error"))
	.on("warn", (info) => client.logger.log(info, "warn"));


process.on("unhandledRejection", (err) => {
	console.error(err);
});
