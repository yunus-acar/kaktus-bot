const mongoose = require("mongoose");

module.exports = mongoose.model("Member", new mongoose.Schema({

	id: { type: String }, 
	guildID: { type: String }, 

	
	money: { type: Number, default: 0 }, 
	workStreak: { type: Number, default: 0 }, 
	bankSold: { type: Number, default: 0 }, 
	exp: { type: Number, default: 0 }, 
	level: { type: Number, default: 0 }, 

	
	registeredAt: { type: Number, default: Date.now() }, 

	
	cooldowns: { type: Object, default: {
		work: 0,
		rob: 0
	}},

	
	sanctions: { type: Array, default: [] }, 
	mute: { type: Object, default: {
		muted: false,
		case: null,
		endDate: null
	}},
    
}));