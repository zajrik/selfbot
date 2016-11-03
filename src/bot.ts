import { Bot } from 'yamdbf';
import * as path from 'path';
const config = require('./config.json');

const bot: Bot = new Bot({ // tslint:disable-line
	name: 'selfbot',
	token: config.token,
	config: config,
	version: '2.0.0',
	statusText: null,
	selfbot: true,
	commandsDir: path.join(__dirname, 'commands')
})
.setDefaultSetting('prefix', '!')
.start()
.on('ready', () => console.log('\u0007'));
