import { REST, Routes } from 'discord.js';
import 'dotenv/config';

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_JWT);

try {
	console.log('Started refreshing application (/) commands.');
	await rest.put(Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID), {body: [
		{
			name: 'moso',
			description: 'trade-alert.com most active stock options',
			options: [
				{
					name: 'ticker',
					description: 'for example: AAPL, AMD, aapl, amd',
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