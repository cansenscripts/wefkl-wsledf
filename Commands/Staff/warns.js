const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Ruta de los archivos JSON para guardar las advertencias
const warnDataPath = path.join(__dirname, '..', '..', 'warns.json');

const adminRoleId = '1315542145796542474'; // ID del rol de administrador (modifica esto)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Advertir a un usuario')
        .addUserOption(option => option.setName('usuario').setDescription('Usuario a advertir').setRequired(true))
        .addStringOption(option => option.setName('razon').setDescription('Razón de la advertencia').setRequired(false)),

    async execute(interaction) {
        // Verifica si el usuario tiene el rol adecuado
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return interaction.reply({
                content: "🛑 No perteneces al sistema de **STAFF** por lo tanto no puedes usar este comando",
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('razon') || "Sin razón proporcionada";
        
        // Leer los datos de las advertencias
        let warns = {};
        if (fs.existsSync(warnDataPath)) {
            warns = JSON.parse(fs.readFileSync(warnDataPath, 'utf8'));
        }

        // Si el usuario no tiene advertencias, inicializa un array
        if (!warns[user.id]) {
            warns[user.id] = [];
        }

        // Agregar una nueva advertencia
        warns[user.id].push({ reason, date: new Date().toISOString() });

        // Guardar los datos en el archivo JSON
        fs.writeFileSync(warnDataPath, JSON.stringify(warns, null, 4));

        // Crear el embed para la respuesta
        const embed = new EmbedBuilder()
            .setColor('White')  // Rojo, para advertencias
            .setTitle('⚠️ Advertencia Emitida')
            .setDescription(`El usuario ${user.tag} ha sido advertido.`)
            .addFields(
                { name: 'Razón', value: reason, inline: true },
                { name: 'Fecha de Advertencia', value: new Date().toLocaleString(), inline: true }
            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 128 }))
            .setTimestamp()
            .setFooter({ text: 'Sistema de Advertencias', iconURL: 'https://example.com/icon.png' });  // Opcional: icono en el pie de página

        // Responder al usuario con el embed
        await interaction.reply({
            embeds: [embed]
        });
    }
};
