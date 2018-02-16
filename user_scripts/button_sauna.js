"use strict";
var actions = require('../app/actions');

exports.run = (store) => {
		var item = store.state.find(item => item.TYPE == "GPIO_output" && item.Name == "Sauna");
		
		var tmp =  item.VALUE == 1 ? 0 : 1;
		
		store.dispatch(actions.updateItem({ID: item.ID, TYPE: item.TYPE, VALUE: tmp }));
		
		if(tmp == 1) setTimeout(()=> {
				var item = store.state.find(item => item.TYPE == "GPIO_output" && item.Name == "Sauna");
				if(item.VALUE == 1) store.dispatch(actions.updateItem({ID: item.ID, TYPE: item.TYPE, VALUE: 0}));
			}, 30 * 60 * 1000);
}
