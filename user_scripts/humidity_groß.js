"use strict";
var actions = require('../app/actions');

exports.run = (store) => {
		var tmp = new Date();
		var time = tmp.getHours();
		var item_in = store.state.find(item => item.TYPE == "Humidity_Temp" && item.Name == "Groß");
		var item_out = store.state.find(item => item.TYPE == "Humidity_Temp" && item.Name == "Außen");
		if(time >= 0 && time <= 3) {
			if(typeof item_in.Humidity_Abs !== undefined && typeof items_out.Humidity_Abs !== undefined && item_in.Humidity_Abs >= item_out.Humidity_Abs) {
				var item = store.state.find(item => item.TYPE == "GPIO_output" && item.Name == "Groß");
				store.dispatch(actions.updateItem({ID: item.ID, TYPE: item.TYPE, VALUE: 1 }));
				setTimeout(()=> {
					var item = store.state.find(item => item.TYPE == "GPIO_output" && item.Name == "Groß");
					if(item.VALUE == 1) store.dispatch(actions.updateItem({ID: item.ID, TYPE: item.TYPE, VALUE: 0}));
				}, 30 * 60 * 1000);
			}
		}
}
