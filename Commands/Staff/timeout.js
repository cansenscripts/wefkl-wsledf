const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const adminRoleId = '1315542145796542474'; // ID del rol de administrador

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Pon a un usuario en timeout.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Selecciona un usuario para poner en timeout')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('duracion')
                .setDescription('Duración del timeout en segundos')
                .setRequired(true)
                .setMinValue(1)
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
        const duracion = interaction.options.getInteger('duracion');

        // Obtener el miembro
        const miembro = await interaction.guild.members.fetch(usuario.id);

        // Intentar poner en timeout
        try {
            await miembro.timeout(duracion * 1000, 'Timeout por administración');

            // Crear Embed para mostrar el éxito
            const embed = new EmbedBuilder()
                .setColor('White')  // Aquí cambiaste a un color válido
                .setTitle('Usuario en Timeout')
                .setDescription(`El usuario **${usuario.tag}** ha sido puesto en timeout por ${duracion} segundos.`)
                .setTimestamp()
                .setFooter({ text: 'Acción realizada por ' + interaction.user.username });

            await interaction.reply({
                embeds: [embed],
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: "❌ Hubo un error al intentar poner al usuario en timeout.",
                ephemeral: true
            });
        }
    },
};
