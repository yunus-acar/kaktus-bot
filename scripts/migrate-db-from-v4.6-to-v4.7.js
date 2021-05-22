const chalk = require("chalk");


let MongoClient;
try {
	MongoClient = require("mongodb").MongoClient;
} catch (e) {
	console.log(chalk.red("mongodb modülü bulunamıyor. Lütfen çalıştırmadan önce \"yarn add mongodb\" kullanarak kurun."));
	process.exit(1);
}

const config = require("../config.js");
const dbName = config.mongoDB.split("/").pop();
const baseURL = config.mongoDB.substr(0, config.mongoDB.length - dbName.length);
const client = new MongoClient(baseURL, {
	useUnifiedTopology: true
});
client.connect().then(async () => {
	console.log(chalk.green("veritabanına başarıyla bağlandı"));
   
	const db = client.db(dbName);
	const guilds = db.collection("guilds");

	const count = await guilds.countDocuments({ $or: { language: "turkish" } });
	console.log(chalk.yellow(`${count} guildlerin taşınması gerekiyor. Bekleyiniz...`));
	
	await guilds.updateMany({ language: "turkish" });
	
	
    
	console.log(chalk.green(`${count} guild `));
	process.exit(0);
}).catch(() => {
	console.log(chalk.red("veritabanına bağlanılmadı"));
	process.exit(1);
});