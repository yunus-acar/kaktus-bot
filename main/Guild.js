const mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	config = require("../config.js"),
	languages = require("../languages/language-meta.json");

module.exports = mongoose.model("Guild", new Schema({

	id: { type: String }, 
    
	
	membersData: { type: Object, default: {} }, 
	members: [{ type: Schema.Types.ObjectId, ref: "Member" }],

	/* CONFIGURATION */
	language: { type: String, default: languages.find((l) => l.default).name }, 
	prefix: { type: String, default: config.prefix }, 
	plugins: { type: Object, default: { 
		
		welcome: {
			enabled: false, 
			message: null, 
			channel: null, 
			withImage: null 
		},
		
		goodbye: {
			enabled: false,
			message: null, 
			channel: null, 
			withImage: null
		},
		
		autorole: {
			enabled: false,
			role: null 		
		},
		
		automod: {
			enabled: false,
			ignored: [] 	
		},
		
		warnsSanctions: {
			kick: false, 
			ban: false 	
		},
		
		tickets: {
			enabled: false,
			category: null 
		},
		suggestions: false, 	
		modlogs: false, 		
		reports: false, 		
		fortniteshop: false, 	
		logs: false 			
	}},
	slowmode: { type: Object, default: { 
		users: [],
		channels: []
	}},
	casesCount: { type: Number, default: 0 },
	ignoredChannels: { type: Array, default: [] }, 
	customCommands: { type: Array, default: [] },
	commands: { type: Array, default: [] }, 
	autoDeleteModCommands: { type: Boolean, default: false }, 
	disabledCategories: { type: Array, default: [] } 
}));
