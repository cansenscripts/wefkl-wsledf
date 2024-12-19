const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMessages, MessageContent, GuildMembers } = GatewayIntentBits;
const { User, GuildMember } = Partials;

const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");
const { loadButtons } = require("./Handlers/buttonHandler");

const client = new Client({
    intents: [Guilds, GuildMessages, MessageContent, GuildMembers],
    partials: [User, GuildMember],
});

client.config = require("./config.json");
client.commands = new Collection();
client.buttons = new Collection();

// Almacenar la configuración de los tickets
client.ticketConfig = {};

client.once("ready", async () => {
    await loadCommands(client);
    await loadButtons(client);  // Cargar los botones aquí
    console.log("Commands and buttons loaded.");
});

loadEvents(client);

client.login(client.config.token)
    .then(() => console.log("Bot successfully logged in!"))
    .catch(err => console.error("Login failed:", err));
