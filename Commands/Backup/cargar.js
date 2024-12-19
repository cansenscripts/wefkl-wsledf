const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cargarbackup')
        .setDescription('Restaura un backup del servidor utilizando un código.')
        .addStringOption(option =>
            option.setName('codigo')
                .setDescription('El código del backup.')
                .setRequired(true)),
    
    async execute(interaction) {

        if (!interaction.member.roles.cache.has('1314437293922324550')) { // Verifica si es administrador
            return interaction.reply({
                content: "🛑 No perteneces al sistema de **STAFF**, por lo tanto no puedes usar este comando.",
                ephemeral: true
            });
        }

        const backupCode = interaction.options.getString('codigo');
        const filePath = path.join(__dirname, `backup_${backupCode}.json`);

        if (!fs.existsSync(filePath)) {
            return interaction.reply({
                content: "🛑 No se encontró un backup con ese código.",
                ephemeral: true
            });
        }

        const backupData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const guild = interaction.guild;

        // Diferir la respuesta para evitar el error de tiempo de espera
        await interaction.deferReply({ ephemeral: true });

        try {
            // Restaurar roles
            const roleMap = new Map();
            for (const role of backupData.roles.reverse()) {
                const createdRole = await guild.roles.create({
                    name: role.name,
                    color: role.color,
                    permissions: BigInt(role.permissions),
                    hoist: role.hoist,
                    mentionable: role.mentionable,
                    position: role.position
                });
                roleMap.set(role.id, createdRole.id);
            }

            // Restaurar categorías primero
            const categoryMap = new Map();
            for (const channel of backupData.channels.filter(c => c.type === 4)) { // Tipo 4: Categoría
                const createdCategory = await guild.channels.create({
                    name: channel.name,
                    type: 4, // Categoría
                    position: channel.position
                });
                categoryMap.set(channel.id, createdCategory.id);
            }

            // Restaurar otros canales
            for (const channel of backupData.channels.filter(c => c.type !== 4)) {
                await guild.channels.create({
                    name: channel.name,
                    type: channel.type,
                    parent: channel.parentId ? categoryMap.get(channel.parentId) : null, // Asignar a la categoría creada
                    position: channel.position,
                    topic: channel.topic || undefined,
                    nsfw: channel.nsfw || false
                });
            }

            // Editar respuesta con el resultado
            await interaction.editReply(`✅ ¡Backup restaurado exitosamente con el código \`${backupCode}\`!`);
        } catch (error) {
            console.error(error);
            await interaction.editReply("❌ Ocurrió un error al restaurar el backup.");
        }
    },
};
