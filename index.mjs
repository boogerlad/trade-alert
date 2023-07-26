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

client.on(Events.InteractionCreate, async interaction => {
	if(interaction.isChatInputCommand() && interaction.commandName === 'moso') {
		let data = "Failed to reach trade-alert.com API";
		try {
			data = JSON.parse(await req(`https://quant.trade-alert.com/?cmd=moso&apikey=${process.env.TRADE_ALERT_API_KEY}&symbol=${interaction.options.getString('ticker')}`));
		} catch(e) {
			console.error(interaction);
			console.error(e);
		}
		await interaction.reply('bidibidibidi' + interaction.options.getString('ticker'));
	}
});

client.login(process.env.DISCORD_BOT_JWT);