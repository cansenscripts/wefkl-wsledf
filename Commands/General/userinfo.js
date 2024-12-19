const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Obtén información sobre un usuario.")
        .addUserOption(option =>
            option.setName("objetivo")
                .setDescription("El usuario del que quieres obtener información.")
        ),
    async execute(interaction) {
        const user = interaction.options.getUser("objetivo") || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);
        const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });

        const embed = {
            color: 0x0099ff,
            title: `ℹ️ Información de ${user.tag}`,
            thumbnail: {
                url: avatarURL,
            },
            fields: [
                { name: "🆔 ID de Usuario", value: user.id, inline: true },
                { name: "👤 Nombre de Usuario", value: user.username, inline: true },
                { name: "#️⃣ Discriminador", value: `#${user.discriminator}`, inline: true },
                { name: "📅 Se unió al servidor", value: member?.joinedAt?.toDateString() || "Desconocido", inline: true },
                { name: "📆 Cuenta creada", value: user.createdAt.toDateString(), inline: true },
            ],
            timestamp: new Date(),
        };

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("📥 Descargar Avatar")
                .setStyle(ButtonStyle.Link)
                .setURL(avatarURL)
        );

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
