
const config = require("../config.js");
const fetch = require("node-fetch");

const chalk = require("chalk");
const success = (message) => console.log(`   ${chalk.green("✓")} ${message}`);
const error = (message, howToFix) => console.log(`   ${chalk.red("✗")} ${message}${howToFix ? ` : ${howToFix}` : ""}`);
const ignore = (message) => console.log(`   ${chalk.yellow("~")} ${message}`);


const checks = [
	() => {
		console.log("\n\nEnvironnement");
		return new Promise((res) => {
			if (parseInt(process.version.split(".")[0].split("v")[1]) >= 12) {
				success("node.js  sürümü v12'ye eşit veya daha yüksek olmalıdır");
			} else {
				error("node.js sürümü v12'ye eşit veya daha yüksek olmalıdır");
			}
			res();
		});
	},
	() => {
		console.log("\n\nDiscord Bot");
		return new Promise((res) => {
			const Discord = require("discord.js");
			const client = new Discord.Client();
			let readyResolve;
			new Promise((resolve) => readyResolve = resolve);
			client.login(config.token).then(async () => {
				success("geçerli bot tokenı olmalı");
				await readyResolve();
				if (!client.guilds.cache.has("844822853961777162")) {
					error("emoji eksik");
				} else {
					success("emoji eklendi");
				}
				res();
			}).catch(() => {
				error("token geçersiz");
				res();
			});
			client.on("hazıe", readyResolve);
		});
	},
	() => {
		console.log("\n\nMongoDB");
		return new Promise((res) => {
			const MongoClient = require("mongodb").MongoClient;
			const dbName = config.mongoDB.split("/").pop();
			const baseURL = config.mongoDB.substr(0, config.mongoDB.length - dbName.length);
			const client = new MongoClient(baseURL, {
				useUnifiedTopology: true
			});
			client.connect().then(async () => {
				success("🤠");
				res();
			}).catch(() => {
				error("veritabanına bağlanamadı", "lütfen mongodb nin çalıştığına emin olun ve mongodb urli kontrol ediniz");
				res();
			});
		});
	},
	
];

(async () => {
	console.log(chalk.purple("hata oluştu"));
	for (const check of checks) {
		await check();
	}
	console.log(chalk.purple("\n\nkaktus botu kullandığın için teşekkürler"));
	process.exit(0);
})();
