const fs = require('fs');
const path = require('path');

// Ruta al archivo de configuración
const configPath = path.join(__dirname, '..', 'verifyConfig.json');

module.exports = {
    customId: "verify_button",
    async execute(interaction) {
        // Cargar la configuración desde el archivo JSON
        let config = {};
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }

        const roleId = config[interaction.guildId]; // Obtener el rol configurado para la verificación
        if (!roleId) {
            return interaction.reply({
                content: 'El rol de verificación no está configurado en este servidor.',
                ephemeral: true,
            });
        }

        const role = interaction.guild.roles.cache.get(roleId);
        if (!role) {
            return interaction.reply({
                content: 'El rol configurado ya no existe. Por favor, contacta a un administrador.',
                ephemeral: true,
            });
        }

        // Verificar si el usuario ya tiene el rol
        if (interaction.member.roles.cache.has(role.id)) {
            return interaction.reply({
                content: 'Ya estás verificado y tienes el rol asignado.',
                ephemeral: true,
            });
        }

        try {
            // Otorgar el rol al miembro que hizo clic en el botón
            await interaction.member.roles.add(role);
            await interaction.reply({
                content: '¡Te has verificado con éxito y se te ha otorgado el rol!',
                ephemeral: true,
            });
        } catch (error) {
            console.error('Error al otorgar el rol:', error);
            return interaction.reply({
                content: 'Hubo un error al intentar darte el rol. Por favor, contacta al staff.',
                ephemeral: true,
            });
        }
    },
};
