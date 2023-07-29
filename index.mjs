import 'dotenv/config';
import { Client, Events, GatewayIntentBits, AttachmentBuilder, EmbedBuilder } from 'discord.js';

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});
let channel;
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
	channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
});

import gm from 'gm';
const im = gm.subClass({ imageMagick: true });

import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
page.setViewportSize({ width: 2000, height: 2000 })
async function login() {
	await page.goto("https://trade-alert.com/jbot/launch/");
	await page.locator("#username").fill(process.env.TRADE_ALERT_USERNAME);
	await page.locator("#password").fill(process.env.TRADE_ALERT_PASSWORD);
	await page.locator('input[value="Login"]').click();
}
await login();
page.on('response', async response => {
	console.log('<<', response.status(), response.url());
	if(response.url() === 'https://trade-alert.com/http-bind') {
		try {
		let t = await response.text()
		console.log(t);
		if(t.includes('terminate')) {
			await login();
		} else {
			let r = await page.evaluate(() => {
				let n = document.querySelector('.incoming:last-of-type .ta-small');
				if(n && window.x !== n) {
					window.x = n;
					if(n.querySelector('table')) {
						return 'picture';
					} else {
						return n.innerText;
					}
				}
			});
			if(r) {
				if(r === 'picture') {
					im(await page.locator('.incoming:last-of-type .ta-small').screenshot())
					.trim()
					.toBuffer('PNG', function(err, buffer) {
						if(err) {
							return console.error(err);
						}
						channel.send({files: [new AttachmentBuilder(buffer)]});
					});
				} else {
					channel.send(r);
				}
			}
		}
		} catch(e) {
			console.error(e);
		}
	}
});

client.on(Events.InteractionCreate, async interaction => {
	if(interaction.isChatInputCommand() && interaction.commandName === 'ta') {
		await page.locator('#msgArea').fill(interaction.options.getString('command'));
		await page.locator('#send-command-btn').click();
		await interaction.reply('sent command to terminal');
	}
});

client.login(process.env.DISCORD_BOT_JWT);