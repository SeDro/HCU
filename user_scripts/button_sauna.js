"use strict";
var actions = require('../app/actions');
var timing = undefined;

exports.run = (store) => {
	if(typeof timing !== undefined && timing >= Date.now() - 5000) {
		var item = store.state.find(item => item.TYPE == "GPIO_output" && item.Name == "Sauna");
		
		var tmp =  item.VALUE == 1 ? 0 : 1;
		
		store.dispatch(actions.updateItem({ID: item.ID, TYPE: item.TYPE, VALUE: tmp }));
		
		if(tmp == 1) setTimeout(()=> {
				var item = store.state.find(item => item.TYPE == "GPIO_output" && item.Name == "Sauna");
				if(item.VALUE == 1) store.dispatch(actions.updateItem({ID: item.ID, TYPE: item.TYPE, VALUE: 0}));
			}, 30 * 60 * 1000);
	}
	else {
		timing = Date.now();
	}
}
