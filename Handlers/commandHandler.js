const { readdirSync } = require("fs");
const path = require("path");

async function loadCommands(client) {
    const commandsPath = path.join(__dirname, "../Commands");
    const commandFolders = readdirSync(commandsPath);

    for (const folder of commandFolders) {
        const folderPath = path.join(commandsPath, folder);
        const commandFiles = readdirSync(folderPath).filter(file => file.endsWith(".js"));

        for (const file of commandFiles) {
            const filePath = path.join(folderPath, file);
            const command = require(filePath);

            if ("data" in command && "execute" in command) {
                client.commands.set(command.data.name, command);
                console.log(`Loaded command: ${command.data.name}`);
            } else {
                console.warn(`Skipped loading invalid command at ${filePath}. Missing "data" or "execute".`);
            }
        }
    }

    // Register commands globally for the bot
    try {
        console.log("Registering global commands...");
        await client.application.commands.set(client.commands.map(cmd => cmd.data));
        console.log("Global commands registered successfully.");
    } catch (error) {
        console.error("Failed to register global commands:", error);
    }
}

module.exports = { loadCommands };
