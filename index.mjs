import 'dotenv/config';
import { Client, Events, GatewayIntentBits } from 'discord.js';

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

import * as https from 'https';

function req(url, method, headers, body) {
	return new Promise((resolve, reject) => {
		let req = https.request(url, {headers, method}, resp => {
			if(resp.statusCode !== 200) {
				reject({"statusCode" : resp.statusCode});
			}
			let data = '';
			resp.on('data', chunk => data += chunk);
			resp.on('end', () => resolve(data));
		}).on("error", reject);
		if(body) {
			req.write(body);
		}
		req.end();
	});
}

import { spawn } from 'node:child_process';

client.on(Events.InteractionCreate, async interaction => {
	if(interaction.isChatInputCommand() && interaction.commandName === 'moso') {
		let data = "Failed to reach trade-alert.com API";
		try {
			let externalresolve;
			let p = new Promise((resolve, reject) => {
				externalresolve = resolve;
			});
			data = (await req(`https://quant.trade-alert.com/?cmd=moso&apikey=${process.env.TRADE_ALERT_API_KEY}&symbol=${interaction.options.getString('ticker')}`));
			const column = spawn('column', ['-t']);
			let data2 = [];
			column.stdout.on('data', d => data2.push(d.toString()));
			column.stdin.write(data);
			column.stdin.end();
			column.on('close', async code => {
				if(code === 0) {
					await interaction.reply('```' + data2.join('\n').slice(0, 1900) + '```');
					externalresolve();
				} else {
					console.log(`grep process exited with code ${code}`);
				}
			});
			return p;
		} catch(e) {
			console.error(interaction);
			console.error(e);
		}
	}
});

client.login(process.env.DISCORD_BOT_JWT);