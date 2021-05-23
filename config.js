require('dotenv').config()
module.exports = {
    //* Bot Config
    token: process.env.TOKEN,
    owner: {
        id: '470385774584397837',
        name: "Yunus'Donatello'Acar#2804",
    },
    support:{
        id:'844822853961777162',
        logs:'845006740856897596'
    },
    //* Dashboard config 
	dashboard: {
		enabled: false, 
		secret: "", 
		baseURL: "",
		logs: "", 
		port: 8080, 
		expressSessionPassword: "", 
		failureURL: ""
	},
    status: [
        { name: 'Kaktüs Bot {serversCount} Sunucuda Bulunuyor', type: 'PLAYING' },
        { name: "Developed by yunusacar.dev", type: 'PLAYING' }
    ],
    embed:{
        color: "#7a0084",
        footer:'Kaktüs Bot🌵'
    },
    prefix: "*",
    
    //* DB
    // mongoDB: 'mongodb://localhost:27017/kaktusBot',
    mongoDB: process.env.DATABASE_URL,

    //* info
    info: {
        github: 'https://github.com/yunus-acar/kaktus-bot',
    }

}