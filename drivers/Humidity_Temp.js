"use strict";
var item_base = require('../app/item_base');

module.exports = class GPIO_output extends item_base {
	constructor(item, store) {
		super(item, store);
	}
	
	user_detailed_view() {
		var tmp = super.user_detailed_view();
		tmp.New_Battery = this.New_Battery;
		tmp.Bit12 = this.Bit12;
		tmp.Temp = this.Temp;
		tmp.Weak_Battery = this.Weak_Battery;
		tmp.Humidity = this.Humidity;
		tmp.Humidity_Abs = this.Humidity_Abs;
		return tmp;
	}
	
	update(item){
		for(var key in item) {
			if(item[key] != this[key]) {
				return super.update(item);
			}
		}
		return false;
	}
}

