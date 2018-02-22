"use strict";
var actions = require('./app/actions');
var Store = require('./app/Store');
var Server = require('./app/Server');
var tmp = 0;

console.log('Starting initialisation');

const store = new Store();
/*
store.dispatch(actions.createItem({ ID: '2',  TYPE: 'GPIO_push_button', Name: 'Waschraum'}));
store.dispatch(actions.createItem({ ID: '44',  TYPE: 'Humidity_Temp', Name: 'Außen'}));
store.dispatch(actions.createItem({ ID: '4',  TYPE: 'Humidity_Temp', Name: 'Groß'}));
store.dispatch(actions.createItem({ ID: '32',  TYPE: 'Humidity_Temp', Name: 'Spiel'}));
store.dispatch(actions.createItem({ ID: '60',  TYPE: 'Humidity_Temp', Name: 'Waschraum'}));
store.dispatch(actions.createItem({ ID: '25',  TYPE: 'GPIO_push_button', Name: 'Sauna'}));
store.dispatch(actions.createItem({ ID: '17',  TYPE: 'GPIO_output', Name: 'Waschraum'}));
store.dispatch(actions.createItem({ ID: '23',  TYPE: 'GPIO_output', Name: 'Sauna'}));
store.dispatch(actions.createItem({ ID: '24',  TYPE: 'GPIO_output', Name: 'Groß'}));
store.dispatch(actions.createItem({ ID: '1',  TYPE: 'Script', Name: 'button_waschraum', Trigger: [{Name: 'Waschraum', TYPE: 'GPIO_push_button'}]}));
store.dispatch(actions.createItem({ ID: '2',  TYPE: 'Script', Name: 'button_sauna', Trigger: [{Name: 'Sauna', TYPE: 'GPIO_push_button'}]}));
store.dispatch(actions.createItem({ ID: '3',  TYPE: 'Script', Name: 'humidity_groß', Trigger: [{Name: 'Außen', TYPE: 'Humidity_Temp'}, {Name: 'Groß', TYPE: 'Humidity_Temp'}]}));
store.dispatch(actions.createItem({ ID: '4',  TYPE: 'Script', Name: 'humidity_spiel', Trigger: [{Name: 'Außen', TYPE: 'Humidity_Temp'}, {Name: 'Spiel', TYPE: 'Humidity_Temp'}]}));
store.dispatch(actions.createItem({ ID: '5',  TYPE: 'Script', Name: 'humidity_waschraum', Trigger: [{Name: 'Außen', TYPE: 'Humidity_Temp'}, {Name: 'Waschraum', TYPE: 'Humidity_Temp'}]}));
*/

const test = new Server(store);

console.log('Ready for experiments');

process.on('SIGINT', () => {
	store.dispose();
	process.exit();
});
