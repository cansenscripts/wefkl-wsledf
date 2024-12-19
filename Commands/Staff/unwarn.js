const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Ruta de los archivos JSON para guardar las advertencias
const warnDataPath = path.join(__dirname, '..', '..', 'warns.json');

const adminRoleId = '1315542145796542474'; // ID del rol de administrador (modifica esto)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unwarn')
        .setDescription('Eliminar una advertencia de un usuario')
        .addUserOption(option => option.setName('usuario').setDescription('Usuario al que se le eliminará la advertencia').setRequired(true))
        .addIntegerOption(option => option.setName('numero').setDescription('Número de la advertencia que se eliminará').setRequired(true)),

    async execute(interaction) {
        // Verificar si el usuario tiene el rol adecuado
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return interaction.reply({
                content: "🛑 No perteneces al sistema de **STAFF** por lo tanto no puedes usar este comando",
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('usuario');
        const warnIndex = interaction.options.getInteger('numero') - 1;

        // Leer los datos de las advertencias
        let warns = {};
        if (fs.existsSync(warnDataPath)) {
            warns = JSON.parse(fs.readFileSync(warnDataPath, 'utf8'));
        }

        // Verificar si el usuario tiene advertencias
        if (!warns[user.id] || warns[user.id].length <= warnIndex) {
            return interaction.reply({
                content: `❌ **El usuario ${user.tag} no tiene una advertencia con ese número.**`,
                ephemeral: true
            });
        }

        // Eliminar la advertencia seleccionada
        warns[user.id].splice(warnIndex, 1);

        // Guardar los datos en el archivo JSON
        fs.writeFileSync(warnDataPath, JSON.stringify(warns, null, 4));

        // Responder con confirmación
        await interaction.reply({
            content: `✅ **La advertencia número ${warnIndex + 1} de ${user.tag} ha sido eliminada exitosamente.**`,
            ephemeral: true
        });
    }
};
