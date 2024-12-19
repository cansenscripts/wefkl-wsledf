const {
    SlashCommandBuilder,
    PermissionsBitField,
} = require("discord.js");
const adminRoleId = '1315542145796542474';  // ID del rol de administrador

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rol')
        .setDescription('Asigna un rol a un usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario al que se le asignará el rol')
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName('rol')
                .setDescription('El rol que se asignará')
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
        const role = interaction.options.getRole('rol');

        // Verificar si el rol es válido y si no está asignado ya
        if (!role || !user) {
            return interaction.reply({
                content: "⚠️ No se ha proporcionado un rol o usuario válido.",
                ephemeral: true
            });
        }

        // Asignar el rol al usuario
        const member = await interaction.guild.members.fetch(user.id);
        try {
            await member.roles.add(role);
            return interaction.reply({
                content: `✅ El rol **${role.name}** ha sido asignado a **${user.username}**.`,
                ephemeral: true
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: "❌ Hubo un error al asignar el rol.",
                ephemeral: true
            });
        }
    }
};
