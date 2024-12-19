const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Ruta de los archivos JSON para guardar las advertencias
const warnDataPath = path.join(__dirname, '..', '..', 'warns.json');

const adminRoleId = '1315542145796542474'; // ID del rol de administrador (modifica esto)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verwarns')
        .setDescription('Ver las advertencias de un usuario')
        .addUserOption(option => option.setName('usuario').setDescription('Usuario del que ver las advertencias').setRequired(true)),

    async execute(interaction) {
        // Verificar si el usuario tiene el rol adecuado
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return interaction.reply({
                content: "🛑 No perteneces al sistema de **STAFF** por lo tanto no puedes usar este comando",
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('usuario');

        // Leer los datos de las advertencias
        let warns = {};
        if (fs.existsSync(warnDataPath)) {
            warns = JSON.parse(fs.readFileSync(warnDataPath, 'utf8'));
        }

        // Verificar si el usuario tiene advertencias
        if (!warns[user.id] || warns[user.id].length === 0) {
            return interaction.reply({
                content: `🔍 **El usuario ${user.tag} no tiene advertencias.**`,
                ephemeral: true
            });
        }

        // Mostrar las advertencias del usuario
        const warnList = warns[user.id]
            .map((warn, index) => `**#${index + 1}** - **Razón**: ${warn.reason} | **Fecha**: ${warn.date}`)
            .join('\n');

        // Crear el embed con las advertencias
        const embed = new EmbedBuilder()
            .setTitle(`📋 **Advertencias de ${user.tag}**`)
            .setDescription(warnList)
            .setColor('White')  // Color amarillo para destacar
            .setTimestamp()
            .setFooter({ text: `Solicitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        // Enviar el embed con las advertencias
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
