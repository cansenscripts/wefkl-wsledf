const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField
} = require("discord.js");

module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember) {
        // Verificar si el usuario comenzó a boostear el servidor
        if (!oldMember.premiumSince && newMember.premiumSince) {
            const channelId = '1315536949162803242'; // Reemplaza con el ID de tu canal
            const channel = newMember.guild.channels.cache.get(channelId);

            if (!channel) {
                console.error(`No se encontró el canal con ID ${channelId}`);
                return;
            }

            // Crear el botón para reclamar recompensa
            const button = new ButtonBuilder()
                .setCustomId(`boost_${newMember.id}`)
                .setLabel('Reclamar recompensa')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(button);

            // Crear un mensaje de agradecimiento
            const embed = new EmbedBuilder()
                .setTitle('¡Gracias por impulsar el servidor!')
                .setDescription(
                    `🎉 **${newMember.user.tag}**, gracias por boostear el servidor. ¡Haz clic en el botón de abajo para reclamar tu recompensa!`
                )
                .setColor('F47FFF')
                .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            // Enviar el mensaje
            await channel.send({ embeds: [embed], components: [row] });
        }
    },
};
