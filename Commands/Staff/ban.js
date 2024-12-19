const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const adminRoleId = '1315542145796542474'; // ID del rol de administrador

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Banea a un usuario del servidor.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Selecciona un usuario para banear')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('razon')
                .setDescription('Razón del baneo')
                .setRequired(false)
        ),

    async execute(interaction) {
        // Verificar si el usuario tiene el rol adecuado
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return interaction.reply({
                content: "🛑 No perteneces al sistema de **STAFF**, por lo tanto no puedes usar este comando.",
                ephemeral: true
            });
        }

        const usuario = interaction.options.getUser('usuario');
        const razon = interaction.options.getString('razon') || 'Sin razón especificada';

        // Obtener el miembro
        const miembro = await interaction.guild.members.fetch(usuario.id);

        // Intentar banear al usuario
        try {
            await miembro.ban({ reason: razon });

            // Crear Embed para mostrar el éxito
            const embed = new EmbedBuilder()
                .setColor('White')
                .setTitle('Usuario Baneado')
                .setDescription(`El usuario **${usuario.tag}** ha sido baneado del servidor.\nRazón: ${razon}`)
                .setTimestamp()
                .setFooter({ text: 'Acción realizada por ' + interaction.user.username });

            await interaction.reply({
                embeds: [embed],
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: "❌ Hubo un error al intentar banear al usuario.",
                ephemeral: true
            });
        }
    },
};
