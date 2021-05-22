const chalk = require("chalk");


let MongoClient;
try {
	MongoClient = require("mongodb").MongoClient;
} catch (e) {
	console.log(chalk.red('Modül mongodb bulunamıyor. Lütfen taşıma komut dosyalarını çalıştırmadan önce \"npm install mongodb \" kullanarak kurun.'));
	process.exit(1);
}

const config = require("../config.js");
const dbName = config.mongoDB.split("/").pop();
const baseURL = config.mongoDB.substr(0, config.mongoDB.length - dbName.length);
const client = new MongoClient(baseURL, {
	useUnifiedTopology: true
});
client.connect().then(async () => {
	console.log(chalk.green("MongoDB veritabanına başarıyla bağlandı."));

	const db = client.db(dbName);
	const guilds = db.collection("guilds");
	const members = db.collection("members");
	const users = db.collection("users");

	console.log(chalk.yellow("guilds  oluşturuluyor..."));
	await guilds.createIndex({ id: 1 });
	console.log(chalk.green("Guilds oluşturuldu."));

	console.log(chalk.yellow("members oluşturuluyor..."));
	await members.createIndex({ guildID: 1, id: -1 });
	console.log(chalk.green("Members oluşturuldu."));

	console.log(chalk.yellow(" users oluşturuluyor..."));
	await users.createIndex({ id: 1 });
	console.log(chalk.green("Users oluşturuldu."));

	console.log(chalk.blue("\n\nIndexes created."));

	process.exit(0);
}).catch(() => {
	console.log(chalk.red("MongoDB veritabanına bağlanılamadı..."));
	process.exit(1);
});