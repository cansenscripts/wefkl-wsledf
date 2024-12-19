const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const adminRoleId = '1315542145796542474'; // ID del rol de administrador

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulsar a un miembro del servidor.')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Miembro a expulsar')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('razon')
                .setDescription('Razón de la expulsión')
                .setRequired(false)),

    async execute(interaction) {
        // Verificar si el usuario tiene el rol adecuado
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return interaction.reply({
                content: "🛑 No perteneces al sistema de **STAFF**, por lo tanto no puedes usar este comando.",
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('razon') || "Sin razon";

        // Verificar si el usuario tiene permisos para expulsar
        if (!interaction.guild.members.me.permissions.has('KICK_MEMBERS')) {
            return interaction.reply({
                content: "❌ No tengo permisos para expulsar miembros.",
                ephemeral: true
            });
        }

        try {
            // Expulsar al miembro
            const member = await interaction.guild.members.fetch(user.id);

            // Si el miembro está en línea, intentar expulsarlo
            if (member) {
                await member.kick(reason);

                // Crear el embed para la confirmación
                const embed = new EmbedBuilder()
                    .setColor('White')
                    .setTitle('👢 Miembro Expulsado')
                    .setDescription(`✅ El usuario ${user.tag} ha sido expulsado del servidor. Razón: ${reason}`)
                    .setTimestamp()
                    .setFooter({ text: 'Comando ejecutado por ' + interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [embed], ephemeral: false });
            } else {
                return interaction.reply({
                    content: `❌ No pude encontrar al usuario ${user.tag} en el servidor.`,
                    ephemeral: true
                });
            }

        } catch (error) {
            console.error("Error al expulsar al miembro:", error);
            return interaction.reply({
                content: "❌ Ocurrió un error al intentar expulsar al miembro.",
                ephemeral: true
            });
        }
    }
};
