const {
    SlashCommandBuilder,
    PermissionsBitField,
} = require("discord.js");
const adminRoleId = '1315542145796542474';  // ID del rol de administrador

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dm')
        .setDescription('Envía un mensaje privado a un usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario al que se le enviará el mensaje')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('mensaje')
                .setDescription('El mensaje que se enviará al usuario')
                .setRequired(true)
        ),

    async execute(interaction) {
        // Verificar si el usuario tiene el rol adecuado
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return interaction.reply({
                content: "🛑 No perteneces al sistema de **STAFF**, por lo tanto no puedes usar este comando.",
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('usuario');
        const mensaje = interaction.options.getString('mensaje');

        // Intentar enviar el mensaje privado
        try {
            await user.send(mensaje);
            return interaction.reply({
                content: `✅ El mensaje ha sido enviado a **${user.username}**.`,
                ephemeral: true
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: `❌ No se pudo enviar el mensaje a **${user.username}**. Puede que el usuario tenga los mensajes directos deshabilitados.`,
                ephemeral: true
            });
        }
    }
};
