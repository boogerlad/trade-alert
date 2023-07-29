import { REST, Routes } from 'discord.js';
import 'dotenv/config';

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_JWT);

try {
	console.log('Started refreshing application (/) commands.');
	await rest.put(Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID), { body: [] });
	await rest.put(Routes.applicationGuildCommands(process.env.DISCORD_APPLICATION_ID, process.env.DISCORD_GUILD_ID), {body: [
		{
			name: 'ta',
			description: 'https://trade-alert.com/jbot/launch/',
			options: [
				{
					name: 'command',
					description: 'for example: /moso amd, /oichg tsla, aapl, /oichg @top50, /top nvda where buyer and not complex',
					type: 3, // Type 3 represents a string.
					required: true,
				},
			],
		},
	]});
	console.log('Successfully reloaded application (/) commands.');
} catch (error) {
	console.error(error);
}