const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crearbackup')
        .setDescription('Crea una copia de seguridad del servidor (canales, roles, categorías, etc.).'),
    
    async execute(interaction) {
        if (!interaction.member.roles.cache.has('1314437293922324550')) { // Verifica si es administrador
            return interaction.reply({
                content: "🛑 No perteneces al sistema de **STAFF**, por lo tanto no puedes usar este comando.",
                ephemeral: true
            });
        }

        const guild = interaction.guild;

        const backupData = {
            guildName: guild.name,
            guildId: guild.id,
            roles: guild.roles.cache.map(role => ({
                id: role.id,
                name: role.name,
                color: role.color,
                permissions: role.permissions.bitfield.toString(), // Convertimos BigInt a string
                position: role.position,
                hoist: role.hoist,
                mentionable: role.mentionable
            })),
            channels: guild.channels.cache.map(channel => ({
                id: channel.id,
                name: channel.name,
                type: channel.type,
                parentId: channel.parentId,
                position: channel.position,
                topic: channel.topic,
                nsfw: channel.nsfw
            }))
        };

        const backupCode = crypto.randomBytes(4).toString('hex'); // Genera un código único
        const filePath = path.join(__dirname, `backup_${backupCode}.json`);

        try {
            fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2)); // Guarda el JSON en un archivo
            await interaction.reply({
                content: `✅ ¡Backup creado exitosamente! Código: \`${backupCode}\`\nEl archivo de respaldo ha sido guardado.`,
                ephemeral: true
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "❌ Ocurrió un error al crear el backup.",
                ephemeral: true
            });
        }
    },
};
