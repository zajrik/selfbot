import { Bot } from 'yamdbf';
import * as path from 'path';
const config: any = require('./config.json');

const bot: Bot = new Bot({ // tslint:disable-line
	name: 'selfbot',
	token: config.token,
	config: config,
	version: '2.0.0',
	readyText: 'Ready!\u0007',
	selfbot: true,
	commandsDir: path.join(__dirname, 'commands'),
	disableBase: [
		'listgroups',
		'disablegroup',
		'enablegroup'
	]
})
.setDefaultSetting('prefix', '!')
.start()
.on('disconnect', () => process.exit(100));
