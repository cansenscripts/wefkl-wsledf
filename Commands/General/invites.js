const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invitaciones')
        .setDescription('Muestra el número de invitaciones que ha realizado un usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario del cual deseas ver las invitaciones')
                .setRequired(false)
        ),

    async execute(interaction) {
        // Verificar si el usuario tiene el rol adecuado

        const user = interaction.options.getUser('usuario') || interaction.user;
        
        // Obtener todas las invitaciones en el servidor
        const invites = await interaction.guild.invites.fetch();

        // Buscar la invitación del usuario seleccionado
        const userInvites = invites.filter(invite => invite.inviter.id === user.id);

        // Calcular cuántas invitaciones ha hecho el usuario
        const totalInvites = userInvites.reduce((acc, invite) => acc + invite.uses, 0);

        // Crear un embed para mostrar la información
        const embed = new EmbedBuilder()
            .setColor('#ffffff')
            .setTitle('Estadísticas de Invitaciones')
            .setDescription(`Aquí están los datos de invitaciones de **${user.username}**`)
            .addFields(
                { name: 'Usuario', value: `${user.username}`, inline: true },
                { name: 'Total de Invitaciones', value: `${totalInvites}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Comando de invitaciones', iconURL: interaction.user.avatarURL() });

        // Enviar el embed
        if (totalInvites === 0) {
            embed.addFields({ name: 'Estado', value: 'Este usuario no tiene invitaciones registradas.' });
        }

        return interaction.reply({ embeds: [embed] });
    }
};
