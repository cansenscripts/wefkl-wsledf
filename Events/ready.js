const { ActivityType } = require('discord.js');

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log(`Logged in as ${client.user.tag}!`);
        console.log("Bot is online and ready to use Slash Commands.");

        // ID del servidor en el que quieres contar los miembros
        const serverId = '1314424593322213396'; // Reemplaza con el ID de tu servidor

        // Obtener el servidor por su ID
        const guild = client.guilds.cache.get(serverId);

        if (guild) {
            // Obtener el número total de miembros de ese servidor
            const totalMembers = guild.memberCount;

            // Establecer la actividad del bot
            client.user.setActivity(`👀 ${totalMembers} usuarios`, { type: ActivityType.Watching });
        } else {
            console.log('No se encontró el servidor con ese ID.');
        }
    },
};
